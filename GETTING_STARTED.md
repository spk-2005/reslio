# 🚀 Getting Started with Reslio

Welcome! This guide will help you understand and set up the Reslio Resume & Portfolio Builder app.

---

## 📖 What is Reslio?

Reslio is a complete mobile application that allows users to:
- ✨ Create professional resumes from beautiful templates
- 🌐 Build stunning portfolio websites
- 📤 Export creations as PDF, Word, Image, or ZIP files
- 💎 Subscribe to premium for ad-free experience and template editing
- 🎯 Monetize through Google AdMob advertising

---

## 🎯 Quick Navigation

Depending on what you need, jump to the right guide:

### 👨‍💻 For Developers
1. **[QUICKSTART.md](QUICKSTART.md)** - Get running in 10 minutes
2. **[README.md](README.md)** - Complete technical documentation
3. **[backend/API_TESTING.md](backend/API_TESTING.md)** - Test all API endpoints

### 🚀 For Deployment
1. **[SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)** - Step-by-step checklist
2. **[DEPLOYMENT.md](DEPLOYMENT.md)** - Detailed deployment guide
3. **[backend/README.md](backend/README.md)** - Backend deployment specifics

### 📊 For Understanding
1. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete project overview
2. This file - Overview and navigation

---

## 🏗️ What's Included

This is a **complete, production-ready** codebase with:

### ✅ Fully Implemented
- React Native mobile app (Expo)
- Node.js + Express backend API
- MongoDB database models
- Firebase authentication
- Google Sign-In
- AdMob integration structure
- Premium subscription system
- Export functionality (PDF, DOCX, Image, ZIP)
- User profile management
- Template browsing system

### 📦 Ready to Configure
- MongoDB Atlas (free tier)
- Firebase (free tier)
- Google AdMob (monetization)
- Backend hosting (Railway/Heroku/Render)

### 🎨 Included Assets
- Login screen with Google Sign-In
- Splash screen with gradient
- Tab navigation (Home, Resume, Portfolio)
- User profile with avatar
- Template cards with previews
- Premium badge system
- Loading states and animations

---

## 🎓 Understanding the Flow

### User Journey
```
1. User opens app
   ↓
2. Sees splash screen
   ↓
3. Lands on login screen
   ↓
4. Clicks "Continue with Google"
   ↓
5. Authenticates via Firebase
   ↓
6. Backend creates/updates user in MongoDB
   ↓
7. User reaches Home tab
   ↓
8. Can browse Resume or Portfolio templates
   ↓
9. Selects template (ad shows)
   ↓
10. Adds their data
    ↓
11. Exports (ad shows again)
    ↓
12. Downloads their creation!
```

### Data Flow
```
Mobile App (React Native)
    ↓
Firebase Auth (Google Sign-In)
    ↓
Backend API (Node.js)
    ↓
MongoDB (User & Document Storage)
    ↓
Export Services (Puppeteer/DOCX)
    ↓
Downloaded File
```

---

## 🚦 Getting Started - Choose Your Path

### Path 1: Quick Demo (5 minutes)
Just want to see it work?

1. Run `npm install` in project root
2. Run `cd backend && npm install`
3. Run `npm run dev` in backend folder (new terminal)
4. Run `npm run dev` in project root
5. Press `w` to open in browser
6. Explore the UI (with dummy data)

**Note**: Firebase auth won't work without real credentials, but you can explore the complete UI.

### Path 2: Full Local Setup (30 minutes)
Want everything working locally?

1. Follow **[QUICKSTART.md](QUICKSTART.md)**
2. Set up free MongoDB Atlas account
3. Set up free Firebase project
4. Update `.env` files with real credentials
5. Test complete authentication flow
6. Seed templates to database
7. Test all features

### Path 3: Production Deployment (2-4 hours)
Ready to launch to the world?

1. Follow **[SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)**
2. Complete all sections:
   - MongoDB setup
   - Firebase configuration
   - AdMob account
   - Backend deployment
   - Native app build
   - Store submission
3. Monitor and iterate

---

## 💡 Key Concepts

### Frontend (React Native + Expo)
- **Expo Router**: File-based routing system
- **Tab Navigation**: Bottom tabs for main sections
- **Context API**: Manages authentication state
- **AsyncStorage**: Persists user data locally
- **Axios**: Makes API calls to backend

### Backend (Node.js + Express)
- **RESTful API**: All CRUD operations
- **JWT Authentication**: Secure user sessions
- **Mongoose**: MongoDB object modeling
- **Firebase Admin**: Verifies user tokens
- **Export Tools**: Generates files for download

### Authentication
- **Firebase Auth**: Handles Google OAuth
- **ID Tokens**: Sent to backend for verification
- **MongoDB Users**: Stores additional user data
- **Premium Status**: Tracks subscription state

### Monetization
- **AdMob Interstitial**: Shows before actions
- **AdMob Rewarded**: Optional rewards for watching
- **Premium Subscription**: Removes ads, unlocks features
- **Freemium Model**: Free with ads, or premium

---

## 📁 Important Files

### Configuration
- `.env` - Frontend environment variables
- `backend/.env` - Backend environment variables
- `app.json` - Expo app configuration
- `package.json` - Dependencies and scripts

### Entry Points
- `app/_layout.tsx` - App root layout
- `app/index.tsx` - Splash screen
- `app/login.tsx` - Login screen
- `backend/server.js` - API server

### Core Logic
- `contexts/AuthContext.tsx` - Authentication state
- `services/api.ts` - API client
- `services/firebase.ts` - Firebase config
- `backend/routes/` - API endpoints
- `backend/models/` - Database schemas

---

## 🔧 Common Tasks

### Adding a New Template
1. Create template design
2. Add to `backend/utils/seedTemplates.js`
3. Run `npm run seed` in backend folder
4. Template appears in app automatically

### Customizing Colors
1. Update gradient colors in UI files
2. Main colors: `#667eea` and `#764ba2`
3. Search project for these hex codes
4. Replace with your brand colors

### Adding a New API Endpoint
1. Create controller in `backend/controllers/`
2. Create route in `backend/routes/`
3. Add route to `backend/server.js`
4. Add client method in `services/api.ts`
5. Use in React components

### Testing Backend Locally
```bash
cd backend
npm run dev
# Server starts on http://localhost:5000

# In another terminal
curl http://localhost:5000
# Should return API info
```

---

## 🐛 Troubleshooting

### "Module not found" errors
```bash
# Clear and reinstall
rm -rf node_modules
npm install
```

### Backend won't connect to MongoDB
- Check MongoDB URI in `backend/.env`
- Verify IP whitelist in MongoDB Atlas
- Check username/password are correct

### Firebase auth not working
- Verify all Firebase config in `.env`
- Check Firebase Console for enabled auth methods
- Ensure Google Sign-In is enabled

### App won't build
```bash
# Clear Expo cache
npx expo start -c
```

### Port already in use
```bash
# Change port in backend/.env
PORT=5001
```

---

## 📚 Learning Resources

### React Native
- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)

### Backend
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)

### Services
- [Firebase Documentation](https://firebase.google.com/docs)
- [MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [AdMob Guide](https://developers.google.com/admob)

---

## 🎯 Next Steps

After getting familiar with the codebase:

1. **Customize Branding**
   - Update app name
   - Change colors
   - Replace icon and splash screen

2. **Add Your Templates**
   - Design resume templates
   - Design portfolio templates
   - Seed to database

3. **Configure Services**
   - Set up MongoDB
   - Set up Firebase
   - Set up AdMob

4. **Deploy Backend**
   - Choose hosting platform
   - Configure environment
   - Deploy and test

5. **Build Native App**
   - Use EAS Build
   - Test on device
   - Submit to stores

6. **Launch & Monitor**
   - Release to users
   - Track analytics
   - Gather feedback
   - Iterate!

---

## 🆘 Getting Help

### Documentation Files
- **Technical Issue**: Check [README.md](README.md)
- **Setup Issue**: Check [QUICKSTART.md](QUICKSTART.md)
- **Deployment Issue**: Check [DEPLOYMENT.md](DEPLOYMENT.md)
- **API Issue**: Check [backend/API_TESTING.md](backend/API_TESTING.md)

### Common Solutions
1. Search error message online
2. Check package versions compatibility
3. Clear cache and reinstall dependencies
4. Review environment variables
5. Check service status (MongoDB, Firebase)

---

## 🎉 You're Ready!

You now have:
- ✅ Understanding of the project
- ✅ Knowledge of where to find information
- ✅ Clear path forward based on your goal
- ✅ Complete, working codebase

**Choose your path above and get started!**

---

## 📝 Quick Reference

### Start Development
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
npm run dev
```

### Build for Production
```bash
# Web
npm run build:web

# Native (Android)
eas build --platform android

# Native (iOS)
eas build --platform ios
```

### Database Operations
```bash
# Seed templates
cd backend && npm run seed
```

### Check Health
```bash
# Backend
curl http://localhost:5000

# Get templates
curl http://localhost:5000/api/templates
```

---

**Built with ❤️ as a complete, production-ready template**

Ready to build something amazing? Let's go! 🚀
