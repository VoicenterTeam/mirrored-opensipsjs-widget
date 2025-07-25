import type { ListenerCallbackFnType, ListenersKeyType } from 'opensips-js/src/types/listeners'

export namespace Widget {
    /**
     * Represents the event map for the widget.
     */
    export type EventMap = {
        'widget:ready': IWidgetExternalAPIConstructor
        'widget:destroy': undefined
    }

    /**
     * Represents the dispatch action event for the widget.
     */
    export type DispatchActionEvent = <Event extends keyof EventMap>(
        event: Event,
        data: EventMap[Event]
    ) => void
}

/**
 * Represents SIP credentials.
 */
export interface ISIPSCredentials {
    username: string
    password?: string
    authorization_jwt?: string
    domain: string
}

/**
 * The colors of the widget:
 */
export type ColorsType =
    'primary'
    | 'secondary'
    | 'main-text'
    | 'secondary-text'
    | 'button-pressed-text'
    | 'border-lines'
    | 'primary-bg'
    | 'secondary-bg'
    | 'inactive-bg'
    | 'success'
    | 'danger'
    | 'additional-danger-bg'
    | 'additional-success-bg'

export interface ImagesConfig {
    backgroundLogo?: string
}

export interface IWidgetAudioConfig {
    images: ImagesConfig
    layoutConfig: ILayoutConfig
}

export interface IWidgetVideoConfig {
    test?: string
}

/**
 * The language of the widget:
 */
export type LangType = 'en' | 'he'

/**
 * Represents the configuration options for the widget theme.
 */
export interface IWidgetTheme {
    colors: Record<ColorsType, string>
    widgetType: TWidgetType
    lang: LangType
    audioConfig?: IWidgetAudioConfig
    videoConfig?: IWidgetVideoConfig
}

export interface IWidgetConfig {
    themeSettings: IWidgetTheme
    callSettings: ICallSettings
}

/**
 * Represents the configuration options for the widget.
 */
export type TWidgetConfigOptions = Partial<IWidgetConfig>

/**
 * Represents the external API provided by the widget.
 */
export interface IWidgetExternalAPI {
    /**
     * Allows subscribing to sips events.
     *
     * @param type - type of event, check ListenersKeyType
     * @param listener - the event listener, check ListenerCallbackFnType of provided event
     */
    on: <T extends ListenersKeyType> (type: T, listener: ListenerCallbackFnType<T>) => IWidgetExternalAPI

    /**
     * Changes the widget configuration.
     *
     * @param config
     */
    setConfig: (config: TWidgetConfigOptions) => IWidgetExternalAPI

    /**
     * Returns current widget configuration.
     */
    getConfig: () => IWidgetConfig

    /**
     * Logs in to the SIP server.
     *
     * @param credentials
     */
    login: (credentials: ISIPSCredentials) => Promise<IWidgetExternalAPI>

    /**
     * Disconnects the SIP.
     */
    disconnect: () => IWidgetExternalAPI
}

export interface IWidgetExternalAPIConstructor {
    new (config: TWidgetConfigOptions): IWidgetExternalAPI
}

/**
 * Represents the widget types.
 */
export type TWidgetType = 'audio' | 'video'

/**
 * Represents the layout modes for the widget.
 */
export type TLayoutMode = 'floating' | 'docked' | 'fixed'

/**
 * Represents the layout types for the widget.
 */
export type TLayoutType = 'rounded' | 'quickCall' | 'phoneView'

/**
 * Represents the anchor position for the widget.
 */
export type TAnchor = 'bottom-center' | 'top-center' | 'center' | null

/**
 * Represents the position configuration for the widget. If the position parameter is not specified, the value will be set to 'auto'.
 * Accepts any valid css value for left, top, right, bottom.
 * If the anchor parameter is specified, the opposite to anchor value position parameters will be ignored.
 * For example, if anchor value is 'bottom-center', only bottom parameter will be used.
 */
export type TPositionConfig = {
    left?: string | number
    top?: string | number
    right?: string | number
    bottom?: string | number
    anchor?: TAnchor
}

export type TPosition = keyof Omit<TPositionConfig, 'anchor'>

export type TKeypadMode = 'popover' | 'static' | 'manual'

export type TKeypadPosition = 'top' | 'bottom'

/**
 * Represents the base layout configuration for the widget.
 */
export interface IBaseLayoutConfig {
    mode: TLayoutMode
    type: TLayoutType
    position: TPositionConfig
    keypadMode: TKeypadMode,
    keypadPosition: TKeypadPosition
}

/**
 * Represents the floating layout configuration for the widget.
 * In this mode, the position right and bottom are ignored.
 */
export interface IFloatingLayoutConfig extends IBaseLayoutConfig {
    mode: 'floating'
}

/**
 * Represents the docked layout configuration for the widget.
 */
export interface IDockedLayoutConfig extends IBaseLayoutConfig {
    mode: 'docked'
}

/**
 * Represents the fixed layout configuration for the widget.
 */
export interface IFixedLayoutConfig extends IBaseLayoutConfig {
    mode: 'fixed'
}

/**
 * Represents the layout configuration for the widget.
 */
export type ILayoutConfig = IFloatingLayoutConfig | IDockedLayoutConfig | IFixedLayoutConfig

/**
 * Represents the call settings for the widget.
 */
export interface ICallSettings {
    quickCallNumber: string
    allowTransfer: boolean
    showKeypad: boolean
    autoAnswer: IAutoAnswerSettings
    DND: IDNDSettings
    outgoingCalls: boolean
    mergeCalls: boolean
    callWaiting: boolean
    callerInfo: ICallerInfoSettings
    shrinkOnIdle: boolean
    ringingSound: string
    outgoingCallPlaceHolder: string
    outgoingInputRegexValidator: Array<string>
}

/**
 * Represents the auto answer settings for the widget.
 */
export interface IAutoAnswerSettings {
    allowChange: boolean
    defaultBehavior: boolean
}
export interface IDNDSettings {
    allowChange: boolean
    defaultBehavior: boolean
}
/**
 * Represents the caller information settings for the widget.
 */
export interface ICallerInfoSettings {
    displayName: boolean
    callerId: {
        display: boolean
        mask: boolean
    }
}

export interface OpenSIPSWidgetElementEventMap extends HTMLElementEventMap {
    'widget:ready': CustomEvent<IWidgetExternalAPIConstructor>
    'widget:destroy': CustomEvent<undefined>
}
