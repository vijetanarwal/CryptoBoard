# CryptoBoard 📈

A real-time cryptocurrency portfolio tracker that helps you monitor your crypto investments, track profits/losses, and analyze market trends.

<img width="617" height="326" alt="image" src="https://github.com/user-attachments/assets/c9873991-e292-46f1-a277-e82011455359" /><img width="622" height="321" alt="image" src="https://github.com/user-attachments/assets/d41bb1ab-8f24-4c15-b0ea-b9afc49312e8" />



## ✨ Features
- 🔐 User Authentication (Register/Login)
- 📊 Live cryptocurrency prices via CoinGecko API
- 💼 Personal portfolio tracking
- 💹 Real-time Profit/Loss calculation
- 📈 7-day price history charts
- 🔄 Buy/Sell transaction history
- 📱 Responsive UI

## 🛠️ Tech Stack

**Frontend:**
- React.js + TypeScript
- Redux Toolkit + RTK Query
- Material UI
- Formik + Yup
- Recharts

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose

## 🚀 Getting Started

### Prerequisites
- Node.js
- MongoDB Atlas account
- CoinGecko API key (free)

### Backend Setup
```bash
cd server
npm install
```
Create `server/.env.local`:
```
MONGO_PASSWORD=your_mongodb_password
COINGECKO_API_KEY=your_coingecko_api_key
```
```bash
node index.js
```

### Frontend Setup
```bash
npm install
```
Create `.env`:
```
REACT_APP_API_URL=http://localhost:8000
```
```bash
npm start
```

## 📁 Project Structure
```
src/
├── app/          → App setup (Router, Redux Store)
├── pages/        → Login, Register, Dashboard, Assets, Statistics
├── features/     → Auth, Transactions
├── entities/     → Assets, Coins, User
├── widgets/      → Sidebar
└── shared/       → Hooks, UI components, helpers
```
