# Changelog

All notable changes to FlashRead will be documented in this file.

## [1.1.0] - 2025-01-25

### Fixed
- Prevent double content script initialization when script is injected multiple times (fixes duplicate sessions bug)
- Only save reading sessions with 10+ words to prevent accidental empty sessions

### Added
- Firefox browser support (MV3)
- Dedicated Firefox build configuration (`npm run build:firefox`)

## [1.0.0] - Initial Release

### Features
- RSVP (Rapid Serial Visual Presentation) speed reading
- Adjustable reading speed (WPM)
- Article extraction using Mozilla Readability
- Text selection support
- Reading session tracking with statistics
- Keyboard shortcuts for control
- Context menu integration
