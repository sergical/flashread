# FlashRead Extension - Build Instructions

## Requirements

- **OS**: macOS, Linux, or Windows
- **Node.js**: v20 or higher
- **pnpm**: v9.15.0 or higher

## Build Steps

From the repository root:

```bash
# 1. Install dependencies
pnpm install

# 2. Build Firefox extension
pnpm run build:extension:firefox
```

The built extension will be in `apps/extension/dist-firefox/`.

## Alternative: Build from extension directory

```bash
cd apps/extension

# Install dependencies (if not done from root)
pnpm install

# Build Firefox
npm run build:firefox
```

## Project Structure

- `apps/extension/` - Browser extension source code
- `packages/core/` - Shared RSVP reader logic (dependency)

## Notes

- The extension uses Vite with `vite-plugin-web-extension` for bundling
- `@flashread/core` is a workspace dependency that gets built first
- Source uses TypeScript, compiled to JavaScript during build
