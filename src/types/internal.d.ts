import type { OpenSIPSWidgetElement } from '@/types/opensips-widget'

/**
 * Represents the layout modes for the widget.
 */
export type TLayoutMode = 'floating' | 'docked'

/**
 * Represents the layout types for the widget.
 */
export type TLayoutType = 'small' | 'rounded' | 'squared'

/**
 * Represents the base layout configuration for the widget.
 */
export interface IBaseLayoutConfig {
    mode: TLayoutMode
    type: TLayoutType
}

/**
 * Represents the floating layout configuration for the widget.
 */
export interface IFloatingLayoutConfig extends IBaseLayoutConfig {
    mode: 'floating'
}

/**
 * Represents the docked layout configuration for the widget.
 */
export interface IDockedLayoutConfig extends IBaseLayoutConfig {
    mode: 'docked',
    size: { width: string, height: string }
}

/**
 * Represents the layout configuration for the widget.
 */
export type ILayoutConfig = IFloatingLayoutConfig | IDockedLayoutConfig

/**
 * Represents the call settings for the widget.
 */
export interface ICallSettings {
    allowTransfer: boolean
    autoAnswer: IAutoAnswerSettings
    outgoingCalls: boolean
    callerInfo: ICallerInfoSettings
    shrinkOnIdle: boolean
    ringingSound: string
}

/**
 * Represents the auto answer settings for the widget.
 */
export interface IAutoAnswerSettings {
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

/**
 * Represents the props for the WidgetApp component.
 */
export interface IWidgetAppProps {
    widgetElement: OpenSIPSWidgetElement
}
