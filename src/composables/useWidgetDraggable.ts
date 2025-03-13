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

function ensureInBounds (x: number, y: number): { x: number, y: number } {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const widgetWidth = dragTargetElement!.offsetWidth
    const widgetHeight = dragTargetElement!.offsetHeight

    // Ensure the widget is within the window's bounds
    x = Math.min(Math.max(x, 0), windowWidth - widgetWidth)
    y = Math.min(Math.max(y, 0), windowHeight - widgetHeight)

    return {
        x,
        y
    }
}

function drag (e: MouseEvent) {
    if (!dragTargetElement) {
        return
    }

    const { x, y } = ensureInBounds(e.clientX + startX, e.clientY + startY)

    dragTargetElement.style.left = x + 'px'
    dragTargetElement.style.top = y + 'px'
}

function updatePositionOnResize () {
    if (!dragTargetElement) {
        return
    }

    const currentX = parseInt(dragTargetElement.style.left, 10)
    const currentY = parseInt(dragTargetElement.style.top, 10)

    const { x, y } = ensureInBounds(currentX, currentY)

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

    setListeners()

    tryOnBeforeUnmount(removeListeners)
}

function disableDraggable () {
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
