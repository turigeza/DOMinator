import {
    TextSelection,
    NodeSelection
} from "prosemirror-state"

export default class DOMinatorLinkView {

    constructor(node, view, getPos) {

        this.node = node
        this.view = view
        this.getPos = getPos

        this.dom = document.createElement('a');

        if(node.attrs.href){
            this.dom.setAttribute('href');
        }

        this.dom.addEventListener("mousedown", event => {

            // select node if not yet selected //event.metaKey &&
            if(!this.dom.classList.contains("ProseMirror-selectednode")){
                const selection = NodeSelection.create(
                    this.view.state.doc,
                    this.getPos()
                );

                this.view.dispatch(this.view.state.tr.setSelection(selection));
                // event.stopPropagation();
                // event.preventDefault();
            }else{
                // console.log('STOPSTOPSTOPSTOPSTOPSTOP');
                // event.stopPropagation();
                // event.preventDefault();
            }

            console.log('mousedown');
        });
    }

    selectNode() {

    }

    deselectNode() {

    }

    update(node, decorations) {
        console.log('update --- DOMinatorCustomHtmlView');
    }

    stopEvent(event) {

    }

    ignoreMutation() {
        return true;
        // Called when a DOM mutation or a selection change happens within the view. When the change is a selection change,
        // the record will have a type property of "selection" (which doesn't occur for native mutation records).
        // Return false if the editor should re-read the selection or re-parse the range around the mutation, true if it can safely be ignored.
    }

    // Called when the node view is removed from the editor or the whole editor is destroyed.
    destroy() {
        this.dom.remove();
        console.log('destroy --- DOMinatorCustomHtmlView');
    }

}
