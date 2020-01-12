import {
    // Selection,
    // TextSelection,
    NodeSelection
    // AllSelection
} from "prosemirror-state"

export default class DOMinatorCustomHtmlView {
    constructor(node, view, getPos) {
        // We'll need these later
        this.node = node
        this.view = view
        this.getPos = getPos
        this.dom = node.attrs.dom.cloneNode(true);
        this.dom.addEventListener("mousedown", event => {


            // console.log(this.view);
            // console.log(node);
            // // console.log(NodeSelection.create(this.node.nodeSize));
            // // console.log(this.node.resolve(0))
            // // console.log(new NodeSelection(this.node.resolve(0)));
            //
            //
            //
            // // console.log(node.resolve());
            // // console.log(this.getPos());
            // // tr.insert(tr.doc.content.size, node)
            // // console.log(NodeSelection.create(this.getPos(), this.node.nodeSize))
            //
            // // this.view.dispatch();
            //
            // // NodeSelection
            // // this.view.state.tr.setSelection(
            // //     NodeSelection.create(this.view.state.doc, )
            // // );



            this.view.dispatch(this.view.state.tr.setSelection(
                NodeSelection.create(
                this.view.state.doc,
                this.getPos()
            )));

            console.log('mousedown');

        });
        // this.dom.querySelectorAll('.someclass')[0].addEventListener("mouseup", event => {
        //     console.log('.someclass');
        // }),
        // console.log(this.dom.querySelectorAll('.someclass'));
        // this.dom.classList.add('someshit')
    }

    selectNode() {
        this.dom.classList.add("ProseMirror-selectednode")
    }

    deselectNode() {
        this.dom.classList.remove("ProseMirror-selectednode")
    }

    update(node, decorations) {
        console.log('update --- DOMinatorCustomHtmlView');
    }

    stopEvent(event) {
        if(event.type === 'mousedown'){
            return true;
        }
        return false;
        // console.log(event.type);

        // console.log('stopEvent --- DOMinatorCustomHtmlView');
        // console.log(event);


        // Can be used to prevent the editor view from trying to handle some or all DOM events that bubble up from the node view.
        // Events for which this returns true are not handled by the editor.
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
