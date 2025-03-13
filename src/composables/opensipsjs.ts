import { ref, computed, watch, nextTick } from 'vue'
import OpenSIPSJS, {
//ScreenSharePlugin,
//WhiteBoardPlugin,
//StreamMaskPlugin,
//ScreenShareWhiteBoardPlugin
} from '@voicenter-team/opensips-js'
import { ITimeData } from '@voicenter-team/opensips-js/src/types/timer'
import { ScreenSharePlugin } from '@voicenter-team/opensips-js-screen-share'
import { WhiteBoardPlugin } from '@voicenter-team/opensips-js-whiteboard'
import { ScreenShareWhiteBoardPlugin } from '@voicenter-team/opensips-js-screen-share-whiteboard'
import type { ICall, IOpenSIPSJSOptions, IRoom, RoomChangeEmitType, ICallStatus, IOpenSIPSConfiguration } from '@voicenter-team/opensips-js/src/types/rtc'
import type { ISIPSCredentials } from '@/types/public-api'
import type { AllActiveCallsStatusType, AllActiveCallsType, CallTimeType } from '@/types/opensips'
import type { UnRegisterOptions } from 'jssip/lib/UA'

import { autoAnswerDefaultBehaviour } from '@/composables/useWidgetConfig'

/* Main */
const state: { opensipsjs: OpenSIPSJS | undefined } = {
    opensipsjs: undefined
}

/* State */
export const isOpenSIPSReady = ref<boolean>(false)
export const isOpenSIPSInitialized = ref<boolean>(false)
export const usedWidgetShadowRootEl = ref<HTMLElement>()

/* Device management */
export const activeInputDevice = ref<string>('')
export const inputDevicesList = ref<Array<MediaDeviceInfo>>([])
export const activeOutputDevice = ref<string>('')
export const outputDevicesList = ref<Array<MediaDeviceInfo>>([])
export const ringingDevicesList = ref<Array<MediaDeviceInfo>>([])
export const activeRingingDevice = ref<string>('default')
export const microphoneInputLevel = ref<number>(2)

/* Calls management */
export const allActiveCalls = ref<Array<ICall>>([])
export const allRooms = ref<Array<IRoom>>([])
export const currentActiveRoom = ref<number | undefined>(undefined)
export const allCallStatuses = ref<Array<ICallStatus>>([])

export const activeCalls = computed(() => {
    const calls: {[key: string]: ICall} = {}

    allActiveCalls.value.forEach((call) => {
        calls[call._id] = call
    })

    return calls
})

/* Call settings */
export const isMuted = ref<boolean>(false)
export const isDND = ref<boolean>(false)
export const isMuteWhenJoin = ref<boolean>(false)
export const originalStream = ref<MediaStream | null>(null)

export const speakerVolume = ref<number>(1)
export const callTime = ref<{ [key: string]: ITimeData }>({})
export const callMetrics = ref<{ [key: string]: unknown }>({})

/* Video conferencing */

export const conferenceStarted = ref<boolean>(false)
export const streamSources = ref<Array<unknown>>([])
export const mainSource = ref<Array<unknown>>(null)
export const sourcesExceptMain = computed(() => {
    if (!mainSource.value) {
        return streamSources.value
    }

    if (isPresentationWhiteboardEnabled.value || isImageWhiteboardEnabled.value) {
        return [ ...streamSources.value ]
    }

    return streamSources.value.filter(s => s.id !== mainSource.value.id)
})
export const microphoneOnModel = ref<boolean>(true)
export const videoOnModel = ref<boolean>(true)

export const isWithBokehMaskEffect = ref<boolean>(false)
export const isWithBgImgMaskEffect = ref<boolean>(false)

export const isScreenSharing = ref<boolean>(false)
export const isScreenShareWhiteboardEnabled = ref<boolean>(false)
export const isPresentationWhiteboardEnabled = ref<boolean>(false)
export const isImageWhiteboardEnabled = ref<boolean>(false)
export const isWhiteboardEnabled = computed(() => {
    return isScreenShareWhiteboardEnabled.value ||
        isPresentationWhiteboardEnabled.value ||
        isImageWhiteboardEnabled.value
})

watch(streamSources,
    (newSources, oldSources) => {
        const newParticipant = newSources?.find((newSource) => {
            if (!oldSources) {
                return true // If oldSources is undefined, return the first newSource
            }

            return !oldSources.some((oldSource) => oldSource.id === newSource.id)
        })

        //const talkingStream = newSources.find(source => source.state && source.state.isTalking)

        if (!newSources) {
            return
        }

        if (
            newSources.length > 0 &&
            newParticipant && newParticipant.name === 'Screen Share' &&
            newParticipant.sender === 'me'
        ) {
            mainSource.value = newParticipant
        } else if (newSources.length > 0 && (!mainSource.value || mainSource.value.type === 'publisher'/* && state.mainSource.name !== 'Screen Share'*/ || newSources.length === 1)) {
            mainSource.value = streamSources.value.find((source) => source.type === 'subscriber')

            if (!mainSource.value) {
                mainSource.value = streamSources.value.find((source) => source.type === 'publisher' /*&& source.name !== 'Screen Share'*/)
            }
        } /*else if (talkingStream) {
                state.mainSource = talkingStream
            }*/ else if (newSources.length === 0 && mainSource.value) {
            //DeviceManager.stopStreamTracks(state.mainSource.stream)
            mainSource.value = undefined
        }
    },
    {
        //immediate: true,
        deep: true
    }
)

watch(speakerVolume, (newValue) => {
    state.opensipsjs?.audio.setSpeakerVolume(newValue)
})

watch(isMuteWhenJoin, (newValue) => {
    state.opensipsjs?.audio.setMuteWhenJoin(newValue)
})

watch(isDND, (newValue) => {
    state.opensipsjs?.audio.setDND(newValue)
})

watch(microphoneInputLevel, (newValue) => {
    state.opensipsjs?.audio.setMicrophoneSensitivity(newValue)
})

/**
 * Helper function to check if OpenSIPSJS is initialized (instance is created)
 *
 * @param opensipsJS
 */
function isOpensips (opensipsJS: OpenSIPSJS | undefined): opensipsJS is OpenSIPSJS {
    return opensipsJS !== undefined
}

function makeOpenSIPSJSOptions (credentials: ISIPSCredentials): IOpenSIPSJSOptions {
    const configuration: IOpenSIPSConfiguration = {
        session_timers: false,
        uri: `sip:${credentials.username}@${credentials.domain}`
    }

    if (credentials.password) {
        configuration.password = credentials.password
    }

    if (credentials.authorization_jwt) {
        configuration.authorization_jwt = credentials.authorization_jwt
    }

    return {
        configuration,
        socketInterfaces: [ `wss://${credentials.domain}` ],
        sipDomain: `${credentials.domain}`,
        sipOptions: {
            session_timers: false,
            extraHeaders: [ 'X-Bar: bar' ],
            pcConfig: {},
        },
        modules: [ 'audio', 'video' ]
    }
}

interface CallTimeIntervalsType {
    [key: string]: any
}

export const callTimes = ref<CallTimeType>({})
const callTimeIntervals = ref<CallTimeIntervalsType>({})

function updateCallTime (callId: string) {
    const prevTime = callTimes.value[callId] || 0
    callTimes.value = {
        ...callTimes.value,
        [callId]: prevTime + 1
    }
}

function removeCallTime (callId: string) {
    delete callTimes.value[callId]
}

function setCallInterval (callId: string, interval: any) {
    callTimeIntervals.value = {
        ...callTimeIntervals.value,
        [callId]: interval
    }
}
function removeOldCallTimes (calls: Array<ICall>) {
    const ids = calls.map(call => call._id)

    ids.forEach(id => {
        clearInterval(id)
        removeCallTime(id)
    })
}

function validateCredentials (credentials: ISIPSCredentials) {
    if (!credentials.username || (!credentials.password && !credentials.authorization_jwt) || !credentials.domain) {
        throw new Error('Invalid credentials')
    }
}

function processCallsTime (calls: AllActiveCallsType) {
    const removedCalls = allActiveCalls.value.filter(oldCall => {
        return !Object.values(calls).some(newCall => {
            return newCall._id === oldCall._id
        })
    })

    removeOldCallTimes(removedCalls)

    const newCalls = Object.values(calls).filter(call => {
        return !allActiveCalls.value.some(existingCall => {
            return existingCall._id === call._id
        })
    })

    if (!newCalls.length) {
        return
    }

    newCalls.forEach(call => {
        const interval = setInterval(() => updateCallTime(call._id), 1000)
        setCallInterval(call._id, interval)
    })
}

/**
 * Helper function to register OpenSIPSJS listeners
 *
 * @param opensipsJS
 */
function registerOpenSIPSListeners (opensipsJS: OpenSIPSJS) {
    return opensipsJS
        .on('connection', (value: boolean) => {
            isOpenSIPSReady.value = value
        })
        .on('changeActiveInputMediaDevice', (value: string) => {
            activeInputDevice.value = value
        })
        .on('changeActiveOutputMediaDevice', (value: string) => {
            activeOutputDevice.value = value
        })
        .on('changeIsMuted', (value: boolean) => {
            isMuted.value = value
        })
        .on('changeIsDND', (value) => {
            isDND.value = value
        })
        .on('changeMuteWhenJoin', (value: boolean) => {
            isMuteWhenJoin.value = value
        })
        .on('changeActiveStream', (value) => {
            originalStream.value = value
        })
        .on('changeAvailableDeviceList', (devices: Array<MediaDeviceInfo>) => {
            const inputDevices = devices.filter(d => d.kind === 'audioinput')
            const outputDevices = devices.filter(d => d.kind === 'audiooutput')

            inputDevicesList.value = [ ...inputDevices ] /*inputDevices.map((d) => ({
                label: d.label,
                deviceId: d.deviceId,
                kind: d.deviceId,
                groupId: d.deviceId,
            }))*/

            outputDevicesList.value = [ ...outputDevices ] /*outputDevices.map((d) => ({
                label: d.label,
                deviceId: d.deviceId,
                kind: d.deviceId,
                groupId: d.deviceId,
            }))*/

            ringingDevicesList.value = [ ...outputDevices ]
        })
        .on('changeActiveCalls', (calls: AllActiveCallsType) => {
            processCallsTime(calls)
            const parsedCalls = Object.values(calls)
            allActiveCalls.value = [ ...parsedCalls ]
        })
        .on('addRoom', (data: RoomChangeEmitType) => {
            const rooms = Object.values(data.roomList)
            allRooms.value = [ ...rooms ]
        })
        .on('updateRoom', (data: RoomChangeEmitType) => {
            const rooms = Object.values(data.roomList)
            allRooms.value = [ ...rooms ]
        })
        .on('removeRoom', (data: RoomChangeEmitType) => {
            const rooms = Object.values(data.roomList)
            allRooms.value = [ ...rooms ]
        })
        .on('currentActiveRoomChanged', (roomId: number | undefined) => {
            currentActiveRoom.value = roomId
        })
        .on('changeCallStatus', (data: AllActiveCallsStatusType) => {
            const statuses = Object.values(data)
            allCallStatuses.value = [ ...statuses ]
        })
        .on('changeCallTime', (data) => {
            callTime.value = { ...data }
        })
        .on('changeCallMetrics', (data) => {
            callMetrics.value = { ...data }
        })
        .on('conferenceStart', () => {
            conferenceStarted.value = true
        })
        .on('conferenceEnd', () => {
            conferenceStarted.value = false
            mainSource.value = null
            streamSources.value = []
        })
        .on('changeMainVideoStream', (data) => {
            data.id = Date.now()
            data.type = 'publisher'

            if (!streamSources.value.length) {
                mainSource.value = data
            }

            const filteredSources = streamSources.value.filter((source) => {
                return source.name !== data.name || source.type !== data.type
            })

            streamSources.value = [ ...filteredSources, data ]
        })
        .on('memberJoin', (data) => {
            streamSources.value = [ ...streamSources.value, data ]
        })
        .on('memberHangup', (data) => {
            const index = streamSources.value.findIndex(s => s.sender === data.sender)

            if (index !== -1) {
                streamSources.value.splice(index, 1)
                streamSources.value = [ ...streamSources.value ]
            }
        })
        .on('startScreenShare', (data) => {
            data.id = Date.now()
            data.name = 'Screen Share'

            if (!streamSources.value.length) {
                mainSource.value = data
            }

            streamSources.value = [ ...streamSources.value, data ]
        })
        .on('stopScreenShare', () => {
            isScreenSharing.value = false
            streamSources.value = streamSources.value.filter((s) => !(s.name === 'Screen Share' && s.sender === 'me'))

            if (isScreenShareWhiteboardEnabled.value) {
                isScreenShareWhiteboardEnabled.value = false
            }
        })
}

/**
 * Register OpenSIPSJS instance, set listeners and start it
 *
 * @param credentials
 */
export function startOpenSIPS (credentials: ISIPSCredentials) {
    return new Promise<OpenSIPSJS>((resolve, reject) => {
        try {
            validateCredentials(credentials)

            const opensipsOptions = makeOpenSIPSJSOptions(credentials)

            const opensipsjs = new OpenSIPSJS(opensipsOptions)

            const screenSharePlugin = new ScreenSharePlugin()

            const rootDocument = document.querySelector('opensips-widget')
            const shadowRootDocument = rootDocument.shadowRoot

            const screenShareWhiteBoardPlugin = new ScreenShareWhiteBoardPlugin(screenSharePlugin, {
                selectors: {
                    document: shadowRootDocument
                }
            })

            //console.log('this', this)

            /*Object.defineProperty(window, 'document', {
                value: shadowRootDocument,
                writable: true,
                configurable: true,
            })*/

            /*const originalGetElementById = Document.prototype.getElementById
            Document.prototype.getElementById = function (id) {
                // Attempt to get from Shadow Root first
                const fromShadow = shadowRootDocument.getElementById(id)
                if (fromShadow) return fromShadow

                // Fallback to the real document
                return originalGetElementById.call(this, id)
            }

            const originalGetElementsByClassName = Document.prototype.getElementsByClassName
            Document.prototype.getElementsByClassName = function (className) {
                // Try the shadow root first
                const shadowResults = shadowRootDocument.getElementsByClassName(className)
                if (shadowResults.length > 0) {
                    return shadowResults
                }
                // Fallback to real document
                return originalGetElementsByClassName.call(this, className)
            }*/

            /*const originalCreateElement = Document.prototype.createElement
            Document.prototype.createElement = function (tagName, options) {
                // If you want newly created elements to belong to the same ownerDocument
                // as the shadow root, do something like this:
                const doc = shadowRootDocument.ownerDocument
                return doc.createElement(tagName, options)
            }

            const originalAddEventListener = Document.prototype.addEventListener
            Document.prototype.addEventListener = function (type, listener, options) {
                // Divert all event listeners to the shadow root’s event target
                return shadowRootDocument.addEventListener(type, listener, options)
            }*/

            //const konvaDrawerContainer = shadowRootDocument.getElementById('presentationCanvasWrapper')
            //console.log('konvaDrawerContainer', konvaDrawerContainer)

            const whiteBoardPlugin = new WhiteBoardPlugin({
                mode: 'whiteboard',
                selectors: {
                    container: 'presentation-video-container',
                    drawerContainer: 'presentationCanvasWrapper',
                    //konvaContainer: konvaDrawerContainer,
                    document: shadowRootDocument
                }
            })

            /*const streamMaskPlugin = new StreamMaskPlugin({
                //effect: 'backgroundImageEffect',
                effect: 'bokehEffect',
                //base64Image: base64Image
            }, {
                immediate: false
            })*/

            opensipsjs.use(screenSharePlugin)
            //opensipsjs.use(streamMaskPlugin)
            opensipsjs.use(whiteBoardPlugin)
            opensipsjs.use(screenShareWhiteBoardPlugin)

            state.opensipsjs = opensipsjs

            registerOpenSIPSListeners(state.opensipsjs)
                .on('connection', () => {
                    if (autoAnswerDefaultBehaviour.value) {
                        state.opensipsjs?.audio.setAutoAnswer(true)
                    }

                    resolve(opensipsjs)
                })
                .begin()

            isOpenSIPSInitialized.value = true
        } catch (e) {
            reject(e)
        }
    })
}

export function tryRegisterOpenSIPS () {
    if (isOpensips(state.opensipsjs)) {
        state.opensipsjs?.register()

        return state.opensipsjs
    }
}

// TODO: check if this properly restarts receiving events
export function beginOpenSIPS () {
    if (isOpensips(state.opensipsjs)) {
        state.opensipsjs?.begin()
    }
}

// TODO: check if this properly stops receiving events and frees resources
export function stopOpenSIPS () {
    if (isOpensips(state.opensipsjs)) {
        state.opensipsjs?.stop()
    }
}

export function disconnectOpenSIPS () {
    if (isOpensips(state.opensipsjs)) {
        state.opensipsjs?.disconnect()
    }
}

export function unregisterOpenSIPS (options?: UnRegisterOptions | undefined) {
    if (isOpensips(state.opensipsjs)) {
        state.opensipsjs?.unregister(options)
    }
}

export function useOpenSIPSJS () {
    function startCall (target: string, addToCurrentRoom = false) {
        state.opensipsjs?.audio.initCall(target, addToCurrentRoom)
    }

    function answerCall (callId: string) {
        state.opensipsjs?.audio.answerCall(callId)
    }

    function muteAgent (toMute: boolean) {
        if (toMute) {
            state.opensipsjs?.audio.mute()
        } else {
            state.opensipsjs?.audio.unmute()
        }
    }

    function muteCaller (callId: string, toMute: boolean) {
        if (toMute) {
            state.opensipsjs?.audio.muteCaller(callId)
        } else {
            state.opensipsjs?.audio.unmuteCaller(callId)
        }
    }

    function holdCall (callId: string) {
        state.opensipsjs?.audio.holdCall(callId)
    }

    function unholdCall (callId: string) {
        state.opensipsjs?.audio.unholdCall(callId)
    }

    async function moveCall (callId: string, roomId: number) {
        await state.opensipsjs?.audio.moveCall(callId, roomId)
    }

    function transferCall (callId: string, target: string) {
        state.opensipsjs?.audio.transferCall(callId, target)
    }

    function mergeCallsInRoom (roomId: number) {
        state.opensipsjs?.audio.mergeCall(roomId)
    }

    function terminateCall (callId: string) {
        state.opensipsjs?.audio.terminateCall(callId)
    }

    async function setActiveRoom (roomId: number | undefined) {
        await state.opensipsjs?.audio.setActiveRoom(roomId)
    }

    function setAutoAnswer (value: boolean) {
        state.opensipsjs?.audio.setAutoAnswer(value)
    }

    function sendDTMF (callId: string, value: string) {
        state.opensipsjs?.audio.sendDTMF(callId, value)
    }

    function setDND (value: boolean) {
        state.opensipsjs?.audio.setDND(value)
    }

    function setMuteWhenJoin (value: boolean) {
        isMuteWhenJoin.value = value
    }

    function setSpeakerVolume (value: number) {
        speakerVolume.value = value
    }

    function setMicrophoneSensitivity (value: number) {
        microphoneInputLevel.value = value
        state.opensipsjs?.audio.setMicrophoneSensitivity(value)
    }

    function initVideoCall (target: string, name: string) {
        state.opensipsjs?.video.initCall(target, name)
    }

    function hangupVideoCall () {
        state.opensipsjs?.video.stop()
    }

    function enableAudio () {
        if (microphoneOnModel.value) {
            return
        }

        microphoneOnModel.value = true
        state.opensipsjs?.video.startAudio()
    }

    function disableAudio () {
        if (!microphoneOnModel.value) {
            return
        }

        microphoneOnModel.value = false
        state.opensipsjs?.video.stopAudio()
    }

    function enableVideo () {
        if (videoOnModel.value) {
            return
        }

        videoOnModel.value = true
        state.opensipsjs?.video.startVideo()
    }

    function disableVideo () {
        if (!videoOnModel.value) {
            return
        }

        videoOnModel.value = false
        state.opensipsjs?.video.stopVideo()
    }

    function selectMainSource (source) {
        if (!source || !source.id) {
            return
        }

        const sourceId = source.id
        mainSource.value = streamSources.value.find((source) => source.id === sourceId)
    }

    function changeMediaConstraints (constraints) {
        state.opensipsjs?.video.changeMediaConstraints(constraints)
    }

    async function enableScreenShare (value: boolean) {
        if (value === isScreenSharing.value) {
            return
        }

        isScreenSharing.value = value

        if (value) {
            state.opensipsjs?.getPlugin('ScreenShare').connect({})
        } else {
            if (isScreenShareWhiteboardEnabled.value) {
                //await enableScreenShareWhiteboard(false)
                await terminateScreenShareWhiteboard()
            }
            state.opensipsjs?.getPlugin('ScreenShare').kill()
        }
    }

    function enablePresentationWhiteboard () {
        isPresentationWhiteboardEnabled.value = true

        nextTick()
            .then(() => {
                const plugin = state.opensipsjs?.getPlugin('WhiteBoard')

                if (!plugin) {
                    throw new Error('No WhiteBoard plugin available')
                }

                plugin.setMode('whiteboard')
                plugin.connect()

                //state.opensipsjs?.getPlugin('WhiteBoard').connect()
                //.then(resolve)
            })
        /*return new Promise((resolve) => {
            nextTick()
                .then(() => {
                    state.opensipsjs?.getPlugin('WhiteBoard').connect()
                    //.then(resolve)
                })
        })*/
        /*setTimeout(() => {
            state.opensipsjs?.getPlugin('WhiteBoard').connect()
        }, 10000)*/
    }

    function terminatePresentationWhiteboard () {
        isPresentationWhiteboardEnabled.value = false

        nextTick()
            .then(() => {
                state.opensipsjs?.getPlugin('WhiteBoard').kill()
            })
    }

    function enableImageWhiteboard (imageSrc: string) {
        isImageWhiteboardEnabled.value = true

        return new Promise((resolve) => {
            nextTick()
                .then(() => {
                    const plugin = state.opensipsjs?.getPlugin('WhiteBoard')

                    if (!plugin) {
                        throw new Error('No WhiteBoard plugin available')
                    }

                    plugin.setMode('imageWhiteboard', imageSrc)
                    plugin.connect()

                    resolve()
                    /*janusPhoneKit.enableWhiteboard(CONFERENCING_MODE.IMAGE_WHITEBOARD, enable, imageSrc)
                        .then(resolve)*/
                })
        })
    }

    function terminateImageWhiteboard () {
        isImageWhiteboardEnabled.value = false

        nextTick()
            .then(() => {
                state.opensipsjs?.getPlugin('WhiteBoard').kill()
            })
    }

    /*function enablePresentationWhiteboard () {
        isPresentationWhiteboardEnabled.value = true

        nextTick()
            .then(() => {
                state.opensipsjs?.getPlugin('WhiteBoard').connect()
                //.then(resolve)
            })
    }*/

    async function applyBokehMaskEffect () {
        if (!videoOnModel.value) {
            return
        }

        try {
            const newVal = !isWithBokehMaskEffect.value
            state.opensipsjs?.getPlugin('StreamMask').connect()
            //const stream = await janusPhoneKit.enableBokehEffectMask()

            isWithBokehMaskEffect.value = newVal

            //updatePublisherStream(stream)
            //processOrientationChange()
        } catch (e) {
            console.error('Error when enabling bokeh mask effect:', e)
        }
    }

    function applyBackgroundImgMaskEffect () {

    }

    function enableScreenShareWhiteboard () {
        if (isScreenShareWhiteboardEnabled.value) {
            return
        }

        isScreenShareWhiteboardEnabled.value = true

        return new Promise((resolve) => {
            nextTick()
                .then(() => {
                    state.opensipsjs?.getPlugin('ScreenShareWhiteboard')
                        .connect()
                        .then(resolve)
                })
        })
    }

    function terminateScreenShareWhiteboard () {
        if (!isScreenShareWhiteboardEnabled.value) {
            return
        }

        isScreenShareWhiteboardEnabled.value = false

        return new Promise((resolve) => {
            nextTick()
                .then(() => {
                    state.opensipsjs?.getPlugin('ScreenShareWhiteboard')
                        .kill()
                        .then(resolve)
                })
        })
    }

    function setupDrawerOptions (option) {
        state.opensipsjs?.getPlugin('WhiteBoard')?.setupDrawerOptions(option)
    }

    function setupScreenShareDrawerOptions (option) {
        state.opensipsjs?.getPlugin('ScreenShareWhiteboard').setupScreenShareDrawerOptions(option)
    }

    function setupMaskVisualizationConfig () {

    }

    return {
        state,
        startCall,
        answerCall,
        muteAgent,
        muteCaller,
        holdCall,
        unholdCall,
        moveCall,
        transferCall,
        mergeCallsInRoom,
        setActiveRoom,
        terminateCall,
        setAutoAnswer,
        sendDTMF,
        setDND,
        setMuteWhenJoin,
        setSpeakerVolume,
        setMicrophoneSensitivity,
        initVideoCall,
        hangupVideoCall,
        enableAudio,
        disableAudio,
        enableVideo,
        disableVideo,
        changeMediaConstraints,
        selectMainSource,
        enableScreenShare,
        enablePresentationWhiteboard,
        terminatePresentationWhiteboard,
        enableImageWhiteboard,
        terminateImageWhiteboard,
        applyBokehMaskEffect,
        applyBackgroundImgMaskEffect,
        enableScreenShareWhiteboard,
        terminateScreenShareWhiteboard,
        setupDrawerOptions,
        setupScreenShareDrawerOptions,
        setupMaskVisualizationConfig
    }
}

export async function onMicrophoneChange (event: Event) {
    const target = event.target as HTMLSelectElement
    await state.opensipsjs?.audio.setMicrophone(target.value)
}

export async function onSpeakerChange (event: Event) {
    const target = event.target as HTMLSelectElement
    await state.opensipsjs?.audio.setSpeaker(target.value)
}
