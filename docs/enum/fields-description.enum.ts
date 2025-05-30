// export const CONFIG_DESCRIPTION = {
//     themeSettings: {
//         colors: {
//             primary: 'Color that is used for almost all primary actions, like buttons icons, icons',
//             secondary: 'Color that is used for secondary actions, like incoming call transfer button',
//             'main-text': 'Color that is used for all the main text, like settings text, input text, etc',
//             'secondary-text': 'Color that is used for sub-texts, like text in transfer view, etc',
//             'button-pressed-text': 'Color for the icons of the buttons when they are pressed or hovered',
//             'border-lines': 'Main border color which defines the borders of the buttons',
//             'primary-bg': 'Color that is used for background for almost all the primary actions, should be compatible with primary color',
//             'secondary-bg': 'Color that is used for background for secondary actions, should be compatible with secondary color',
//             'inactive-bg': 'Color for the background of the inactive buttons',
//             success: 'Color for the confirm actions, like confirm button, success message',
//             danger: 'Color for the danger actions, like cancel button, error message',
//             'additional-danger-bg': 'Color for the pressed state of the danger buttons',
//             'additional-success-bg': 'Color for the pressed state of the success buttons'
//         },
//         images: {
//             backgroundLogo: 'If outgoing calls option disabled this icon will be shown in the background of the widget'
//         },
//         layoutConfig: {
//             mode: 'This setting defines the positioning and behavior of the widget on the page, supports following options:' +
//                 '<br>' +
//                 '<ul>' +
//                 '<li><strong>floating</strong> - The mode in which widget is positioned above everything and has the area by which can be dragged by the user.</li>' +
//                 '<li><strong>docked</strong> - The mode in which widget is placed directly where it is appears in the html relative to other content. </li>' +
//                 '<li><strong>fixed</strong> - The mode in which widget is positioned above everything but on some specific position on the screen, the position is configred in <code>position</code> options.</li>' +
//                 '</ul>',
//             type: 'This setting defines the layout of the widget, supports following options:' +
//                 '<br>' +
//                 '<ul>' +
//                 '<li><strong>rounded</strong> - The rounded widget layout in which the widget has some idle functionality.</li>' +
//                 '<li><strong>quickCall</strong> - The layout in which the widget in idle view is just a call action button that will initiate the call on click to the target defined in <code>Call Settings Quick Call Number</code></li>' +
//                 '</ul>',
//             position: {
//                 left: 'If is not specified, the value will be set to <code>auto</code>.' +
//                     '<br>' +
//                     'Accepts any valid css value.',
//                 top: 'If is not specified, the value will be set to <code>auto</code>.' +
//                     '<br>' +
//                     'Accepts any valid css value.',
//                 right: 'If is not specified, the value will be set to <code>auto</code>.' +
//                     '<br>' +
//                     'Accepts any valid css value.',
//                 bottom: 'If is not specified, the value will be set to <code>auto</code>.' +
//                     '<br>' +
//                     'Accepts any valid css value.',
//                 anchor: 'The predefined position for the widget to stick to, should be used only in floating or fixed modes.' +
//                     '<br>' +
//                     'If the anchor parameter is specified, the opposite to anchor value position parameters will be ignored. ' +
//                     '<br>' +
//                     'For example, if anchor value is <code>bottom-center</code>, only bottom parameter will be used.'
//             },
//             keypadMode: 'If <code>Call Settings Show Keypad</code> is enabled this option will configure the behavior of keypad.' +
//                 '<br>' +
//                 'Supports the following options:' +
//                 '<br>' +
//                 '<ul>' +
//                 '<li><strong>popover</strong> - The keypad will be shown on hover over keypad button</li>' +
//                 '<li><strong>static</strong> - The keypad is always shown as a part of widget elemnet</li>' +
//                 '<li><strong>manual</strong> - The keypad will be shown on clicking on the keypad button</li>' +
//                 '</ul>',
//             keypadPosition: 'If keypad is enabled this setting will affect the positioning of the keypad. Only works for static keypad mode'
//         }
//     },
//     callSettings: {
//         quickCallNumber: 'Defines the number that will be dialed in the <code>quickCall</code> mode',
//         allowTransfer: 'If to allow user to transfer the calls',
//         showKeypad: 'If to show the keypad',
//         autoAnswer: {
//             allowChange: 'If the auto answer is enabled, this option will determine if the user is allowed to change it',
//             defaultBehavior: 'If option enabled, upon receiving an incoming call it will be answered automatically'
//         },
//         outgoingCalls: 'If to allow the user to make outgoing calls',
//         callerInfo: {
//             displayName: 'If to display the name of the caller if available when on call',
//             callerId: {
//                 display: 'If to display the number of the caller (DID)',
//                 mask: 'The option determines whether to mask the caller\'s phone number by replacing all digits except the last one with \'X\'s, while preserving the country code if present'
//             }
//         },
//         shrinkOnIdle: 'If enabled, once not on a call, the widget will shrink to a smaller size',
//         ringingSound: 'The sound to play when a call is incoming',
//         outgoingCallPlaceHolder: 'The placeholder to show in the outgoing call input',
//         outgoingInputRegexValidator: 'The option specifies an array of regular expression patterns used to validate and sanitize the user\'s input in the outgoing call input field, ensuring that only characters matching these patterns are allowed.'
//     }
// }

export const CONFIG_DESCRIPTION = {
    themeSettings: {
        colors: {
            primary: 'Color used for most primary actions, such as button icons.',
            secondary: 'Color used for secondary actions, like the incoming call transfer button.',
            'main-text': 'Color used for all main text, such as settings text and input text.',
            'secondary-text': 'Color used for secondary text, such as text in the transfer view.',
            'button-pressed-text': 'Color for button icons when they are pressed or hovered over.',
            'border-lines': 'Primary border color used for button borders.',
            'primary-bg': 'Background color used for most primary actions; should complement the primary color.',
            'secondary-bg': 'Background color used for secondary actions; should complement the secondary color.',
            'inactive-bg': 'Background color for inactive buttons.',
            success: 'Color for confirm actions, such as the confirm button and success messages.',
            danger: 'Color for danger actions, like the cancel button and error messages.',
            'additional-danger-bg': 'Background color for danger buttons when pressed.',
            'additional-success-bg': 'Background color for success buttons when pressed.'
        },
        widgetType: 'audio',
        audioConfig: {
            images: {
                backgroundLogo: 'If the outgoing calls option is disabled, this icon will be displayed in the background of the widget.'
            },
            layoutConfig: {
                mode:
                    'Defines the widget’s positioning and behavior on the page. Supports the following options:' +
                    '<br>' +
                    '<ul>' +
                    '<li><strong>floating</strong> - The widget floats above all content and can be dragged by the user.</li>' +
                    '<li><strong>docked</strong> - The widget is placed directly where it appears in the HTML, relative to other content.</li>' +
                    '<li><strong>fixed</strong> - The widget is fixed above all content at a specific position on the screen, configured in the <code>position</code> options.</li>' +
                    '</ul>',
                type:
                    'Defines the layout of the widget. Supports the following options:' +
                    '<br>' +
                    '<ul>' +
                    '<li><strong>rounded</strong> - A rounded widget layout that offers some idle functionality.</li>' +
                    '<li><strong>quickCall</strong> - In idle view, the widget is just a call action button that initiates a call to the number defined in <code>Call Settings Quick Call Number</code> when clicked.</li>' +
                    '<li><strong>phone</strong> - Looks like a phone</li>' +
                    '</ul>',
                position: {
                    left:
                        'If not specified, defaults to <code>auto</code>.' +
                        '<br>' +
                        'Accepts any valid CSS value.',
                    top:
                        'If not specified, defaults to <code>auto</code>.' +
                        '<br>' +
                        'Accepts any valid CSS value.',
                    right:
                        'If not specified, defaults to <code>auto</code>.' +
                        '<br>' +
                        'Accepts any valid CSS value.',
                    bottom:
                        'If not specified, defaults to <code>auto</code>.' +
                        '<br>' +
                        'Accepts any valid CSS value.',
                    anchor:
                        'Sets a predefined position for the widget; should be used only in floating or fixed modes.' +
                        '<br>' +
                        'If the anchor is specified, position parameters opposite to the anchor value will be ignored.' +
                        '<br>' +
                        'For example, if the anchor is <code>bottom-center</code>, only the bottom parameter will be used.'
                },
                keypadMode:
                    'If <code>Call Settings Show Keypad</code> is enabled, this option configures the keypad behavior.' +
                    '<br>' +
                    'Supports the following options:' +
                    '<br>' +
                    '<ul>' +
                    '<li><strong>popover</strong> - The keypad appears when hovering over the keypad button.</li>' +
                    '<li><strong>static</strong> - The keypad is always visible as part of the widget.</li>' +
                    '<li><strong>manual</strong> - The keypad appears when the keypad button is clicked.</li>' +
                    '</ul>',
                keypadPosition: 'Affects the positioning of the keypad when enabled. Applicable only in static keypad mode.'
            }
        }
    },
    callSettings: {
        quickCallNumber: 'Specifies the number to dial in <code>quickCall</code> mode.',
        allowTransfer: 'Allows the user to transfer calls.',
        showKeypad: 'Determines whether to display the keypad.',
        autoAnswer: {
            allowChange: 'If auto-answer is enabled, this determines whether the user can change it.',
            defaultBehavior: 'When enabled, incoming calls are answered automatically.'
        },
        callWaiting: 'Determines whether incoming calls are waiting to be answered when user already has another active session',
        DND: {
            allowChange: 'If DND is enabled, this determines whether the user can change it.',
            defaultBehavior: 'When enabled, user will not be able to make calls.'
        },
        outgoingCalls: 'Allows the user to make outgoing calls.',
        callerInfo: {
            displayName: 'Determines whether to display the caller\'s name during a call, if available.',
            callerId: {
                display: 'Determines whether to display the caller\'s number (DID).',
                mask: 'Determines whether to mask the caller\'s phone number by replacing all digits except the last one with \'X\'s, while preserving the country code if present.'
            }
        },
        shrinkOnIdle: 'When enabled, the widget shrinks to a smaller size when not on a call.',
        ringingSound: 'Specifies the sound to play for incoming calls.',
        outgoingCallPlaceHolder: 'Sets the placeholder text in the outgoing call input field.',
        outgoingInputRegexValidator: 'Specifies an array of regular expression patterns to validate and sanitize the user\'s input in the outgoing call input field, ensuring only allowed characters are entered.'
    }
}
