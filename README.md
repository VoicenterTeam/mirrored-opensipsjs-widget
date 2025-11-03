# OpenSIPSJS Widget

A Vue 3-based custom web component for integrating OpenSIPS VoIP (Voice over Internet Protocol) functionalities into any web application. This widget wraps the OpenSIPS-JS implementation, providing a ready-to-use UI for SIP (Session Initiation Protocol) communication.

[![npm version](https://img.shields.io/npm/v/opensips-js-widget.svg)](https://www.npmjs.com/package/opensips-js-widget)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Features

- **SIP Communication**: Make and receive calls through OpenSIPS-JS
- **Media Device Management**: Select and manage audio/video devices
- **Flexible UI Layouts**:
  - Floating: Freely movable widget
  - Docked: Anchored to a specific side of the viewport
  - Fixed: Positioned at specific coordinates
- **Custom Layouts**:
  - Rounded: Circular call view
  - QuickCall: Simplified calling interface
- **Theming Support**: Customize colors and appearance
- **Call Management**:
  - Call waiting (automatically rejects incoming calls with 486 when disabled)
  - Call transfer
  - Call merging (conference)
  - Hold/resume
  - Mute/unmute
  - Do Not Disturb (DND)
- **Visual Customization**:
  - Custom logos
  - Background images
- **Keypad Modes**:
  - Popover
  - Static
  - Manual
- **Video Call Support**: For face-to-face communication
- **Auto-Answer Settings**: Configure automatic call answering behavior
- **Framework Agnostic**: Works with any web application as a custom element

## Installation

### NPM Package

```bash
# Using npm
npm install opensips-js-widget

# Using yarn
yarn add opensips-js-widget
```

### CDN

```html
<script src="https://cdn.example.com/opensipsjs-widget.umd.js"></script>
<link rel="stylesheet" href="https://cdn.example.com/opensipsjs-widget.css">
```

## Basic Usage

### HTML Integration

```html
<!-- Add the widget to your HTML -->
<opensips-widget></opensips-widget>

<script>
// When the widget is ready
document.querySelector('opensips-widget').addEventListener('widget:ready', ({ detail: OpenSIPSWidget }) => {
  // Create widget instance with configuration
  const widget = new OpenSIPSWidget({
    themeSettings: {
      colors: {
        primary: '#4f46e5',
        secondary: '#6366f1',
        // other color settings...
      },
      widgetType: 'audio'
    },
    callSettings: {
      quickCallNumber: '',
      allowTransfer: true,
      showKeypad: true,
      // other call settings...
    },
    loggerSettings: {
      useLogger: true,
      loggerConfig: {
        url: 'wss://logger.example.com',
        loggerOptions: {
          system: 'OPENSIPSJS_WIDGET',
          logToConsole: true,
          loggerLevel: 'debug'
          // other logger settings...
        }
      }
    }
  });
  
  // Login with SIP credentials
  widget.login({
    username: 'user',
    password: 'pass',
    domain: 'sip.example.com'
  });
});
</script>
```

### JavaScript Import

```javascript
import 'opensips-js-widget';

// After your DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const widgetElement = document.createElement('opensips-widget');
  document.body.appendChild(widgetElement);
  
  // Configure widget when ready
  widgetElement.addEventListener('widget:ready', ({ detail: OpenSIPSWidget }) => {
    // Initialize the widget
    const widget = new OpenSIPSWidget({
      themeSettings: { /* ... */ },
      callSettings: { /* ... */ },
      loggerSettings: {
        useLogger: true,
        loggerConfig: { /* ... */ }
      }
    });
    
    // Login and use the widget...
  });
});
```

## Configuration

The widget is configured through a configuration object passed to the constructor:

```javascript
const widget = new OpenSIPSWidget({
  themeSettings: {
    // Theme configuration
  },
  callSettings: {
    // Call settings configuration
  },
  loggerSettings: {
    // Logger configuration (optional)
  }
});
```

### Theme Settings

```javascript
themeSettings: {
  colors: {
    primary: '#4f46e5',              // Primary color
    secondary: '#6366f1',            // Secondary color
    'main-text': '#000000',          // Main text color
    'secondary-text': '#6b7280',     // Secondary text color
    'button-pressed-text': '#ffffff', // Button text when pressed
    'border-lines': '#e5e7eb',       // Border colors
    'primary-bg': '#ffffff',         // Primary background
    'secondary-bg': '#f3f4f6',       // Secondary background
    'inactive-bg': '#9ca3af',        // Inactive element background
    'success': '#10b981',            // Success color
    'danger': '#ef4444',             // Danger/error color
    'additional-danger-bg': '#fee2e2', // Additional danger background
    'additional-success-bg': '#d1fae5' // Additional success background
  },
  widgetType: 'audio', // 'audio' or 'video'
  audioConfig: {
    images: {
      backgroundLogo: 'url/to/logo.png' // Optional background logo
    },
    layoutConfig: {
      mode: 'floating', // 'floating', 'docked', or 'fixed'
      type: 'rounded',  // 'rounded' or 'quickCall'
      position: {
        left: '20px',
        bottom: '20px',
        anchor: 'bottom-center' // Optional anchor point
      },
      keypadMode: 'popover', // 'popover', 'static', or 'manual'
      keypadPosition: 'bottom' // 'top' or 'bottom'
    }
  }
}
```

### Call Settings

```javascript
callSettings: {
  quickCallNumber: '',  // Default number for quick calling
  allowTransfer: true,  // Enable call transfer functionality
  showKeypad: true,     // Show keypad button
  autoAnswer: {
    allowChange: true,  // Allow user to toggle auto-answer in UI
    defaultBehavior: false // Default auto-answer behavior
  },
  DND: {
    allowChange: true,  // Allow user to toggle DND in UI
    defaultBehavior: false // Default DND behavior
  },
  callWaiting: true,    // Enable call waiting (when false, rejects incoming calls with 486 when already on a call)
  outgoingCalls: true,  // Allow making outgoing calls
  mergeCalls: true,     // Allow merging multiple calls into a conference
  callerInfo: {
    displayName: true,  // Show caller name
    callerId: {
      display: true,    // Show caller ID
      mask: false       // Mask caller ID (replaces digits with X except last one)
    }
  },
  shrinkOnIdle: true,   // Shrink widget when idle
  ringingSound: 'url/to/sound.mp3', // Custom ringing sound
  outgoingCallPlaceHolder: 'Enter number...', // Placeholder text
  outgoingInputRegexValidator: ['^[0-9]+$'] // Regex validators for input
}
```

### Logger Settings

Configure logging functionality for the widget. The logger uses `@voicenter-team/socketio-storage-logger` to collect and send logs:

```javascript
loggerSettings: {
  useLogger: true,  // Enable/disable logger
  loggerConfig: {
    url: 'wss://logger.example.com', // Socket.IO server URL (optional, empty string to disable remote logging)
    loggerOptions: {
      system: 'OPENSIPSJS_WIDGET',        // System identifier for logs
      staticObject: {},                   // Additional static fields to include in all logs
      logToConsole: true,                 // Whether to output logs to browser console
      overloadGlobalConsole: false,       // Whether to override global console methods
      socketEmitInterval: 10000,          // Interval (ms) between sending log batches to server
      loggerLevel: 'debug',               // Minimum log level: 'debug', 'info', 'warn', 'error'
      debugPrefix: 'widget logger'        // Prefix for debug log messages
    }
  }
}
```

**Note:** When `loggerSettings.useLogger` is `false` or `loggerSettings` is omitted, logging is disabled. The logger automatically includes widget version, browser fingerprint, and hostname in all logs.

### Advanced Configuration

#### Debug Mode

Enable debug logging for troubleshooting:

```javascript
{
  debug: true, // Enable debug logging for tab management and widget internals
  themeSettings: { /* ... */ },
  callSettings: { /* ... */ }
}
```

#### Language Support

Set the widget interface language:

```javascript
themeSettings: {
  lang: 'en', // 'en' (English) or 'he' (Hebrew)
  widgetType: 'audio',
  // ...
}
```

## API Reference

### External API Methods

The widget exposes several methods through its external API:

#### Event Subscription

Subscribe to SIP and call events:

```javascript
// New RTC session (incoming or outgoing call)
widget.on('newRTCSession', (session) => {
  console.log('New call:', session.id, session.direction);
});

// Call confirmed/answered
widget.on('confirmed', (session) => {
  console.log('Call confirmed:', session.id);
});

// Call ended
widget.on('ended', (session) => {
  console.log('Call ended:', session.id);
});

// Call failed
widget.on('failed', (session) => {
  console.log('Call failed:', session.id);
});

// Connection state changes
widget.on('connected', () => {
  console.log('SIP connected');
});

widget.on('disconnected', () => {
  console.log('SIP disconnected');
});

widget.on('registered', () => {
  console.log('SIP registered');
});

widget.on('unregistered', () => {
  console.log('SIP unregistered');
});

widget.on('registrationFailed', (cause) => {
  console.log('Registration failed:', cause);
});
```

**Note:** For a complete list of available events, refer to the [OpenSIPS-JS documentation](https://opensipsjs.org/).

#### Configuration

```javascript
// Update configuration
widget.setConfig({
  callSettings: {
    quickCallNumber: '1234567890'
  }
});

// Get current configuration
const config = widget.getConfig();
```

#### SIP Operations

```javascript
// Login to SIP server with password
await widget.login({
  username: 'user',
  password: 'pass',
  domain: 'sip.example.com'
});

// Alternative: Login with JWT authentication
await widget.login({
  username: 'user',
  authorization_jwt: 'your-jwt-token',
  domain: 'sip.example.com'
});

// Disconnect from SIP server
widget.disconnect();
```

#### Display Customization

Customize how caller information is displayed using display resolvers:

```javascript
// Set a resolver for caller information
widget.display.setResolver('callerInfo', async (callUser, call) => {
  // callUser contains: { userName, userPhone }
  // Fetch caller info from your database/API
  const contact = await fetchContactInfo(callUser.userPhone);
  
  if (contact) {
    return {
      name: contact.displayName,
      number: contact.formattedNumber
    };
  }
  // Return undefined to use default display
});

// Clear a resolver
widget.display.clearResolver('callerInfo');

// Check if a resolver is set
if (widget.display.hasResolver('callerInfo')) {
  console.log('Caller info resolver is active');
}
```

#### VSIP Actions API

Control calls programmatically using the VSIP actions API:

```javascript
// Start a new call
widget.vsip.startCall('1234567890');
widget.vsip.startCall('1234567890', true, false); // addToCurrentRoom, holdOtherCalls

// Answer an incoming call
widget.vsip.answerCall(callId);

// Terminate a call
widget.vsip.terminateCall(callId);

// Hold/Unhold calls
widget.vsip.holdCall(callId);
widget.vsip.unholdCall(callId);

// Transfer a call
widget.vsip.transferCall(callId, '9876543210');

// Merge calls
widget.vsip.mergeCallsInRoom(roomId);
widget.vsip.mergeCallByIds(callId1, callId2);

// Move call to different room
await widget.vsip.moveCall(callId, roomId);
await widget.vsip.setActiveRoom(roomId);

// Send DTMF tones
widget.vsip.sendDTMF(callId, '1234');

// Mute/Unmute
widget.vsip.mute(true);  // Mute agent
widget.vsip.mute(false); // Unmute agent
widget.vsip.muteCaller(callId, true);  // Mute specific caller
widget.vsip.muteCaller(callId, false); // Unmute specific caller

// Volume controls
widget.vsip.setSpeakerVolume(75);        // 0-100
widget.vsip.setMicrophoneSensitivity(80); // 0-100

// Call settings
widget.vsip.setDND(true);               // Enable Do Not Disturb
widget.vsip.setAutoAnswer(true);        // Enable auto-answer
await widget.vsip.setCallWaiting(false); // Disable call waiting
```

## Layout Modes

### Floating

The widget can be freely moved by dragging it around the screen.

```javascript
layoutConfig: {
  mode: 'floating',
  position: {
    left: '20px',
    bottom: '20px'
  }
}
```

### Docked

The widget is anchored to a specific position in the viewport.

```javascript
layoutConfig: {
  mode: 'docked',
  position: {
    anchor: 'bottom-center'
  }
}
```

### Fixed

The widget is fixed at specific coordinates and cannot be moved.

```javascript
layoutConfig: {
  mode: 'fixed',
  position: {
    left: '20px',
    top: '20px'
  }
}
```

## Development

### Prerequisites

- Node.js >= 16
- Yarn >= 1.22.4

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/opensipsjs-widget.git
cd opensipsjs-widget

# Install dependencies
yarn install
```

### Development Commands

```bash
# Run development server
yarn dev

# Run development server with widget configuration
yarn dev-widget

# Run documentation development server
yarn dev:documentation

# Type checking
yarn type-check

# Linting
yarn lint
```

### Building

```bash
# Standard build
yarn build

# Widget build
yarn build-widget

# Build documentation
yarn docs-build
```

## Documentation

For more detailed information, visit the [official documentation](https://mirrored-opensipsjs-widget.pages.dev/).

The demo application is available [here](https://mirrored-opensipsjs-widget.pages.dev/example).

## License

MIT License
