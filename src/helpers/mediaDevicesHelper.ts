export async function getInputMediaDevicesList () {
    const devices = await navigator.mediaDevices.enumerateDevices()

    return devices
        .filter((device) => {
            return device?.deviceId && device?.kind === 'audioinput'
        })
        .map<MediaDeviceInfo>((obj) => {
            return obj.toJSON()
        })
}

export async function getOutputMediaDevicesList () {
    const devices = await navigator.mediaDevices.enumerateDevices()

    return devices
        .filter((device) => {
            return device.deviceId && device.kind == 'audiooutput'
        })
        .map<MediaDeviceInfo>((obj) => {
            return obj.toJSON()
        })
}
