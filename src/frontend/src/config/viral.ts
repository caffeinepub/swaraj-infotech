// Viral & Utility Features Configuration
// Single source of truth for share, referral, and viral features

export const VIRAL_CONFIG = {
  // Share Configuration
  share: {
    // Play Store link (update when app is published)
    playStoreLink: 'https://play.google.com/store/apps/details?id=com.swarajinfotech.learning',
    
    // Base share text (English, no emoji)
    baseText: 'Check out Swaraj Infotech Learning App - Master MSCIT and GCC-TBC with practice tests, exam mode, and progress tracking!',
    
    // WhatsApp-specific share text
    whatsAppText: 'Hi! I found this amazing learning app for MSCIT and GCC-TBC courses. It has practice questions, mock exams, and progress tracking. Check it out:',
  },
  
  // Referral Configuration
  referral: {
    // Enable/disable referral feature
    enabled: true,
    
    // Referral share text template
    shareText: (code: string) => 
      `Join me on Swaraj Infotech Learning App using my referral code: ${code}. Get access to practice tests and exam preparation for MSCIT and GCC-TBC!`,
  },
  
  // Feature flags
  features: {
    whatsAppShare: true,
    webShare: true,
    copyLink: true,
    referralCodes: true,
  },
} as const;
