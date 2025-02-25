# Interface: IWidgetExternalAPI

Represents the external API provided by the widget.

## Table of contents

### Properties

- [getConfig](IWidgetExternalAPI.md#getconfig)
- [login](IWidgetExternalAPI.md#login)
- [on](IWidgetExternalAPI.md#on)
- [setConfig](IWidgetExternalAPI.md#setconfig)

## Properties

### getConfig

• **getConfig**: () => `Partial`<[`IWidgetConfig`](IWidgetConfig.md)\>

#### Type declaration

▸ (): `Partial`<[`IWidgetConfig`](IWidgetConfig.md)\>

Returns current widget configuration.

##### Returns

`Partial`<[`IWidgetConfig`](IWidgetConfig.md)\>

#### Defined in

public-api.d.ts:95

___

### login

• **login**: (`credentials`: [`ISIPSCredentials`](ISIPSCredentials.md)) => `Promise`<[`IWidgetExternalAPI`](IWidgetExternalAPI.md)\>

#### Type declaration

▸ (`credentials`): `Promise`<[`IWidgetExternalAPI`](IWidgetExternalAPI.md)\>

Logs in to the SIP server.

##### Parameters

| Name | Type |
| :------ | :------ |
| `credentials` | [`ISIPSCredentials`](ISIPSCredentials.md) |

##### Returns

`Promise`<[`IWidgetExternalAPI`](IWidgetExternalAPI.md)\>

#### Defined in

public-api.d.ts:102

___

### on

• **on**: <T\>(`type`: `T`, `listener`: `ListenerCallbackFnType`<`T`\>) => [`IWidgetExternalAPI`](IWidgetExternalAPI.md)

#### Type declaration

▸ <`T`\>(`type`, `listener`): [`IWidgetExternalAPI`](IWidgetExternalAPI.md)

Allows subscribing to sips events.

##### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `ListenersKeyType` |

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `T` | type of event, check ListenersKeyType |
| `listener` | `ListenerCallbackFnType`<`T`\> | the event listener, check ListenerCallbackFnType of provided event |

##### Returns

[`IWidgetExternalAPI`](IWidgetExternalAPI.md)

#### Defined in

public-api.d.ts:83

___

### setConfig

• **setConfig**: (`config`: `Partial`<[`IWidgetConfig`](IWidgetConfig.md)\>) => [`IWidgetExternalAPI`](IWidgetExternalAPI.md)

#### Type declaration

▸ (`config`): [`IWidgetExternalAPI`](IWidgetExternalAPI.md)

Changes the widget configuration.

##### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `Partial`<[`IWidgetConfig`](IWidgetConfig.md)\> |

##### Returns

[`IWidgetExternalAPI`](IWidgetExternalAPI.md)

#### Defined in

public-api.d.ts:90
