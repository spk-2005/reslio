# Deployment Guide - Reslio App

This guide will help you deploy the complete Reslio application (frontend + backend) to production.

## 📋 Prerequisites

Before deploying, ensure you have:

1. **MongoDB Atlas Account** - [Sign up here](https://www.mongodb.com/cloud/atlas)
2. **Firebase Project** - [Create project here](https://console.firebase.google.com/)
3. **Google Cloud Console** - For AdMob configuration
4. **Hosting Platform Account** - Choose one:
   - [Railway](https://railway.app/) (Recommended)
   - [Heroku](https://heroku.com/)
   - [Render](https://render.com/)
   - [DigitalOcean](https://digitalocean.com/)

---

## 🗄️ Step 1: MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new project called "Reslio"
3. Create a free cluster (M0 tier)
4. Database Access:
   - Create a database user with a strong password
   - Note the username and password
5. Network Access:
   - Add IP address `0.0.0.0/0` (for development)
   - In production, whitelist only your backend server IP
6. Connect:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Example: `mongodb+srv://reslio:mypassword@cluster0.mongodb.net/reslio?retryWrites=true&w=majority`

---

## 🔥 Step 2: Firebase Setup

### A. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it "Reslio" or your preferred name
4. Disable Google Analytics (optional)

### B. Enable Google Authentication

1. In Firebase Console → Authentication → Sign-in method
2. Enable "Google" provider
3. Add support email
4. Save. This automatically creates a *Web* client ID. For mobile, you must create them manually.

### B2. Configure OAuth Consent Screen (Crucial for Testing)

To avoid "Access blocked" errors during development, you must configure the consent screen.

1. Go to the [Google Cloud Console](https://console.cloud.google.com/apis/credentials/consent).
2. Select the correct project.
3. **User Type**: Select **External**.
4. **Publishing Status**:
   - The default is "Testing". Go to the **Test users** section and add the Google accounts you will use for testing (e.g., `your-email@gmail.com`). Only these users can sign in while in testing mode.
   - Before launching, you must click **"Publish App"** and provide links to your app's privacy policy and terms of service.

### B3. Create Mobile OAuth Client IDs

You need to create separate client IDs for iOS and Android.

1.  Go to the Google Cloud Console Credentials page.
2.  Click **+ CREATE CREDENTIALS** > **OAuth client ID**.
3.  **For Android**:
    -   Select **Android**.
    -   Add your **Package Name** (from `app.json`).
    -   Add your **SHA-1 certificate fingerprint**. For EAS builds, you can find this in your project's credentials on the Expo website.
    -   Create and copy the Android Client ID.
4.  **For iOS**:
    -   Select **iOS**.
    -   Add your **Bundle ID** (from `app.json`).
    -   Create and copy the iOS Client ID.

### C. Get Web App Config

1. Project Settings → General
2. Under "Your apps", click Web icon (</>)
3. Register app with name "Reslio Web"
4. Copy the config values:
   - apiKey
   - authDomain
   - projectId
   - storageBucket
   - messagingSenderId
   - appId

### D. Generate Service Account (for Backend)

1. Project Settings → Service accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Extract these values:
   - `project_id`
   - `private_key`
   - `client_email`

### E. Enable Firebase Storage

1. Storage → Get Started
2. Start in production mode
3. Update rules if needed

---

## 📱 Step 3: Google AdMob Setup

1. Go to [AdMob Console](https://apps.admob.com/)
2. Sign in with Google account
3. Add your app:
   - Click "Apps" → "Add app"
   - Select "Android" (or iOS)
   - Is your app listed? → No
   - Enter app name: "Reslio"
4. Create Ad Units:
   - Navigate to your app
   - Ad units → Create ad unit
   - Create **Interstitial Ad**: Note the Ad Unit ID
   - Create **Rewarded Ad**: Note the Ad Unit ID
5. Save both Ad Unit IDs for environment variables

For testing, use these test IDs:
- Interstitial: `ca-app-pub-3940256099942544/1033173712`
- Rewarded: `ca-app-pub-3940256099942544/5224354917`

---

## 🚀 Step 4: Deploy Backend

### Option A: Railway (Recommended)

1. **Sign up** at [Railway.app](https://railway.app/)
2. **Connect GitHub**:
   - Push your backend code to GitHub
   - New Project → Deploy from GitHub repo
   - Select your repository
3. **Configure**:
   - Root directory: `/backend`
   - Build command: `npm install`
   - Start command: `npm start`
4. **Add Environment Variables**:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   NODE_ENV=production
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_PRIVATE_KEY=your_firebase_private_key_from_json
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   JWT_SECRET=generate_a_random_secret_here
   ```
5. **Deploy**: Railway will auto-deploy
6. **Get URL**: Copy your backend URL (e.g., `https://reslio-backend.railway.app`)

### Option B: Heroku

```bash
# Install Heroku CLI
cd backend
heroku create reslio-backend

# Add environment variables
heroku config:set MONGODB_URI="your_connection_string"
heroku config:set FIREBASE_PROJECT_ID="your_project_id"
heroku config:set FIREBASE_PRIVATE_KEY="your_private_key"
heroku config:set FIREBASE_CLIENT_EMAIL="your_client_email"
heroku config:set FIREBASE_STORAGE_BUCKET="your_storage_bucket"
heroku config:set JWT_SECRET="your_jwt_secret"
heroku config:set NODE_ENV="production"

# Deploy
git push heroku main
```

### Option C: Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. New → Web Service
3. Connect GitHub repository
4. Configure:
   - Name: reslio-backend
   - Root Directory: backend
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables (same as Railway)
6. Create Web Service

---

## 📱 Step 5: Configure Frontend

1. **Update `.env` file** with your production values:

```env
EXPO_PUBLIC_API_URL=https://your-backend-url.railway.app/api
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB=your-web-client-id-from-gcp
EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS=your-ios-client-id-from-gcp
EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID=your-android-client-id-from-gcp
EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID=your-admob-interstitial-id
EXPO_PUBLIC_ADMOB_REWARDED_ID=your-admob-rewarded-id
```

2. **Test locally**:
```bash
npm run dev
```

---

## 🏗️ Step 6: Build Native App

### Install EAS CLI

```bash
npm install -g eas-cli
eas login
```

### Configure EAS

```bash
eas build:configure
```

### Build for Android

```bash
eas build --platform android --profile production
```

### Build for iOS

```bash
eas build --platform ios --profile production
```

### Submit to Stores

```bash
# Android
eas submit --platform android

# iOS
eas submit --platform ios
```

---

## 🔐 Security Checklist

Before going live:

- [ ] Change all default passwords and secrets
- [ ] Update MongoDB to allow only backend server IP
- [ ] Enable Firebase App Check
- [ ] Set up rate limiting on backend
- [ ] Enable HTTPS on backend
- [ ] Review and test all RLS policies
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure backup strategy for MongoDB
- [ ] Test authentication flow thoroughly
- [ ] Verify AdMob integration
- [ ] Test all export functionality
- [ ] Set up error logging

---

## 🧪 Testing Before Launch

1. **Authentication**:
   - Sign in with Google
   - Sign out
   - Session persistence

2. **Resume Creation**:
   - Browse templates
   - Select template (ad should show)
   - Add data (ad should show)
   - Export (ad should show)

3. **Portfolio Creation**:
   - Same flow as resumes

4. **Premium Features**:
   - Purchase subscription
   - Verify ad removal
   - Test template editing

5. **Export Functions**:
   - PDF export
   - DOCX export
   - Image export
   - ZIP export

---

## 📊 Post-Deployment Monitoring

Set up monitoring for:

1. **Backend Health**: Use Railway/Heroku metrics
2. **Database**: MongoDB Atlas monitoring
3. **Errors**: Sentry or similar
4. **Analytics**: Google Analytics
5. **AdMob**: AdMob dashboard for revenue
6. **User Feedback**: In-app review prompts

---

## 🆘 Troubleshooting

### Backend won't start
- Check environment variables are set correctly
- Verify MongoDB connection string
- Check logs: `railway logs` or `heroku logs --tail`

### Firebase authentication fails
- Verify API keys in `.env`
- Check Firebase console for enabled authentication methods
- **For Expo Go (Development)**: If you get an `Error 400: invalid_request` with a `redirect_uri` like `exp://192.168.x.x:8081`, you must add this URI to your **Web Client ID's** "Authorized redirect URIs" list in the Google Cloud Console. This is because `expo-auth-session` uses a web-based flow for authentication in Expo Go.
- Ensure OAuth redirect URLs are configured

### AdMob not showing
- AdMob only works on native builds (not web)
- Verify Ad Unit IDs are correct
- Check AdMob account status
- Use test IDs during development

### Export functionality issues
- Ensure Puppeteer dependencies are installed on server
- Check server has enough memory (min 1GB recommended)
- Verify file size limits

---

## 📞 Support Resources

- MongoDB Atlas: https://docs.atlas.mongodb.com/
- Firebase Docs: https://firebase.google.com/docs
- Expo Documentation: https://docs.expo.dev/
- Railway Support: https://docs.railway.app/
- AdMob Help: https://support.google.com/admob/

---

## 🎉 You're Live!

Once deployed:
1. Test all features thoroughly
2. Submit to Google Play Store
3. Submit to Apple App Store (if iOS)
4. Share with beta testers
5. Gather feedback
6. Iterate and improve

Good luck with your launch! 🚀
