let dragListener: (e: MouseEvent) => void
let dragEndListener: () => void

export function dragStart (e: MouseEvent, context: any) {
    context.startX = context.offsetLeft - e.clientX
    context.startY = context.offsetTop - e.clientY

    dragListener = (e) => drag(e, context)
    dragEndListener = () => dragEnd()

    document.addEventListener('mousemove', dragListener)
    document.addEventListener('mouseup', dragEndListener)
}

export function drag (e: MouseEvent, context: any) {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const widgetWidth = context.offsetWidth
    const widgetHeight = context.offsetHeight

    let x = e.clientX + context.startX
    let y = e.clientY + context.startY

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

    context.style.left = x + 'px'
    context.style.top = y + 'px'
}

export function updatePositionOnResize (context: any) {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const widgetWidth = context.offsetWidth
    const widgetHeight = context.offsetHeight

    let x = parseInt(context.style.left, 10)
    let y = parseInt(context.style.top, 10)

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

    context.style.left = x + 'px'
    context.style.top = y + 'px'
}


export function dragEnd () {
    document.removeEventListener('mousemove', dragListener)
    document.removeEventListener('mouseup', dragEndListener)
}
