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
    context.style.left = e.clientX + context.startX + 'px'
    context.style.top = e.clientY + context.startY + 'px'
}

export function dragEnd () {
    document.removeEventListener('mousemove', dragListener)
    document.removeEventListener('mouseup', dragEndListener)
}
