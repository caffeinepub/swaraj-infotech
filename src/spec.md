# Specification

## Summary
**Goal:** Update the app to use the newly uploaded Swaraj Infotech logo everywhere and remove all “Caffeine AI” branding across the learner app and Admin Panel.

**Planned changes:**
- Add the two uploaded logo image files (`1770580116347.png`, `1770580116347-1.png`) as static frontend assets under `frontend/public/assets/generated/`.
- Replace the existing logo usage across the learner app UI with the new logo assets, including updating `frontend/src/components/BrandHeader.tsx` and `frontend/src/components/SplashScreen.tsx`.
- Remove all user-visible “Caffeine” / “Caffeine AI” branding from the entire frontend (learner app + Admin Panel), including labels, footer text, watermarks, and links.
- Ensure all logo-related alt text and any other user-facing text remains in English.

**User-visible outcome:** Users see Swaraj Infotech branding (new logo) throughout the learner app and Admin Panel, with no remaining “Caffeine AI” mentions anywhere in the UI.
