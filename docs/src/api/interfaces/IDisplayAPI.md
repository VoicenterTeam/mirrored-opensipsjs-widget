# Interface: IDisplayAPI

Display customization API interface - provides generic display resolvers for customizing how information is displayed in the widget.

## Table of contents

### Methods

- [clearAll](IDisplayAPI.md#clearall)
- [clearResolver](IDisplayAPI.md#clearresolver)
- [getResolver](IDisplayAPI.md#getresolver)
- [hasResolver](IDisplayAPI.md#hasresolver)
- [setResolver](IDisplayAPI.md#setresolver)
- [setResolvers](IDisplayAPI.md#setresolvers)

## Methods

### clearAll

▸ **clearAll**(): `void`

Clear all resolvers.

#### Returns

`void`

#### Defined in

public-api.d.ts:241

___

### clearResolver

▸ **clearResolver**(`type`): `void`

Clear a specific resolver.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | keyof `IDisplayResolvers` | The resolver type to clear |

#### Returns

`void`

#### Defined in

public-api.d.ts:236

___

### getResolver

▸ **getResolver**<`K`\>(`type`): `IDisplayResolvers`[`K`] \| `null`

Get a specific resolver.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof `IDisplayResolvers` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `K` | The resolver type to get |

#### Returns

`IDisplayResolvers`[`K`] \| `null`

#### Defined in

public-api.d.ts:226

___

### hasResolver

▸ **hasResolver**(`type`): `boolean`

Check if a specific resolver is set.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | keyof `IDisplayResolvers` | The resolver type to check |

#### Returns

`boolean`

#### Defined in

public-api.d.ts:231

___

### setResolver

▸ **setResolver**<`K`\>(`type`, `resolver`): `void`

Set a display resolver for a specific type. Use this to customize how caller information and other data is displayed in the widget.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof `IDisplayResolvers` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `K` | The type of resolver to set (e.g., 'callerInfo') |
| `resolver` | `IDisplayResolvers`[`K`] \| `null` | The resolver function or null to clear |

#### Returns

`void`

#### Defined in

public-api.d.ts:213

___

### setResolvers

▸ **setResolvers**(`resolvers`): `void`

Set multiple resolvers at once.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `resolvers` | `Partial`<`IDisplayResolvers`\> | Object containing multiple resolvers |

#### Returns

`void`

#### Defined in

public-api.d.ts:220

