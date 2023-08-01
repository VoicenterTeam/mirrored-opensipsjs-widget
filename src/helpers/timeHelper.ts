function secondsToTimeObject (totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return {
        hours: hours,
        minutes: minutes,
        seconds: seconds,
    }
}

function formatTime (time: number) {
    return time < 10 ? `0${time}` : `${time}`
}

export function getFormattedTimeFromSeconds (totalSeconds: number) {
    const { hours, minutes, seconds } = secondsToTimeObject(totalSeconds)
    const formattedHours = hours ? formatTime(hours) : '00'
    const formattedMinutes = minutes ? formatTime(minutes) : '00'
    const formattedSeconds = seconds ? formatTime(seconds) : '00'
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}