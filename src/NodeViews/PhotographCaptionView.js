import {
    TextSelection,
    NodeSelection
} from "prosemirror-state"

export default class PhotographCaptionView {

    constructor(node, view, getPos) {

        this.node = node
        this.view = view
        this.getPos = getPos

        this.dom = this.contentDOM = document.createElement('div');
        // // this.dom.innerHTML = 'Some shit';
        //  = document.createTextNode('Na bazmeg');

        // sometimes the copyright span contains this and sometimes the dom element itself
        // style="display: none;"

        if(node.attrs.class){
            this.dom.setAttribute("class", node.attrs.class);
        }
    }

    selectNode() {

    }

    deselectNode() {

    }

    update(node, decorations) {
        if (node.type.name != "photograph_caption") {
            return false;
        }

        if (node.content.size === 0 && !node.attrs.class.includes('empty')) {
            const a = { ...node.attrs };
            a.class += ' empty';
            this.view.dispatch(this.view.state.tr.setNodeMarkup(this.getPos(), null, a));
            return true;
        }  else if(node.content.size > 0 && node.attrs.class.includes(' empty')){
            const a = { ...node.attrs };
            a.class = a.class.replace(' empty', '');
            this.view.dispatch(this.view.state.tr.setNodeMarkup(this.getPos(), null, a));
            return true;
        }

        return false;
    }

    stopEvent(event) {

        // console.log(event);
        // const blacklisted = [
        //     'dragstart',
        //     'dragenter',
        //     'dragover',
        //     'dragend',
        //     'drop',
        //     'mousedown',
        // ];
        //
        // if( blacklisted.indexOf(event.type) > -1 ){
        //     return true;
        // }
        //
        // console.log(event.type);
        // return false;
    }

    ignoreMutation() {
        // return true;
        // Called when a DOM mutation or a selection change happens within the view. When the change is a selection change,
        // the record will have a type property of "selection" (which doesn't occur for native mutation records).
        // Return false if the editor should re-read the selection or re-parse the range around the mutation, true if it can safely be ignored.
    }

    // Called when the node view is removed from the editor or the whole editor is destroyed.
    destroy() {
        this.dom.remove();
    }

}
