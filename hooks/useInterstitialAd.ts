// hooks/useInterstitialAd.ts
// Simplified hook that uses the AdMob service

import { useState, useEffect } from 'react';
import { AdMob } from '@/services/admob';

export const useInterstitialAd = () => {
  const [isAdLoaded, setIsAdLoaded] = useState(false);

  useEffect(() => {
    // Check ad status periodically
    const checkAdStatus = () => {
      setIsAdLoaded(AdMob.isInterstitialReady());
    };

    // Check immediately
    checkAdStatus();

    // Check every 2 seconds
    const interval = setInterval(checkAdStatus, 2000);

    return () => clearInterval(interval);
  }, []);

  const showAd = async (onAdDismissed?: () => void) => {
    try {
      await AdMob.showInterstitial();
    } catch (error) {
      console.error('Error showing ad:', error);
    } finally {
      // Always execute callback, whether ad showed or not
      if (onAdDismissed) {
        onAdDismissed();
      }
    }
  };

  return {
    isAdLoaded,
    showAd,
  };
};