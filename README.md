# Revolt Motors Voice Chat - Gemini Live API Implementation

A real-time conversational voice interface replicating Revolt Motors chatbot functionality using Google's Gemini Live API.

## 🚀 Features

- **Real-time Voice Conversations**: Low-latency voice interactions with AI
- **Interruption Support**: Users can interrupt AI responses naturally
- **Server-to-Server Architecture**: Secure backend handles API communications
- **Voice Activity Detection**: Automatic speech detection and turn-taking
- **Multi-language Support**: Works with various languages
- **Revolt Motors Context**: AI assistant specialized in Revolt electric bikes
- **Modern UI**: Clean, responsive interface with audio visualizations
- **WebSocket Communication**: Real-time bidirectional data streaming

## 🛠️ Technical Architecture

### Backend (Node.js/Express)
- WebSocket server for client communication
- Gemini Live API integration
- Session management for concurrent users
- Audio format handling (16kHz PCM input, 24kHz output)
- Error handling and reconnection logic

### Frontend (HTML/JavaScript)
- Modern responsive UI with Revolt Motors branding
- Real-time microphone recording
- Audio visualization during conversation
- WebSocket client for server communication
- Push-to-talk functionality
- Interruption handling

## 📋 Prerequisites

- Node.js 16.0.0 or higher
- Google AI Studio API key
- Modern web browser with microphone access
- HTTPS (required for microphone access in production)

## 🔧 Installation

1. **Extract the project files**
   ```bash
   # Extract the zip file to your desired location
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   PORT=3000
   ```

4. **Get your Gemini API Key**
   - Go to [Google AI Studio](https://aistudio.google.com/)
   - Click "Get API Key"
   - Create a new API key
   - Copy the key to your `.env` file

## 🚀 Usage

1. **Start the server**
   ```bash
   npm start
   # or for development with auto-restart
   npm run dev
   ```

2. **Open your browser**
   ```
   http://localhost:3000
   ```

3. **Start chatting**
   - Click the microphone button or press spacebar to start talking
   - You can interrupt the AI at any time while it's speaking
   - Ask about Revolt Motors products, pricing, features, etc.

## 🔑 API Configuration

### Model Selection

**For Development:**
```javascript
model: 'gemini-2.0-flash-live-001'  // Higher rate limits
```

**For Production:**
```javascript
model: 'gemini-2.5-flash-preview-native-audio-dialog'  // Better quality, strict limits
```

### System Instructions

The AI is configured with Revolt Motors-specific context:
- Information about RV400, RV1, RV1+, RV BlazeX, RV400 BRZ
- Pricing, specifications, and features
- Dealership locations and services
- Electric mobility benefits

## 🔧 Key Implementation Details

### Audio Processing
- **Input**: 16-bit PCM, 16kHz, mono
- **Output**: 24kHz PCM audio from Gemini
- **Real-time streaming**: Continuous audio chunks sent via WebSocket
- **Format conversion**: JavaScript Float32Array to Int16Array

### Voice Activity Detection
- Automatic interruption detection
- Configurable sensitivity settings
- Manual activity start/end controls available

### Session Management
- Unique session IDs for each conversation
- Automatic cleanup on disconnect
- Session resumption support (optional)

## 📹 Demo Video Requirements

For your job assessment submission, record a 30-60 second video showing:

1. **Natural Conversation**: Ask about Revolt bike specifications
2. **Clear Interruption**: Start interrupting the AI mid-response
3. **Responsiveness**: Demonstrate low latency (1-2 seconds)
4. **Multiple Interactions**: Show several back-and-forth exchanges

Example script:
```
"Tell me about the RV400 specifications"
[Wait for AI to start responding, then interrupt]
"Actually, what about the price?"
[Let AI complete response]
"Where can I buy one in Delhi?"
```

## 🐛 Troubleshooting

### Common Issues

1. **"Microphone access denied"**
   - Ensure HTTPS in production
   - Check browser permissions
   - Try different browser

2. **"WebSocket connection failed"**
   - Verify server is running
   - Check firewall settings
   - Confirm PORT environment variable

3. **"Gemini API error"**
   - Verify API key is correct
   - Check rate limits (switch to development model)
   - Ensure billing is enabled for production model

## 🔗 Useful Links

- [Gemini Live API Documentation](https://ai.google.dev/gemini-api/docs/live)
- [Google AI Studio](https://aistudio.google.com/)
- [WebSocket API Reference](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

## 📄 License

MIT License - feel free to use this code for your projects!

## 👨‍💻 Author

**Devendra Kumar Mishra**
- Full-stack Developer specialized in MERN stack
- Location: Gurugram, HR
- Expertise: React, Node.js, real-time applications, AI integration
