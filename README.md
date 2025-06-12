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
  - Call transfer
  - Call merging
  - Hold/resume
  - Mute/unmute
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
      // Configuration options
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
    allowChange: true,  // Allow changing auto-answer setting
    defaultBehavior: false // Default auto-answer behavior
  },
  outgoingCalls: true,  // Allow making outgoing calls
  callerInfo: {
    displayName: true,  // Show caller name
    callerId: {
      display: true,    // Show caller ID
      mask: false       // Mask caller ID
    }
  },
  shrinkOnIdle: true,   // Shrink widget when idle
  ringingSound: 'url/to/sound.mp3', // Custom ringing sound
  outgoingCallPlaceHolder: 'Enter number...', // Placeholder text
  outgoingInputRegexValidator: ['^[0-9]+$'] // Regex validators for input
}
```

## API Reference

### External API Methods

The widget exposes several methods through its external API:

#### Event Subscription

```javascript
widget.on('callReceived', (callData) => {
  console.log('Incoming call from:', callData.from);
});
```

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
// Login to SIP server
await widget.login({
  username: 'user',
  password: 'pass',
  domain: 'sip.example.com'
});

// Disconnect from SIP server
widget.disconnect();
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
