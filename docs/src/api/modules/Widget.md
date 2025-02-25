# Namespace: Widget

## Table of contents

### Type Aliases

- [DispatchActionEvent](Widget.md#dispatchactionevent)
- [EventMap](Widget.md#eventmap)

## Type Aliases

### DispatchActionEvent

Ƭ **DispatchActionEvent**: <Event\>(`event`: `Event`, `data`: [`EventMap`](Widget.md#eventmap)[`Event`]) => `void`

#### Type declaration

▸ <`Event`\>(`event`, `data`): `void`

Represents the dispatch action event for the widget.

##### Type parameters

| Name | Type |
| :------ | :------ |
| `Event` | extends keyof [`EventMap`](Widget.md#eventmap) |

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `Event` |
| `data` | [`EventMap`](Widget.md#eventmap)[`Event`] |

##### Returns

`void`

#### Defined in

public-api.d.ts:15

___

### EventMap

Ƭ **EventMap**: `Object`

Represents the event map for the widget.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `widget:destroy` | `undefined` |
| `widget:ready` | [`IWidgetExternalAPIConstructor`](../interfaces/IWidgetExternalAPIConstructor.md) |

#### Defined in

public-api.d.ts:7
