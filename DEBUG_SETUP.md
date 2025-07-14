# 🐛 Debugging & Error Tracking Setup

## Overview
This project now includes comprehensive debugging and error tracking capabilities:

- **Sentry Integration**: Advanced error tracking and crash reporting
- **Debug Panel**: Real-time application monitoring in development
- **Performance Monitoring**: Track component render times and memory usage
- **Enhanced Error Boundaries**: Better error handling and recovery

## 🚀 Quick Start

### 1. Debug Panel
The debug panel is automatically available in development mode. Click the bug icon (🐛) in the bottom-right corner to open it.

**Features:**
- Real-time console log capture
- Memory usage monitoring
- Performance metrics
- Application state inspection
- Browser information

### 2. Console Debugging
Use the debug utilities in your components:

```typescript
import { debug, perf } from '../utils/debug';

// Logging
debug.info('Component mounted');
debug.warn('Deprecated feature used');
debug.error('Something went wrong', error);

// Performance monitoring
perf.startTimer('api-call');
// ... your code ...
perf.endTimer('api-call');

// Async performance monitoring
const result = await perf.measureAsync('data-fetch', async () => {
  return fetch('/api/data');
});
```

### 3. Hook Debugging
Use debug hooks for component lifecycle tracking:

```typescript
import { useDebugEffect, useDebugState } from '../utils/debug';

function MyComponent() {
  const [data, setData] = useDebugState(null, 'userData');
  
  useDebugEffect(() => {
    // Your effect code
  }, [data], 'dataEffect');
  
  return <div>...</div>;
}
```

## 🔧 Sentry Configuration

### 1. Get Your Sentry DSN
1. Go to [Sentry.io](https://sentry.io)
2. Create a new project or use existing one
3. Copy your DSN from project settings

### 2. Update Configuration
Edit `src/services/sentry.ts` and replace the placeholder DSN:

```typescript
Sentry.init({
  dsn: "https://your-actual-dsn@your-org.ingest.sentry.io/your-project",
  // ... other config
});
```

### 3. Environment Variables
Create a `.env.local` file (not tracked by git):

```bash
VITE_SENTRY_DSN=https://your-actual-dsn@your-org.ingest.sentry.io/your-project
VITE_APP_VERSION=1.0.0
```

## 📊 Debug Configuration

### Environment Variables
Set these in your `.env.local` file:

```bash
# Enable debug mode
VITE_DEBUG=true

# Log level (error, warn, info, debug, trace)
VITE_LOG_LEVEL=debug

# Enable performance monitoring
VITE_PERFORMANCE_DEBUG=true
```

### Debug Levels
- `error`: Only errors
- `warn`: Errors and warnings
- `info`: Errors, warnings, and info messages
- `debug`: All messages including debug
- `trace`: All messages including trace

## 🛠️ Error Boundary Features

The enhanced error boundary provides:

- **Graceful Error Handling**: Catches React errors and prevents crashes
- **User-Friendly Messages**: Clear error messages for users
- **Recovery Options**: Try again and reload page buttons
- **Development Details**: Stack traces in development mode
- **Sentry Integration**: Automatic error reporting in production

## 🔍 Debug Panel Features

### Logs Tab
- Real-time console log capture
- Color-coded by log level
- Expandable data objects
- Timestamp tracking

### Performance Tab
- Memory usage monitoring
- Performance metrics
- Timer tracking
- Resource usage

### App State Tab
- Environment information
- Browser details
- Performance timing
- Application configuration

## 🚨 Troubleshooting

### Common Issues

1. **Debug Panel Not Showing**
   - Ensure you're in development mode (`npm run dev`)
   - Check browser console for errors
   - Verify `VITE_DEBUG=true` is set

2. **Sentry Not Working**
   - Verify DSN is correctly configured
   - Check network connectivity
   - Ensure you're in production mode for Sentry

3. **Performance Issues**
   - Use the debug panel to monitor memory usage
   - Check for memory leaks in component unmounting
   - Monitor API call performance

### Debug Commands

```bash
# Start with debug logging
npm run dev

# Check for TypeScript errors
npm run type-check

# Build for production testing
npm run build
npm run preview
```

## 📈 Best Practices

1. **Use Debug Logging Sparingly**
   - Don't log sensitive information
   - Use appropriate log levels
   - Clean up debug code before production

2. **Performance Monitoring**
   - Monitor critical user paths
   - Track API response times
   - Watch for memory leaks

3. **Error Handling**
   - Always wrap async operations in try-catch
   - Use error boundaries for component errors
   - Provide meaningful error messages

4. **Sentry Usage**
   - Add context to error reports
   - Use breadcrumbs for debugging
   - Set up alerts for critical errors

## 🔗 Useful Links

- [Sentry Documentation](https://docs.sentry.io/)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

## 📝 Notes

- Debug features are automatically disabled in production builds
- Sentry only reports errors in production mode
- The debug panel is only visible in development
- All debug utilities are tree-shaken out of production builds 