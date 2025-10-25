# 🚀 Quick Start Guide - Reslio

Get your development environment up and running in 10 minutes!

## 📋 What You'll Need

- Node.js 18+ installed
- Code editor (VS Code recommended)
- Terminal/Command Prompt
- 20 minutes of your time

---

## ⚡ Quick Setup (Development Mode)

### Step 1: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 2: Configure Environment Variables

The project already has dummy credentials configured. For development, you can use these as-is, but they won't connect to real services.

**To use real services**, update these files:

#### Frontend (.env)
- Already configured with dummy Firebase credentials
- Update with your Firebase project details when ready

#### Backend (backend/.env)
- Already configured with dummy MongoDB and Firebase credentials
- Update with real credentials before deploying

### Step 3: Start Backend Server

```bash
cd backend
npm run dev
```

Backend will start on `http://localhost:5000`

Keep this terminal open!

### Step 4: Start Frontend (New Terminal)

```bash
# Open a new terminal in the project root
npm run dev
```

This will start the Expo development server.

### Step 5: Open in Browser

- Press `w` in the terminal to open in web browser
- The app will open at `http://localhost:8081`

---

## 🎯 What Works in Demo Mode

Even with dummy credentials, you can:

✅ View the complete app UI
✅ Navigate between tabs (Home, Resume, Portfolio)
✅ Browse template mockups
✅ See AdMob integration placeholders
✅ Test the authentication flow (demo mode)
✅ Explore the user interface
✅ Review code structure

---

## 🔧 Connecting Real Services

### MongoDB Atlas (Free Tier)

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a cluster (M0 Free tier)
4. Get connection string
5. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/reslio
   ```
6. Seed templates:
   ```bash
   cd backend
   npm run seed
   ```

### Firebase (Free Tier)

1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Create new project
3. Enable Authentication → Google Sign-In
4. Get Web config from Project Settings
5. Update `.env` with your Firebase config
6. Download service account JSON for backend
7. Update `backend/.env` with service account details

---

## 📱 Testing on Mobile Device

### Using Expo Go App

1. Install Expo Go on your phone:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan QR code from terminal (ensure phone and computer are on same network)

3. App will load on your device

---

## 🐛 Troubleshooting

### Port Already in Use

If port 5000 is taken:
```bash
# Change port in backend/.env
PORT=5001
```

### Dependencies Installation Failed

Try clearing cache:
```bash
# Frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Expo Server Won't Start

```bash
# Clear Expo cache
npx expo start -c
```

### Backend Won't Connect

Check if MongoDB URI is correct and your IP is whitelisted in MongoDB Atlas.

---

## 📁 Project Structure Overview

```
reslio/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Bottom tab navigation
│   ├── index.tsx          # Splash screen
│   ├── login.tsx          # Login screen
│   └── _layout.tsx        # Root layout
│
├── backend/               # Node.js API server
│   ├── models/           # MongoDB schemas
│   ├── controllers/      # Request handlers
│   ├── routes/           # API endpoints
│   ├── config/           # Database & Firebase config
│   └── server.js         # Express app
│
├── services/             # API & Firebase clients
├── contexts/             # React Context (Auth)
└── components/           # Reusable UI components
```

---

## 🎨 Key Features to Explore

1. **Authentication Flow**
   - Splash → Login → Home

2. **Tab Navigation**
   - Home: User profile and app info
   - Resume: Template browser
   - Portfolio: Website templates

3. **AdMob Integration**
   - Placeholder ads before actions
   - Ready for native build

4. **API Integration**
   - All endpoints working
   - MongoDB models ready
   - Export functionality included

---

## 🚀 Next Steps

1. ✅ Get app running locally
2. 📱 Test on your phone via Expo Go
3. 🔧 Connect real MongoDB and Firebase
4. 🎨 Customize templates and design
5. 📝 Implement data entry forms
6. 🏗️ Build native app for production
7. 🚀 Deploy backend to Railway/Heroku
8. 📤 Submit to Play Store / App Store

---

## 💡 Development Tips

- Use `console.log()` for debugging
- Hot reload works automatically
- Backend requires manual restart on changes
- Check browser console for errors
- Use React DevTools for component debugging

---

## 📚 Documentation

- Full README: `README.md`
- Deployment Guide: `DEPLOYMENT.md`
- Backend API: See `backend/README.md`

---

## 🆘 Getting Help

If you're stuck:

1. Check the error message carefully
2. Review the relevant documentation
3. Search for the error online
4. Check package versions are compatible
5. Try clearing caches and reinstalling

---

## 🎉 You're Ready!

Your development environment is set up. Start coding!

Key commands to remember:
```bash
npm run dev          # Start Expo frontend
cd backend && npm run dev   # Start backend server
npm run build:web    # Build for web
```

Happy coding! 🎨
