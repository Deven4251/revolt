@echo off
echo 🚀 Starting Revolt Voice Chat Setup...
echo 📦 Installing dependencies...
npm install

if not exist ".env" (
    echo 🔑 Setting up environment...
    copy .env.example .env
    echo ⚠️  Please edit .env file and add your GEMINI_API_KEY
    echo 📝 Get your API key from: https://aistudio.google.com/
)

echo ✅ Setup complete! Run 'npm start' to begin.
pause
