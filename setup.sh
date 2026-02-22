#!/bin/bash

echo "🚀 DMLess - Local Setup Script"
echo "================================"

# Check if MongoDB URL is set
if [ -z "$MONGO_URL" ] && ! grep -q "MONGO_URL=" .env.local; then
  echo ""
  echo "⚠️  MongoDB URL not configured!"
  echo ""
  echo "To set up local development:"
  echo "1. Go to https://www.mongodb.com/cloud/atlas"
  echo "2. Create a free cluster"
  echo "3. Get your connection string"
  echo "4. Update .env.local with your MONGO_URL"
  echo ""
  echo "Example:"
  echo "  MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority"
  echo ""
  read -p "Press Enter to continue anyway (server will work but DB calls will fail)..."
fi

echo ""
echo "📦 Installing dependencies..."
cd backend
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the server, run:"
echo "  cd backend && npm run dev"
echo ""
echo "Then open: http://localhost:5000"
