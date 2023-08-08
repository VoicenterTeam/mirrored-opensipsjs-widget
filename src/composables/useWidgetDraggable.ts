import { tryOnBeforeUnmount } from '@vueuse/core'

let dragHandleElement: HTMLElement | null = null
let dragTargetElement: HTMLElement | null = null

let startX: number = 0
let startY: number = 0

function dragStart (e: MouseEvent) {
    if (!dragTargetElement) {
        return
    }

    e.preventDefault()

    startX = dragTargetElement.offsetLeft - e.clientX
    startY = dragTargetElement.offsetTop - e.clientY

    document.addEventListener('mousemove', drag)
    document.addEventListener('mouseup', dragEnd)
}

function drag (e: MouseEvent) {
    if (!dragTargetElement) {
        return
    }

    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const widgetWidth = dragTargetElement.offsetWidth
    const widgetHeight = dragTargetElement.offsetHeight

    let x = e.clientX + startX
    let y = e.clientY + startY

    // Don't allow the widget to move beyond the right edge of the window
    if (x + widgetWidth > windowWidth) {
        x = windowWidth - widgetWidth
    }

    // Don't allow the widget to move beyond the left edge of the window
    if (x < 0) {
        x = 0
    }

    // Don't allow the widget to move below the bottom edge of the window
    if (y + widgetHeight > windowHeight) {
        y = windowHeight - widgetHeight
    }

    // Don't allow the widget to move above the top edge of the window
    if (y < 0) {
        y = 0
    }

    dragTargetElement.style.left = x + 'px'
    dragTargetElement.style.top = y + 'px'
}

function updatePositionOnResize () {
    if (!dragTargetElement) {
        return
    }

    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const widgetWidth = dragTargetElement.offsetWidth
    const widgetHeight = dragTargetElement.offsetHeight

    let x = parseInt(dragTargetElement.style.left, 10)
    let y = parseInt(dragTargetElement.style.top, 10)

    // If the widget is beyond the right edge of the window, move it back
    if (x + widgetWidth > windowWidth) {
        x = windowWidth - widgetWidth
    }

    // If the widget is beyond the left edge of the window, move it back
    if (x < 0) {
        x = 0
    }

    // If the widget is below the bottom edge of the window, move it back
    if (y + widgetHeight > windowHeight) {
        y = windowHeight - widgetHeight
    }

    // If the widget is above the top edge of the window, move it back
    if (y < 0) {
        y = 0
    }

    dragTargetElement.style.left = x + 'px'
    dragTargetElement.style.top = y + 'px'
}


function dragEnd () {
    document.removeEventListener('mousemove', drag)
    document.removeEventListener('mouseup', dragEnd)
}

function setListeners () {
    window.addEventListener('resize', updatePositionOnResize)

    if (dragHandleElement) {
        dragHandleElement.addEventListener('mousedown', dragStart)
    }
}

export function removeListeners () {
    window.removeEventListener('resize', updatePositionOnResize)

    if (dragHandleElement) {
        dragHandleElement.removeEventListener('mousedown', dragStart)
    }
}

function enableDraggable (handle: HTMLElement, target: HTMLElement) {
    dragHandleElement = handle
    dragTargetElement = target

    dragTargetElement.style.position = 'fixed'

    setListeners()

    tryOnBeforeUnmount(removeListeners)
}

function disableDraggable () {
    if (dragTargetElement) {
        dragTargetElement.style.position = 'absolute'
    }

    dragHandleElement = null
    dragTargetElement = null

    removeListeners()
}

export function useWidgetDraggable () {
    return {
        enableDraggable,
        disableDraggable,
    }
}
