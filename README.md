# OpenSIPS Widget
A Vue3-based widget for integrating OpenSIPS VoIP functionalities into your web application.

## Features
- SIP calling features through OpenSIPS-JS.
- Audio device selection.
- Theming support.
- Draggable UI.
- Customizable through HTML attributes.

For more information about OpenSIPS-JS, visit the [official documentation](). 
The demo application is available [here](https://opensips-widget.netlify.app/).


## How to Use
### Basic Usage
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OpenSIPS Widget</title>
</head>
<body>
    <script type="module" src="https://cdn.voicenter.com/opensips-widget"></script>

    <opensips-widget id="openSIPSWidget"></opensips-widget>

    <script>
        const widget = document.getElementById('openSIPSWidget')

        async function onWidgetInitialized ({ detail: initFunction }) {
            const credentials = {
                username: 'fV8Dt1RR',
                password: 'F3sHiwfV8fQ8npVA',
                domain: 'sip07.voicenter.co'
            }

            const themeSettings = {
                colors: {
                    primary: '#1a202c',
                    secondary: '#1a202c',
                    accent: '#1a202c',
                },
                layoutConfig: {
                    mode: 'floating',
                    type: 'rounded'
                }
            }

            const callSettings = {
                allowTransfer: true,
                autoAnswer: {
                    allowChange: false,
                    defaultBehavior: true
                },
                outgoingCalls: false,
                callerInfo: {
                    displayName: true,
                    callerId: {
                        display: true,
                        mask: true
                    }
                }
            }

            const widgetAPI = await initFunction({
                credentials,
                config: {
                    themeSettings,
                    callSettings
                }
            })

            widgetAPI
                    .on('callConfirmed', (call) => {
                        console.log('call confirmed:', call)
                    })
        }

        widget.addEventListener('widget:ready', onWidgetInitialized)
    </script>
</body>
</html>
```

Replace `your_username`, `your_password`, and `your_domain` with your actual SIP credentials.

### Available HTML Attributes
- `theme`: Defines the color theme of the widget.

### Event Handlers
The OpenSIPS widget exposes several events that you can listen to:

- `widget:ready`: Fired when the widget is ready. 
The handler for this event is given a function that, when called with the SIP credentials, 
returns a promise of the widget's API

## API
The API returned by the `widget:ready` event handler gives you control over the OpenSIPS instance and other features. The API includes:

- `on(type, listener)`: Registers an event listener for SIP events.
