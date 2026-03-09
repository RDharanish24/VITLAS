# VITLAS

A comprehensive health and wellness platform with real-time biometrics tracking, mental health support, and AI-powered health insights.

## 📁 Project Structure

```
VITLAS/
├── app/                    # Frontend application (Vite + React/TypeScript)
│   ├── src/
│   │   ├── components/     # React components (UI library + custom components)
│   │   ├── pages/          # Page components (Dashboard, Analytics, Chat, etc.)
│   │   ├── api/            # API integration (Gemini, queries)
│   │   ├── stores/         # State management (Zustand)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and constants
│   │   ├── mocks/          # Mock Service Worker setup
│   │   └── types/          # TypeScript type definitions
│   ├── public/             # Static assets
│   └── vite.config.ts      # Vite configuration
│
└── backend/                # Backend server (Node.js + TypeScript)
    └── src/
        ├── index.ts        # Server entry point
        └── db.ts           # Database configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm, yarn, or pnpm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RDharanish24/VITLAS.git
   cd VITLAS
   ```

2. **Setup Frontend**
   ```bash
   cd app
   npm install
   ```

3. **Setup Backend**
   ```bash
   cd ../backend
   npm install
   ```

### Development

**Frontend (From app directory)**
```bash
npm run dev
```

**Backend (From backend directory)**
```bash
npm run dev
```

The frontend will typically run on `http://localhost:5173` (Vite default)

### Build

**Frontend**
```bash
cd app
npm run build
```

**Backend**
```bash
cd backend
npm run build
```

## 🛠 Technologies Used

### Frontend
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library (shadcn/ui based)
- **API Integration**: Gemini API for AI features

### Backend
- **Runtime**: Node.js
- **Language**: TypeScript
- **Database**: (To be configured in db.ts)

## 📋 Features

- 📊 **Dashboard**: Real-time health metrics overview
- 📈 **Analytics**: Detailed health trends and insights
- 💬 **AI Chat**: Chat with AI health assistant (Gemini-powered)
- ❤️ **Biometrics**: Track vital signs and health metrics
- 🧠 **Mental Health**: Mental wellness tracking and support
- 👥 **Community**: Community features and social engagement

## 🔧 Configuration

### Environment Variables
Create `.env` or `.env.local` files in the respective directories:

**Frontend (.env or .env.local)**
```
VITE_GEMINI_API_KEY=your_gemini_api_key
```

**Backend (.env)**
```
PORT=3000
DATABASE_URL=your_database_url
```

## 📝 Git Workflow

The project uses Git for version control. After making changes:

```bash
git add .
git commit -m "Descriptive message"
git push origin main
```


