# CryptoPulse AI

CryptoPulse AI is a personalized crypto dashboard built to give users a simple way to follow the crypto content that matters to them.

During onboarding, users choose the assets they are interested in, their investor profile, and the types of content they want to see. These preferences are saved and used to build a personalized dashboard with live coin prices, curated market news, AI-generated insights, crypto memes, and user feedback.

## Features

### Authentication

- Sign up with name, email, and password
- Login with JWT-based authentication
- Password hashing with bcrypt
- Protected routes using authentication middleware

### Personalized Onboarding

Users can customize their experience by selecting:

- Crypto assets they want to follow
- An investor profile: HODLer, Day Trader, NFT Collector, or DeFi Yield Farmer
- The content sections they want to see on their dashboard

Preferences are stored in MongoDB and can be updated later from the Preferences page.

### Dashboard

The dashboard is built according to each user's saved content preferences.

**Coin Prices**  
Displays current prices and 24-hour price changes for the user's selected assets using the CoinGecko API.

**Market News**  
Displays a curated selection of crypto news and market updates, with links to the original sources.

**AI Insight**  
Generates personalized content based on the user's investor profile and selected assets using the Hugging Face Inference API.

**Crypto Meme**  
Displays crypto-related memes with the option to load another meme.

### Feedback

Users can vote thumbs up or thumbs down on each dashboard section.

Feedback is stored in MongoDB by user and section. Each user has one active vote per section and can change their vote at any time.

### Light & Dark Mode

The interface supports both light and dark themes and remembers the user's selected theme.

## Tech Stack

### Frontend
- React
- Redux
- JavaScript
- Vite
- Axios
- CSS

### Backend
- Node.js
- Express
- JWT
- bcrypt
- MongoDB Native Driver

### Database
- MongoDB Atlas

### External Services
- CoinGecko API
- Hugging Face Inference API

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Architecture

The project is separated into frontend and backend applications, with the backend organized into routes, controllers, and services.

A typical request flows through the application like this:

```text
React → Redux / Service → Axios → REST API
→ Express Route → Controller → Service
→ MongoDB / External API → Response
```

This keeps the UI, state management, request handling, and data access separated and easier to maintain.

## Getting Started

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The required environment variables need to be configured before running the application.

## Environment Variables

### Backend

```env
DB_URL=
DB_NAME=
JWT_SECRET=
HUGGINGFACE_API_KEY=
COINGECKO_API_KEY=
FRONTEND_URL=
PORT=
```

### Frontend

```env
VITE_API_URL=
```

API keys, passwords, and other credentials should not be committed to the repository.

## Project Structure

```text
AI-crypto-advisor/
├── frontend/
├── backend/
└── README.md
```

## Live Demo

https://ai-crypto-advisor-ochre.vercel.app