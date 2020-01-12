import {
    StepMap
} from "prosemirror-transform"
import {
    keymap
} from "prosemirror-keymap"
import {
    undo,
    redo
} from "prosemirror-history"

class FootnoteView {
    constructor(node, view, getPos) {
        // We'll need these later
        this.node = node
        this.outerView = view
        this.getPos = getPos

        this.dom = node.attrs.dom.cloneNode(true);
    }

    selectNode() {
        this.dom.classList.add("ProseMirror-selectednode")
    }

    deselectNode() {
        this.dom.classList.remove("ProseMirror-selectednode")
    }

    open() {
        // Append a tooltip to the outer node
        // let tooltip = this.dom.appendChild(document.createElement("div"))
        // tooltip.className = "custom-html-label"

        // And put a sub-ProseMirror into that
        // this.innerView = new EditorView(tooltip, {
        //     // You can use any node as an editor document
        //     state: EditorState.create({
        //         doc: this.node,
        //         plugins: [keymap({
        //             "Mod-z": () => undo(this.outerView.state, this.outerView.dispatch),
        //             "Mod-y": () => redo(this.outerView.state, this.outerView.dispatch)
        //         })]
        //     }),
        //     // This is the magic part
        //     dispatchTransaction: this.dispatchInner.bind(this),
        //     handleDOMEvents: {
        //         mousedown: () => {
        //             // Kludge to prevent issues due to the fact that the whole
        //             // footnote is node-selected (and thus DOM-selected) when
        //             // the parent editor is focused.
        //             if (this.outerView.hasFocus()) this.innerView.focus()
        //         }
        //     }
        // })
    }

    close() {

    }

    update(node) {

    }
    destroy() {
        if (this.innerView) this.close()
    }

    stopEvent(event) {
        
    }

    ignoreMutation() {
        return true
    }
}
