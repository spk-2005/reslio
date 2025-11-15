import { Platform } from 'react-native';

const INTERSTITIAL_AD_ID = process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID;
const REWARDED_AD_ID = process.env.EXPO_PUBLIC_ADMOB_REWARDED_ID ;

export const showInterstitialAd = async (): Promise<void> => {
  return new Promise((resolve) => {
    if (Platform.OS === 'web') {
      console.log('[AdMob] Interstitial ad would show here (web platform)');
      setTimeout(resolve, 1000);
      return;
    }

    console.log('[AdMob] Showing interstitial ad:', INTERSTITIAL_AD_ID);
    setTimeout(resolve, 2000);
  });
};

export const showRewardedAd = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (Platform.OS === 'web') {
      console.log('[AdMob] Rewarded ad would show here (web platform)');
      setTimeout(() => resolve(true), 1000);
      return;
    }

    console.log('[AdMob] Showing rewarded ad:', REWARDED_AD_ID);
    setTimeout(() => resolve(true), 2000);
  });
};

export const AdMob = {
  showInterstitial: showInterstitialAd,
  showRewarded: showRewardedAd,
};
