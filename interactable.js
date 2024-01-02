class Draggable {
    constructor(element, { dragStartCallback, dragMoveCallback, dragStopCallback
    } = {}) {
        this.element = element;
        this.position = {
            x: 0,
            y: 0,
        }
        this.dragStartCallback = dragStartCallback;
        this.dragMoveCallback = dragMoveCallback;
        this.dragStopCallback = dragStopCallback;

        this.setInteractable();
    }
    setInteractable() {
        this.interactable = interact(this.element)
            .draggable({
                inertia: true,
                modifiers: [
                    interact.modifiers.restrictRect({
                        restriction: document.body,
                        endOnly: true
                    })
                ],
                autoscroll: true,
                listeners: {
                    start: (event) => { this.dragStartListener(event) },
                    move: (event) => { this.dragMoveListener(event) },
                    end: (event) => { this.dragStopListener(event) }
                }

            })
            .pointerEvents({
                holdDuration: 1000,
                ignoreFrom: '[no-pointer]',
                allowFrom: '.handle',
                origin: 'self',
            })
    }
    dragStartListener(event) {
        const { dragStartCallback, element, position, interactable } = this;
        dragStartCallback && dragStartCallback({ element, position, interactable, event });
    }
    dragMoveListener(event) {
        const target = event.target;
        const { element, position, interactable, dragMoveCallback } = this;
        this.position.x += event.dx;
        this.position.y += event.dy;
        const { x, y } = this.position;
        gsap.to(target, { x, y });
        dragMoveCallback && dragMoveCallback({ element, position, interactable, event })
    }
    dragStopListener(event) {
        const { position, element, interactable, dragStopCallback } = this;

        if (position.x * -1 > window.innerWidth / 2) {
            gsap.to(element, { x: (window.innerWidth * -1) + 60 });
            this.position.x = (window.innerWidth * -1) + 60;
        } else {
            gsap.to(element, { x: 0 })
            this.position.x = 0;
        }
        dragStopCallback && dragStopCallback({ element, position, interactable, event });
    }
    dropListener(event) {
        alert(event)
    }

}

class Dropzone {
    constructor(element, { onDropCallback } = {}) {
        this.element = element;
        this.onDropCallback = onDropCallback;
        this.setDropzone();
    }
    setDropzone() {
        const { element, onDropCallback } = this;
        this.dropzone = new interact(element)
            .dropzone({
                overlap: .05,
                onDrop: (event) => {
                    onDropCallback && onDropCallback({ event, element });
                    alert(event.relatedTarget.id + ' was dropped into ' + event.target.id);
                    console.log('dropped');
                }
            })

    }
}