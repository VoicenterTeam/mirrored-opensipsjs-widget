# Interface: IVSIPActionsAPI

VSIP actions API interface - provides access to all SIP call actions for controlling calls programmatically.

## Table of contents

### Methods

- [answerCall](IVSIPActionsAPI.md#answercall)
- [holdCall](IVSIPActionsAPI.md#holdcall)
- [mergeCallByIds](IVSIPActionsAPI.md#mergecallbyids)
- [mergeCallsInRoom](IVSIPActionsAPI.md#mergecallsinroom)
- [moveCall](IVSIPActionsAPI.md#movecall)
- [mute](IVSIPActionsAPI.md#mute)
- [muteCaller](IVSIPActionsAPI.md#mutecaller)
- [sendDTMF](IVSIPActionsAPI.md#senddtmf)
- [setActiveRoom](IVSIPActionsAPI.md#setactiveroom)
- [setAutoAnswer](IVSIPActionsAPI.md#setautoanswer)
- [setCallWaiting](IVSIPActionsAPI.md#setcallwaiting)
- [setDND](IVSIPActionsAPI.md#setdnd)
- [setMicrophoneSensitivity](IVSIPActionsAPI.md#setmicrophonesensitivity)
- [setSpeakerVolume](IVSIPActionsAPI.md#setspeakervolume)
- [startCall](IVSIPActionsAPI.md#startcall)
- [terminateCall](IVSIPActionsAPI.md#terminatecall)
- [transferCall](IVSIPActionsAPI.md#transfercall)
- [unholdCall](IVSIPActionsAPI.md#unholdcall)

## Methods

### answerCall

▸ **answerCall**(`callId`): `void`

Answer an incoming call.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callId` | `string` | The ID of the call to answer |

#### Returns

`void`

#### Defined in

public-api.d.ts:123

___

### holdCall

▸ **holdCall**(`callId`): `void`

Put a call on hold.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callId` | `string` | The ID of the call to hold |

#### Returns

`void`

#### Defined in

public-api.d.ts:133

___

### mergeCallByIds

▸ **mergeCallByIds**(`firstCallId`, `secondCallId`): `void`

Merge two specific calls into a conference.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `firstCallId` | `string` | The ID of the first call |
| `secondCallId` | `string` | The ID of the second call |

#### Returns

`void`

#### Defined in

public-api.d.ts:158

___

### mergeCallsInRoom

▸ **mergeCallsInRoom**(`roomId`): `void`

Merge all calls in a specific room into a conference.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `roomId` | `number` | The ID of the room containing calls to merge |

#### Returns

`void`

#### Defined in

public-api.d.ts:153

___

### moveCall

▸ **moveCall**(`callId`, `roomId`): `Promise`<`void`\>

Move a call to a different room.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callId` | `string` | The ID of the call to move |
| `roomId` | `number` | The ID of the destination room |

#### Returns

`Promise`<`void`\>

#### Defined in

public-api.d.ts:148

___

### mute

▸ **mute**(`toMute`): `void`

Mute or unmute the agent's microphone.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `toMute` | `boolean` | True to mute, false to unmute |

#### Returns

`void`

#### Defined in

public-api.d.ts:168

___

### muteCaller

▸ **muteCaller**(`callId`, `toMute`): `void`

Mute or unmute a specific caller in a call.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callId` | `string` | The ID of the call |
| `toMute` | `boolean` | True to mute, false to unmute |

#### Returns

`void`

#### Defined in

public-api.d.ts:173

___

### sendDTMF

▸ **sendDTMF**(`callId`, `value`): `void`

Send DTMF tones during a call.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callId` | `string` | The ID of the call |
| `value` | `string` | The DTMF tones to send (e.g., '1234') |

#### Returns

`void`

#### Defined in

public-api.d.ts:163

___

### setActiveRoom

▸ **setActiveRoom**(`roomId`): `Promise`<`void`\>

Set the active room for managing multiple call sessions.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `roomId` | `number` \| `undefined` | The ID of the room to activate, or undefined to clear |

#### Returns

`Promise`<`void`\>

#### Defined in

public-api.d.ts:193

___

### setAutoAnswer

▸ **setAutoAnswer**(`value`): `void`

Enable or disable auto-answer functionality.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `boolean` | True to enable auto-answer, false to disable |

#### Returns

`void`

#### Defined in

public-api.d.ts:183

___

### setCallWaiting

▸ **setCallWaiting**(`state`): `Promise`<`void`\>

Enable or disable call waiting. When disabled, incoming calls are automatically rejected with SIP status 486 (Busy Here) if the user is already on an active call.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `state` | `boolean` | True to enable call waiting, false to disable |

#### Returns

`Promise`<`void`\>

#### Defined in

public-api.d.ts:188

___

### setDND

▸ **setDND**(`value`): `void`

Enable or disable Do Not Disturb mode.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `boolean` | True to enable DND, false to disable |

#### Returns

`void`

#### Defined in

public-api.d.ts:178

___

### setMicrophoneSensitivity

▸ **setMicrophoneSensitivity**(`value`): `void`

Set the microphone sensitivity level.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `number` | Sensitivity level (0-100) |

#### Returns

`void`

#### Defined in

public-api.d.ts:203

___

### setSpeakerVolume

▸ **setSpeakerVolume**(`value`): `void`

Set the speaker volume level.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `number` | Volume level (0-100) |

#### Returns

`void`

#### Defined in

public-api.d.ts:198

___

### startCall

▸ **startCall**(`target`, `addToCurrentRoom?`, `holdOtherCalls?`): `void`

Start a new call to the specified target.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | `string` | The phone number or SIP address to call |
| `addToCurrentRoom?` | `boolean` | Whether to add the call to the current room (optional) |
| `holdOtherCalls?` | `boolean` | Whether to hold other calls (optional) |

#### Returns

`void`

#### Defined in

public-api.d.ts:118

___

### terminateCall

▸ **terminateCall**(`callId`): `void`

Terminate an active call.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callId` | `string` | The ID of the call to terminate |

#### Returns

`void`

#### Defined in

public-api.d.ts:128

___

### transferCall

▸ **transferCall**(`callId`, `target`): `void`

Transfer a call to another number.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callId` | `string` | The ID of the call to transfer |
| `target` | `string` | The phone number or SIP address to transfer to |

#### Returns

`void`

#### Defined in

public-api.d.ts:143

___

### unholdCall

▸ **unholdCall**(`callId`): `void`

Resume a call that is on hold.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callId` | `string` | The ID of the call to unhold |

#### Returns

`void`

#### Defined in

public-api.d.ts:138

