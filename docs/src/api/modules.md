# opensipsjs-widget

## Table of contents

### Namespaces

- [Widget](modules/Widget.md)

### Interfaces

- [IAutoAnswerSettings](interfaces/IAutoAnswerSettings.md)
- [IBaseLayoutConfig](interfaces/IBaseLayoutConfig.md)
- [ICallSettings](interfaces/ICallSettings.md)
- [ICallerInfoSettings](interfaces/ICallerInfoSettings.md)
- [IDisplayAPI](interfaces/IDisplayAPI.md)
- [IDNDSettings](interfaces/IDNDSettings.md)
- [IDockedLayoutConfig](interfaces/IDockedLayoutConfig.md)
- [IFixedLayoutConfig](interfaces/IFixedLayoutConfig.md)
- [IFloatingLayoutConfig](interfaces/IFloatingLayoutConfig.md)
- [ISIPSCredentials](interfaces/ISIPSCredentials.md)
- [IVSIPActionsAPI](interfaces/IVSIPActionsAPI.md)
- [IWidgetConfig](interfaces/IWidgetConfig.md)
- [IWidgetExternalAPI](interfaces/IWidgetExternalAPI.md)
- [IWidgetExternalAPIConstructor](interfaces/IWidgetExternalAPIConstructor.md)
- [IWidgetTheme](interfaces/IWidgetTheme.md)
- [ImagesConfig](interfaces/ImagesConfig.md)

### Type Aliases

- [ColorsType](modules.md#colorstype)
- [ILayoutConfig](modules.md#ilayoutconfig)
- [TAnchor](modules.md#tanchor)
- [TKeypadMode](modules.md#tkeypadmode)
- [TKeypadPosition](modules.md#tkeypadposition)
- [TLayoutMode](modules.md#tlayoutmode)
- [TLayoutType](modules.md#tlayouttype)
- [TPosition](modules.md#tposition)
- [TPositionConfig](modules.md#tpositionconfig)
- [TWidgetConfigOptions](modules.md#twidgetconfigoptions)

## Type Aliases

### ColorsType

Ƭ **ColorsType**: ``"primary"`` \| ``"secondary"`` \| ``"main-text"`` \| ``"secondary-text"`` \| ``"button-pressed-text"`` \| ``"border-lines"`` \| ``"primary-bg"`` \| ``"secondary-bg"`` \| ``"inactive-bg"`` \| ``"success"`` \| ``"danger"`` \| ``"additional-danger-bg"`` \| ``"additional-success-bg"`` \| ``"additional-bg"``

The colors of the widget:

#### Defined in

public-api.d.ts:34

___

### ILayoutConfig

Ƭ **ILayoutConfig**: [`IFloatingLayoutConfig`](interfaces/IFloatingLayoutConfig.md) \| [`IDockedLayoutConfig`](interfaces/IDockedLayoutConfig.md) \| [`IFixedLayoutConfig`](interfaces/IFixedLayoutConfig.md)

Represents the layout configuration for the widget.

#### Defined in

public-api.d.ts:180

___

### TAnchor

Ƭ **TAnchor**: ``"bottom-center"`` \| ``"top-center"`` \| ``"center"`` \| ``null``

Represents the anchor position for the widget.

#### Defined in

public-api.d.ts:122

___

### TKeypadMode

Ƭ **TKeypadMode**: ``"popover"`` \| ``"static"`` \| ``"manual"``

#### Defined in

public-api.d.ts:140

___

### TKeypadPosition

Ƭ **TKeypadPosition**: ``"top"`` \| ``"bottom"``

#### Defined in

public-api.d.ts:142

___

### TLayoutMode

Ƭ **TLayoutMode**: ``"floating"`` \| ``"docked"`` \| ``"fixed"``

Represents the layout modes for the widget.

#### Defined in

public-api.d.ts:112

___

### TLayoutType

Ƭ **TLayoutType**: ``"rounded"`` \| ``"quickCall"``

Represents the layout types for the widget.

#### Defined in

public-api.d.ts:117

___

### TPosition

Ƭ **TPosition**: keyof `Omit`<[`TPositionConfig`](modules.md#tpositionconfig), ``"anchor"``\>

#### Defined in

public-api.d.ts:138

___

### TPositionConfig

Ƭ **TPositionConfig**: `Object`

Represents the position configuration for the widget. If the position parameter is not specified, the value will be set to 'auto'.
Accepts any valid css value for left, top, right, bottom.
If the anchor parameter is specified, the opposite to anchor value position parameters will be ignored.
For example, if anchor value is 'bottom-center', only bottom parameter will be used.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `anchor?` | [`TAnchor`](modules.md#tanchor) |
| `bottom?` | `string` \| `number` |
| `left?` | `string` \| `number` |
| `right?` | `string` \| `number` |
| `top?` | `string` \| `number` |

#### Defined in

public-api.d.ts:130

___

### TWidgetConfigOptions

Ƭ **TWidgetConfigOptions**: `Partial`<[`IWidgetConfig`](interfaces/IWidgetConfig.md)\>

Represents the configuration options for the widget.

#### Defined in

public-api.d.ts:71
