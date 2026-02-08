/**
 * Centralized brand configuration for Swaraj Infotech
 * Contains logo paths and brand text used throughout the application
 */

export const BRAND_CONFIG = {
  // Logo paths (static assets from frontend/public/assets/generated/)
  logo: {
    square: '/assets/generated/swaraj-infotech-logo.dim_1024x1024.png',
    poster: '/assets/generated/swaraj-infotech-logo-poster.dim_1080x1920.png',
    appIcon: '/assets/generated/playstore-app-icon.dim_512x512.png',
  },
  
  // Brand text
  name: 'Swaraj Infotech',
  tagline: 'Innovate • Inspire • Excel',
  shortTagline: 'Learn. Practice. Excel.',
  
  // Alt text for accessibility
  altText: 'Swaraj Infotech Logo',
} as const;
