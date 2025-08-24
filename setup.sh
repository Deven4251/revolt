#!/bin/bash
echo "🚀 Starting Revolt Voice Chat Setup..."
echo "📦 Installing dependencies..."
npm install

if [ ! -f ".env" ]; then
    echo "🔑 Setting up environment..."
    cp .env.example .env
    echo "⚠️  Please edit .env file and add your GEMINI_API_KEY"
    echo "📝 Get your API key from: https://aistudio.google.com/"
fi

echo "✅ Setup complete! Run 'npm start' to begin."
