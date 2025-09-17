// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { ref, computed, watch, nextTick } from 'vue'
import OpenSIPSJS, {
//ScreenSharePlugin,
//WhiteBoardPlugin,
//StreamMaskPlugin,
//ScreenShareWhiteBoardPlugin
} from 'opensips-js'
// import { ScreenSharePlugin } from 'opensips-js-screen-share'
// import { WhiteBoardPlugin } from 'opensips-js-whiteboard'
// import { ScreenShareWhiteBoardPlugin } from 'opensips-js-screen-share-whiteboard'
import state from '@/composables/state'

/* Video conferencing */
export const conferenceStarted = ref<boolean>(false)
export const streamSources = ref<Array<unknown>>([])
export const mainSource = ref<unknown>(null)
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

/**
 * Helper function to register OpenSIPSJS listeners
 *
 * @param opensipsJS
 */
export function registerVideoListeners (opensipsJS: OpenSIPSJS) {
    return opensipsJS
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

export function getVideoState () {
    return {
        conferenceStarted,
        streamSources,
        mainSource,
        sourcesExceptMain,
        microphoneOnModel,
        videoOnModel,
        isWithBokehMaskEffect,
        isWithBgImgMaskEffect,
        isScreenSharing,
        isScreenShareWhiteboardEnabled,
        isPresentationWhiteboardEnabled,
        isImageWhiteboardEnabled,
        isWhiteboardEnabled
    }
}

export function getVideoApi () {
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
