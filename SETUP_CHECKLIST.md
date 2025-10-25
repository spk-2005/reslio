# ✅ Setup & Deployment Checklist

Use this checklist to track your progress from setup to production deployment.

---

## 📦 Initial Setup

### Local Development
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Code editor ready (VS Code recommended)
- [ ] Terminal/command line available

### Project Setup
- [ ] Project downloaded/cloned
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] Environment files reviewed (`.env`)

### Test Run
- [ ] Backend starts successfully (`cd backend && npm run dev`)
- [ ] Frontend starts successfully (`npm run dev`)
- [ ] Can access app in browser
- [ ] No critical errors in console

---

## 🗄️ MongoDB Setup

- [ ] MongoDB Atlas account created
- [ ] Free cluster (M0) created
- [ ] Database user created with password
- [ ] IP whitelist configured (0.0.0.0/0 for dev)
- [ ] Connection string obtained
- [ ] Connection string added to `backend/.env`
- [ ] Connection tested (backend starts without errors)
- [ ] Templates seeded (`npm run seed` in backend folder)
- [ ] Verified templates in MongoDB Atlas dashboard

---

## 🔥 Firebase Setup

### Project Creation
- [ ] Firebase account created
- [ ] New project created (e.g., "Reslio")
- [ ] Google Analytics disabled (optional)

### Authentication Setup
- [ ] Authentication enabled in Firebase Console
- [ ] Google Sign-In provider enabled
- [ ] Support email added
- [ ] Test mode enabled for development

### Web App Configuration
- [ ] Web app registered in Firebase
- [ ] Firebase config copied:
  - [ ] apiKey
  - [ ] authDomain
  - [ ] projectId
  - [ ] storageBucket
  - [ ] messagingSenderId
  - [ ] appId
- [ ] Config added to frontend `.env`
- [ ] Firebase configuration tested (app loads)

### Service Account Setup (Backend)
- [ ] Service account key generated
- [ ] JSON file downloaded
- [ ] Extracted values added to `backend/.env`:
  - [ ] FIREBASE_PROJECT_ID
  - [ ] FIREBASE_PRIVATE_KEY
  - [ ] FIREBASE_CLIENT_EMAIL
- [ ] Firebase Storage enabled
- [ ] Storage bucket name added to `backend/.env`

---

## 📱 Google AdMob Setup

- [ ] Google AdMob account created
- [ ] App added to AdMob:
  - [ ] App name: "Reslio"
  - [ ] Platform: Android/iOS
- [ ] Ad Units created:
  - [ ] Interstitial Ad Unit created
  - [ ] Rewarded Ad Unit created
- [ ] Ad Unit IDs copied
- [ ] IDs added to frontend `.env`:
  - [ ] EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID
  - [ ] EXPO_PUBLIC_ADMOB_REWARDED_ID
- [ ] Understand: AdMob only works on native builds (not web)

---

## 🧪 Testing Phase

### Authentication Flow
- [ ] Can load login screen
- [ ] Google Sign-In button appears
- [ ] Can complete sign-in (or see demo message on web)
- [ ] User data saved in MongoDB
- [ ] Profile appears on Home tab
- [ ] Can sign out

### Template Browsing
- [ ] Resume templates load
- [ ] Portfolio templates load
- [ ] Images display correctly
- [ ] Premium badges show for premium templates
- [ ] Can select template (ad placeholder shows)

### API Testing
- [ ] Backend health check works (`http://localhost:5000`)
- [ ] Can fetch templates from API
- [ ] Authentication token works
- [ ] Create resume API works
- [ ] Create portfolio API works
- [ ] Export endpoints respond (may fail without proper setup)

### UI/UX Testing
- [ ] Navigation between tabs works
- [ ] Loading states appear correctly
- [ ] No visual glitches
- [ ] Responsive on different screen sizes
- [ ] Images load properly

---

## 🚀 Backend Deployment

### Choose Platform
- [ ] Selected hosting platform (Railway/Heroku/Render)
- [ ] Account created
- [ ] Payment method added (if required)

### Railway Deployment (Recommended)
- [ ] GitHub repository created
- [ ] Backend code pushed to GitHub
- [ ] New project created in Railway
- [ ] Repository connected
- [ ] Root directory set to `/backend`
- [ ] Environment variables added (all 8 variables)
- [ ] Deployment successful
- [ ] Backend URL obtained
- [ ] Health check endpoint works

### Alternative: Heroku
- [ ] Heroku CLI installed
- [ ] Heroku app created
- [ ] Environment variables configured
- [ ] Code deployed via Git
- [ ] Logs checked for errors

### Alternative: Render
- [ ] Repository connected
- [ ] Web service created
- [ ] Environment variables set
- [ ] Auto-deploy configured
- [ ] Service running

### Post-Deployment
- [ ] Backend URL accessible publicly
- [ ] `/api/templates` endpoint returns data
- [ ] MongoDB connection working in production
- [ ] Firebase Admin SDK working
- [ ] No errors in logs

---

## 📱 Frontend Configuration

### Update Production URLs
- [ ] Backend API URL updated in `.env`
- [ ] Changed from localhost to production URL
- [ ] Example: `EXPO_PUBLIC_API_URL=https://your-app.railway.app/api`
- [ ] App tested with production backend

### Test Integration
- [ ] Login works with production backend
- [ ] Templates load from production API
- [ ] Can create resume/portfolio
- [ ] Data saves to production database

---

## 🏗️ Native App Build

### EAS Setup
- [ ] EAS CLI installed (`npm install -g eas-cli`)
- [ ] EAS account created
- [ ] Logged in (`eas login`)
- [ ] Project configured (`eas build:configure`)

### Android Build
- [ ] Google Play Console account created ($25 one-time fee)
- [ ] App bundle built (`eas build --platform android`)
- [ ] Build completed successfully
- [ ] APK/AAB downloaded and tested
- [ ] App works on Android device
- [ ] AdMob shows real ads (after setup)

### iOS Build (Optional)
- [ ] Apple Developer account ($99/year)
- [ ] iOS build created (`eas build --platform ios`)
- [ ] Build tested on iOS device
- [ ] All features working

---

## 🎯 Pre-Launch Checklist

### Security
- [ ] All dummy credentials replaced
- [ ] `.env` files not committed to Git
- [ ] MongoDB IP whitelist narrowed to production
- [ ] Firebase security rules reviewed
- [ ] API rate limiting considered
- [ ] HTTPS enabled on backend

### Functionality
- [ ] End-to-end user flow tested
- [ ] All export functions work
- [ ] Premium features accessible (after purchase)
- [ ] AdMob shows correctly on native
- [ ] No critical bugs found

### Content
- [ ] App name finalized
- [ ] App icon ready (512x512)
- [ ] Screenshots prepared (5+ per platform)
- [ ] App description written
- [ ] Privacy policy created
- [ ] Terms of service created

### Performance
- [ ] App loads in <3 seconds
- [ ] No memory leaks
- [ ] API responses <500ms
- [ ] Images optimized
- [ ] Crash-free rate >98%

---

## 📤 App Store Submission

### Google Play Store
- [ ] Developer account active
- [ ] App listing created
- [ ] Store listing completed:
  - [ ] Title
  - [ ] Short description
  - [ ] Full description
  - [ ] Screenshots (phone + tablet)
  - [ ] Feature graphic
  - [ ] App icon
- [ ] Content rating completed
- [ ] Privacy policy URL added
- [ ] APK/AAB uploaded
- [ ] Release notes written
- [ ] Internal testing track set up
- [ ] Beta testers added
- [ ] Production release prepared
- [ ] App submitted for review

### Apple App Store (if applicable)
- [ ] App Store Connect account active
- [ ] App listing created
- [ ] Store information completed
- [ ] Screenshots uploaded (all required sizes)
- [ ] App preview videos (optional)
- [ ] Build uploaded via Xcode or Transporter
- [ ] App submitted for review

---

## 🔍 Post-Launch Monitoring

### Day 1
- [ ] App approved and live
- [ ] Download link works
- [ ] Can install and open
- [ ] Authentication working
- [ ] No crashes reported
- [ ] Analytics tracking active

### Week 1
- [ ] Monitor crash reports
- [ ] Check user reviews
- [ ] Verify ad revenue (AdMob dashboard)
- [ ] Database performance acceptable
- [ ] API response times good
- [ ] User feedback collected

### Month 1
- [ ] Review analytics
- [ ] Calculate metrics:
  - [ ] Total downloads
  - [ ] Active users
  - [ ] Premium conversion rate
  - [ ] Ad revenue
  - [ ] Crash-free rate
  - [ ] Average session duration
- [ ] Plan updates based on feedback

---

## 🐛 Issue Tracking

Use this section to note issues as you find them:

### Critical Issues
- [ ]

### Medium Priority
- [ ]

### Low Priority
- [ ]

### Feature Requests
- [ ]

---

## 📊 Success Metrics

Track these post-launch:

- **Downloads**: _______ / 1,000 (Month 1 goal)
- **Active Users**: _______ / 500 (Month 1 goal)
- **Rating**: _______ / 4.0+ (Goal)
- **Crash-free Rate**: _______ / 98%+ (Goal)
- **Premium Conversion**: _______ / 5% (Goal)
- **Ad Revenue**: $_______ / month

---

## 🎉 Completion Status

**Overall Progress**: ____ / 100%

### Phase Status
- [ ] Development Complete
- [ ] Testing Complete
- [ ] Backend Deployed
- [ ] Native Build Created
- [ ] Store Submission Complete
- [ ] App Live in Stores
- [ ] Monitoring Active

---

## 📝 Notes

Use this space for additional notes:

```
Date: _____________
Status: _____________
Next Steps:
-
-
-

Blockers:
-
-

```

---

**Good luck with your launch! 🚀**

Remember: Every successful app starts with proper setup and testing. Take your time with each step!
