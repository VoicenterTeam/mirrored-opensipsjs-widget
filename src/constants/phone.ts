export const MAX_NUMBER_INPUT_LENGTH = 18
export const KeyPadTriggerObjectType = {
    keypad: 'keypad' ,
    add_caller: 'add_caller' ,
    new_call: 'new_call'
} as const

export const keyPadTriggerTitlesConfig = {
    [KeyPadTriggerObjectType.keypad]: 'Keypad',
    [KeyPadTriggerObjectType.add_caller]: 'Add caller',
    [KeyPadTriggerObjectType.new_call]: 'New call'
}

export const ActionsTriggerObjectType = {
    separate: 'separate' ,
    single: 'single' ,
    multiple: 'multiple'
} as const

export type keyPadTriggerType = keyof typeof KeyPadTriggerObjectType