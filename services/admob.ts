// services/admob.ts
// Replace your existing admob.ts with this complete implementation
/*
import { Platform } from 'react-native';
import { 
  InterstitialAd, 
  RewardedAd, 
  AdEventType, 
  TestIds,
  RewardedAdEventType 
} from 'react-native-google-mobile-ads';

// Get Ad Unit IDs from environment variables or use test IDs in development
const INTERSTITIAL_AD_ID = Platform.select({
  ios: __DEV__ 
    ? TestIds.INTERSTITIAL 
    : process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID_IOS,
  android: __DEV__ 
    ? TestIds.INTERSTITIAL 
    : process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID,
  web: undefined,
}) || TestIds.INTERSTITIAL;

const REWARDED_AD_ID = Platform.select({
  ios: __DEV__ 
    ? TestIds.REWARDED 
    : process.env.EXPO_PUBLIC_ADMOB_REWARDED_ID_IOS,
  android: __DEV__ 
    ? TestIds.REWARDED 
    : process.env.EXPO_PUBLIC_ADMOB_REWARDED_ID,
  web: undefined,
}) || TestIds.REWARDED;

// Interstitial Ad Instance
let interstitialAd: InterstitialAd | null = null;
let isInterstitialLoaded = false;

// Rewarded Ad Instance
let rewardedAd: RewardedAd | null = null;
let isRewardedLoaded = false;

/**
 * Initialize Interstitial Ad
 
const initializeInterstitialAd = () => {
  if (Platform.OS === 'web') {
    console.log('[AdMob] Skipping interstitial ad initialization on web');
    return;
  }

  try {
    interstitialAd = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_ID, {
      requestNonPersonalizedAdsOnly: false,
    });

    // Ad Loaded
    interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      console.log('✅ [AdMob] Interstitial ad loaded');
      isInterstitialLoaded = true;
    });

    // Ad Error
    interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
      console.error('❌ [AdMob] Interstitial ad error:', error);
      isInterstitialLoaded = false;
    });

    // Ad Closed
    interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('🔄 [AdMob] Interstitial ad closed, reloading...');
      isInterstitialLoaded = false;
      // Reload ad for next time
      interstitialAd?.load();
    });

    // Load the ad
    interstitialAd.load();
    console.log('🔄 [AdMob] Loading interstitial ad...');
  } catch (error) {
    console.error('❌ [AdMob] Failed to initialize interstitial ad:', error);
  }
};

/**
 * Initialize Rewarded Ad
 
const initializeRewardedAd = () => {
  if (Platform.OS === 'web') {
    console.log('[AdMob] Skipping rewarded ad initialization on web');
    return;
  }

  try {
    rewardedAd = RewardedAd.createForAdRequest(REWARDED_AD_ID, {
      requestNonPersonalizedAdsOnly: false,
    });

    // Ad Loaded
    rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      console.log('✅ [AdMob] Rewarded ad loaded');
      isRewardedLoaded = true;
    });

    // Ad Error
    rewardedAd.addAdEventListener(AdEventType.ERROR, (error) => {
      console.error('❌ [AdMob] Rewarded ad error:', error);
      isRewardedLoaded = false;
    });

    // Ad Closed
    rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('🔄 [AdMob] Rewarded ad closed, reloading...');
      isRewardedLoaded = false;
      // Reload ad for next time
      rewardedAd?.load();
    });

    // Load the ad
    rewardedAd.load();
    console.log('🔄 [AdMob] Loading rewarded ad...');
  } catch (error) {
    console.error('❌ [AdMob] Failed to initialize rewarded ad:', error);
  }
};

/**
 * Show Interstitial Ad
 * @returns Promise that resolves when ad is dismissed or fails
 
export const showInterstitialAd = async (): Promise<void> => {
  return new Promise((resolve) => {
    // Web platform fallback
    if (Platform.OS === 'web') {
      console.log('[AdMob] Interstitial ad would show here (web platform)');
      setTimeout(resolve, 1000);
      return;
    }

    // Check if ad is loaded
    if (!interstitialAd || !isInterstitialLoaded) {
      console.warn('⚠️ [AdMob] Interstitial ad not loaded, skipping');
      resolve();
      return;
    }

    try {
      console.log('📺 [AdMob] Showing interstitial ad');
      
      // Show the ad
      interstitialAd.show().then(() => {
        console.log('✅ [AdMob] Interstitial ad shown successfully');
        resolve();
      }).catch((error) => {
        console.error('❌ [AdMob] Failed to show interstitial ad:', error);
        resolve();
      });
    } catch (error) {
      console.error('❌ [AdMob] Error showing interstitial ad:', error);
      resolve();
    }
  });
};

/**
 * Show Rewarded Ad
 * @returns Promise that resolves with true if user earned reward, false otherwise
 
export const showRewardedAd = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Web platform fallback
    if (Platform.OS === 'web') {
      console.log('[AdMob] Rewarded ad would show here (web platform)');
      setTimeout(() => resolve(true), 1000);
      return;
    }

    // Check if ad is loaded
    if (!rewardedAd || !isRewardedLoaded) {
      console.warn('⚠️ [AdMob] Rewarded ad not loaded, skipping');
      resolve(false);
      return;
    }

    try {
      console.log('📺 [AdMob] Showing rewarded ad');
      
      let userEarnedReward = false;

      // Listen for reward earned event
      const unsubscribeEarned = rewardedAd.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        (reward) => {
          console.log('🎁 [AdMob] User earned reward:', reward);
          userEarnedReward = true;
        }
      );

      // Show the ad
      rewardedAd.show().then(() => {
        console.log('✅ [AdMob] Rewarded ad shown successfully');
        unsubscribeEarned();
        resolve(userEarnedReward);
      }).catch((error) => {
        console.error('❌ [AdMob] Failed to show rewarded ad:', error);
        unsubscribeEarned();
        resolve(false);
      });
    } catch (error) {
      console.error('❌ [AdMob] Error showing rewarded ad:', error);
      resolve(false);
    }
  });
};

/**
 * Check if interstitial ad is ready
 
export const isInterstitialReady = (): boolean => {
  return Platform.OS !== 'web' && isInterstitialLoaded;
};

/**
 * Check if rewarded ad is ready
 
export const isRewardedReady = (): boolean => {
  return Platform.OS !== 'web' && isRewardedLoaded;
};

/**
 * Initialize all ads
 * Call this once when the app starts
 
export const initializeAds = () => {
  if (Platform.OS === 'web') {
    console.log('[AdMob] Skipping ad initialization on web');
    return;
  }

  console.log('🚀 [AdMob] Initializing ads...');
  initializeInterstitialAd();
  initializeRewardedAd();
};

// Export as AdMob object for backward compatibility
export const AdMob = {
  initialize: initializeAds,
  showInterstitial: showInterstitialAd,
  showRewarded: showRewardedAd,
  isInterstitialReady,
  isRewardedReady,
};

export default AdMob;*/