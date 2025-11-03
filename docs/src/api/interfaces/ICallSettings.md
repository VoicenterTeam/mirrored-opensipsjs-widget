# Interface: ICallSettings

Represents the call settings for the widget.

## Table of contents

### Properties

- [allowTransfer](ICallSettings.md#allowtransfer)
- [autoAnswer](ICallSettings.md#autoanswer)
- [callWaiting](ICallSettings.md#callwaiting)
- [callerInfo](ICallSettings.md#callerinfo)
- [DND](ICallSettings.md#dnd)
- [domain](ICallSettings.md#domain)
- [mergeCalls](ICallSettings.md#mergecalls)
- [outgoingCallPlaceHolder](ICallSettings.md#outgoingcallplaceholder)
- [outgoingCalls](ICallSettings.md#outgoingcalls)
- [outgoingInputRegexValidator](ICallSettings.md#outgoinginputregexvalidator)
- [quickCallNumber](ICallSettings.md#quickcallnumber)
- [ringingSound](ICallSettings.md#ringingsound)
- [showKeypad](ICallSettings.md#showkeypad)
- [shrinkOnIdle](ICallSettings.md#shrinkonidle)

## Properties

### allowTransfer

• **allowTransfer**: `boolean`

#### Defined in

public-api.d.ts:188

___

### autoAnswer

• **autoAnswer**: [`IAutoAnswerSettings`](IAutoAnswerSettings.md)

#### Defined in

public-api.d.ts:190

___

### callWaiting

• **callWaiting**: `boolean`

Determines whether incoming calls can wait when the user is already on an active call.

When set to `false`, incoming calls are automatically rejected with SIP status code 486 (Busy Here) if the user is already on an active call.

When set to `true`, incoming calls will be queued and can be answered while maintaining the current call.

#### Defined in

public-api.d.ts:384

___

### callerInfo

• **callerInfo**: [`ICallerInfoSettings`](ICallerInfoSettings.md)

#### Defined in

public-api.d.ts:192

___

### DND

• **DND**: [`IDNDSettings`](IDNDSettings.md)

Do Not Disturb settings. When enabled, prevents the user from making or receiving calls.

#### Defined in

public-api.d.ts:381

___

### domain

• **domain**: `string`

#### Defined in

public-api.d.ts:186

___

### mergeCalls

• **mergeCalls**: `boolean`

Determines whether users can merge multiple active calls into a conference.

When set to `true`, users can merge calls together. When set to `false`, call merging functionality is disabled.

#### Defined in

public-api.d.ts:383

___

### outgoingCallPlaceHolder

• **outgoingCallPlaceHolder**: `string`

#### Defined in

public-api.d.ts:195

___

### outgoingCalls

• **outgoingCalls**: `boolean`

#### Defined in

public-api.d.ts:191

___

### outgoingInputRegexValidator

• **outgoingInputRegexValidator**: `string`[]

#### Defined in

public-api.d.ts:196

___

### quickCallNumber

• **quickCallNumber**: `string`

#### Defined in

public-api.d.ts:187

___

### ringingSound

• **ringingSound**: `string`

#### Defined in

public-api.d.ts:194

___

### showKeypad

• **showKeypad**: `boolean`

#### Defined in

public-api.d.ts:189

___

### shrinkOnIdle

• **shrinkOnIdle**: `boolean`

#### Defined in

public-api.d.ts:193
