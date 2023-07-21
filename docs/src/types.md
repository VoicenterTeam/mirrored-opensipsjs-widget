# Types
[[toc]]

## TComponentConfig
```typescript
type TComponentConfig = {
    type: TComponentType
    componentParameterCategories: Array<TParametersCategory>
    name: string
    id: number
    icon: string
    componentId: number
}
```
| Prop                          | Description                                                                                                                                                                                                                          |
|-------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| type                          | The type of the component to render, to check supported components go for [form-renderer documentation](https://form-renderer.pages.dev/types.html#tcomponenttype)                                                                   |
| componentParameterCategories  | As the form-builder library is using the [form-renderer library](https://form-renderer.pages.dev/) you can read more detailed info about his prop on [documentation](https://form-renderer.pages.dev/types.html#tparameterscategory) |
| name                          | The name of the component that will be displayed in the list of components                                                                                                                                                           |
| id                            | The unique ID of the component                                                                                                                                                                                                       |
| icon                          | The icon of the component that will be displayed in the list of components                                                                                                                                                           |
| componentId                   | The id of the component to render                                                                                                                                                                                                    |
