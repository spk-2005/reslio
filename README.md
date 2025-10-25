# Reslio - Resume & Portfolio Builder

A complete mobile application built with React Native (Expo), Node.js, MongoDB, and Firebase for creating professional resumes and portfolio websites.

## 📱 Project Overview

Reslio allows users to:
- Sign in with Google authentication
- Create professional resumes from templates
- Build portfolio websites
- Export content as PDF, DOCX, Image, or ZIP
- Subscribe to premium features for ad-free experience and template editing

## 🏗️ Architecture

### Frontend (React Native + Expo)
- **Framework**: Expo SDK 54+
- **Navigation**: Expo Router with bottom tabs
- **Authentication**: Firebase Auth (Google Sign-In)
- **State Management**: React Context API
- **UI**: Custom components with Lucide icons
- **Monetization**: Google AdMob (configured for native builds)

### Backend (Node.js + Express)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Firebase Admin SDK
- **Export Tools**: Puppeteer (PDF), DOCX library, Archiver (ZIP)
- **Storage**: Firebase Storage

## 📂 Project Structure

```
reslio/
├── app/                      # Expo Router pages
│   ├── (tabs)/              # Tab navigation screens
│   │   ├── index.tsx        # Home tab
│   │   ├── resume.tsx       # Resume templates tab
│   │   └── portfolio.tsx    # Portfolio templates tab
│   ├── index.tsx            # Splash screen
│   ├── login.tsx            # Login screen
│   └── _layout.tsx          # Root layout
├── backend/                 # Node.js backend
│   ├── config/             # Database & Firebase config
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Auth middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   └── server.js           # Express server
├── contexts/               # React contexts
│   └── AuthContext.tsx     # Authentication context
├── services/               # API & Firebase services
│   ├── api.ts             # Backend API client
│   ├── firebase.ts        # Firebase configuration
│   └── admob.ts           # AdMob integration
└── components/            # Reusable components
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account
- Firebase project
- Google Cloud Console project (for AdMob)
- Expo CLI

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Update `.env` with your credentials:
- MongoDB connection string
- Firebase Admin SDK credentials
- JWT secret

3. Start the backend server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Update `.env` with your Firebase config:
- Firebase API keys
- Backend API URL
- AdMob unit IDs

3. Start the Expo development server:
```bash
npm run dev
```

## 🔑 Environment Variables

### Frontend (.env)
```
EXPO_PUBLIC_API_URL=http://localhost:5000/api
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID=ca-app-pub-xxxxx
EXPO_PUBLIC_ADMOB_REWARDED_ID=ca-app-pub-xxxxx
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/reslio
NODE_ENV=development
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your_project.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
JWT_SECRET=your_jwt_secret
```

## 🎯 Features Implementation

### Completed Features
- ✅ Google Sign-In authentication
- ✅ User profile management
- ✅ Resume template browsing
- ✅ Portfolio template browsing
- ✅ AdMob integration (placeholder for web, ready for native)
- ✅ Premium subscription UI
- ✅ Backend API with all endpoints
- ✅ MongoDB models for User, Template, Resume, Portfolio
- ✅ Export functionality (PDF, DOCX, Image, ZIP)

### To Implement
- Data entry forms for resumes and portfolios
- Template customization for premium users
- Real AdMob integration (requires native build)
- In-app purchase integration (RevenueCat recommended)
- Template rendering engine
- File download and sharing

## 📱 AdMob Integration

The app includes AdMob placeholder integration. For production:

1. Create AdMob account and app
2. Get your Ad Unit IDs
3. Update environment variables
4. Build native app (not web)
5. Test with real ads

AdMob shows ads:
- Before template selection
- Before data entry
- Before export/download

## 💎 Premium Features

Premium subscribers get:
- Ad-free experience
- Template editing capability
- Early access to new templates
- Priority support

## 🚀 Deployment

### Backend Deployment (Railway/Heroku/Render)

1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

### Frontend Deployment

For web preview:
```bash
npm run build:web
```

For native app:
```bash
eas build --platform android
eas build --platform ios
```

## 🔒 Security Notes

- Never commit real credentials to version control
- Use environment variables for all sensitive data
- Implement rate limiting in production
- Enable Firebase App Check
- Validate all user inputs on backend
- Use HTTPS in production

## 📄 API Documentation

### Authentication
- `POST /api/auth/login` - Login/Register with Firebase token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/premium` - Update premium status

### Templates
- `GET /api/templates` - Get all templates
- `GET /api/templates/:id` - Get template by ID

### Resumes
- `POST /api/resumes` - Create resume
- `GET /api/resumes` - Get user's resumes
- `PUT /api/resumes/:id` - Update resume (Premium)
- `DELETE /api/resumes/:id` - Delete resume

### Portfolios
- `POST /api/portfolios` - Create portfolio
- `GET /api/portfolios` - Get user's portfolios
- `PUT /api/portfolios/:id` - Update portfolio (Premium)
- `DELETE /api/portfolios/:id` - Delete portfolio

### Export
- `POST /api/export/resume/pdf` - Export as PDF
- `POST /api/export/resume/docx` - Export as Word
- `POST /api/export/resume/image` - Export as Image
- `POST /api/export/portfolio/zip` - Export as ZIP

## 🛠️ Tech Stack

- **Frontend**: React Native, Expo, TypeScript
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Ads**: Google AdMob
- **Export**: Puppeteer, DOCX, Archiver
- **Icons**: Lucide React Native

## 📝 License

This project is private and proprietary.

## 👥 Support

For issues or questions, please contact the development team.

---

Built with ❤️ by the Reslio Team
