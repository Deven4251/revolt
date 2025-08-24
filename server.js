// server.js - Complete Node.js/Express server for Gemini Live API voice chat
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { GoogleGenAI } = require('@google/genai');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Initialize Gemini AI client
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Serve static files
app.use(express.static('public'));
app.use(express.json());

// Store active Gemini Live sessions
const activeSessions = new Map();

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);

            switch (data.type) {
                case 'start_session':
                    await startGeminiSession(ws, data.sessionId);
                    break;

                case 'audio_data':
                    await sendAudioToGemini(ws, data.sessionId, data.audio);
                    break;

                case 'interrupt':
                    await handleInterruption(ws, data.sessionId);
                    break;

                case 'end_session':
                    await endGeminiSession(ws, data.sessionId);
                    break;
            }
        } catch (error) {
            console.error('Error handling message:', error);
            ws.send(JSON.stringify({ type: 'error', message: error.message }));
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        // Clean up any active sessions for this client
        activeSessions.forEach((session, sessionId) => {
            if (session.clientWs === ws) {
                session.geminiSession.close();
                activeSessions.delete(sessionId);
            }
        });
    });
});

async function startGeminiSession(clientWs, sessionId) {
    try {
        // Configuration for Gemini Live API
        const config = {
            responseModalities: ['AUDIO'],
            systemInstruction: `You are Rev, a helpful AI assistant for Revolt Motors, India's leading electric motorcycle company.
            You help customers with information about Revolt's electric bikes including RV400, RV1, RV1+, RV BlazeX, and RV400 BRZ.
            Provide accurate information about pricing, specifications, features, charging, and dealership locations.
            Be conversational, helpful, and enthusiastic about electric mobility.`,
            generationConfig: {
                temperature: 0.7,
                topP: 0.9,
                maxOutputTokens: 2048,
            },
            realtimeInputConfig: {
                automaticActivityDetection: {
                    enabled: true
                }
            }
        };

        // Connect to Gemini Live API
        const session = await genAI.live.connect({
            model: 'gemini-2.0-flash-live-001', // Use for development
            // model: 'gemini-2.5-flash-preview-native-audio-dialog', // Use for production
            config: config,
            callbacks: {
                onopen: () => {
                    console.log(`Gemini session ${sessionId} opened`);
                    clientWs.send(JSON.stringify({
                        type: 'session_started',
                        sessionId: sessionId
                    }));
                },
                onmessage: (message) => {
                    handleGeminiResponse(clientWs, sessionId, message);
                },
                onerror: (error) => {
                    console.error(`Gemini session ${sessionId} error:`, error);
                    clientWs.send(JSON.stringify({
                        type: 'error',
                        message: error.message
                    }));
                },
                onclose: () => {
                    console.log(`Gemini session ${sessionId} closed`);
                    activeSessions.delete(sessionId);
                }
            }
        });

        // Store session reference
        activeSessions.set(sessionId, {
            geminiSession: session,
            clientWs: clientWs,
            createdAt: new Date()
        });

    } catch (error) {
        console.error('Error starting Gemini session:', error);
        clientWs.send(JSON.stringify({
            type: 'error',
            message: 'Failed to start AI session'
        }));
    }
}

async function sendAudioToGemini(clientWs, sessionId, audioData) {
    const sessionInfo = activeSessions.get(sessionId);
    if (!sessionInfo) {
        clientWs.send(JSON.stringify({
            type: 'error',
            message: 'No active session found'
        }));
        return;
    }

    try {
        // Send audio data to Gemini Live API
        // Audio should be in 16-bit PCM, 16kHz, mono format
        await sessionInfo.geminiSession.sendRealtimeInput({
            audio: {
                data: audioData, // Base64 encoded audio
                mimeType: 'audio/pcm;rate=16000'
            }
        });
    } catch (error) {
        console.error('Error sending audio to Gemini:', error);
        clientWs.send(JSON.stringify({
            type: 'error',
            message: 'Failed to process audio'
        }));
    }
}

function handleGeminiResponse(clientWs, sessionId, message) {
    try {
        if (message.data) {
            // Audio response from Gemini (24kHz PCM16)
            clientWs.send(JSON.stringify({
                type: 'audio_response',
                sessionId: sessionId,
                audio: message.data // Base64 encoded audio
            }));
        }

        if (message.serverContent) {
            if (message.serverContent.interrupted) {
                // Handle interruption
                clientWs.send(JSON.stringify({
                    type: 'interrupted',
                    sessionId: sessionId
                }));
            }

            if (message.serverContent.turnComplete) {
                // AI finished speaking
                clientWs.send(JSON.stringify({
                    type: 'turn_complete',
                    sessionId: sessionId
                }));
            }
        }
    } catch (error) {
        console.error('Error handling Gemini response:', error);
    }
}

async function handleInterruption(clientWs, sessionId) {
    const sessionInfo = activeSessions.get(sessionId);
    if (!sessionInfo) return;

    try {
        // The Gemini Live API handles interruptions automatically with VAD
        // We just need to notify the client that interruption is supported
        clientWs.send(JSON.stringify({
            type: 'interruption_handled',
            sessionId: sessionId
        }));
    } catch (error) {
        console.error('Error handling interruption:', error);
    }
}

async function endGeminiSession(clientWs, sessionId) {
    const sessionInfo = activeSessions.get(sessionId);
    if (!sessionInfo) return;

    try {
        sessionInfo.geminiSession.close();
        activeSessions.delete(sessionId);

        clientWs.send(JSON.stringify({
            type: 'session_ended',
            sessionId: sessionId
        }));
    } catch (error) {
        console.error('Error ending Gemini session:', error);
    }
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', activeSessions: activeSessions.size });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Active sessions will be tracked at /health`);
});

module.exports = { app, server, wss };
