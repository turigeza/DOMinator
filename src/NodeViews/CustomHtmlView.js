import {
    TextSelection,
    NodeSelection
} from "prosemirror-state"

export default class CustomHtmlView {

    constructor(node, view, getPos) {

        this.node = node
        this.view = view
        this.getPos = getPos

        this.dom = document.createElement('div');
        this.dom.innerHTML = node.attrs.html;
        this.dom.setAttribute("class", node.attrs.class);

        // this is in case we need to initialise any javascript after construction
        if(view.$d_listeners && typeof view.$d_listeners.afterCustomHtmlConstruct === 'function'){
            view.$d_listeners.afterCustomHtmlConstruct(this.dom, node, view, getPos);
        }
    }

    update(node, decorations) {
        if(node.type.name !== 'custom_html'){
            return false;
        }

        if(this.view.$d_listeners && typeof this.view.$d_listeners.beforeCustomHtmlUpdate === 'function'){
            return this.view.$d_listeners.beforeCustomHtmlUpdate(this.dom, node);
        }

        return true;
    }

    ignoreMutation() {
        return true;
        // Called when a DOM mutation or a selection change happens within the view. When the change is a selection change,
        // the record will have a type property of "selection" (which doesn't occur for native mutation records).
        // Return false if the editor should re-read the selection or re-parse the range around the mutation, true if it can safely be ignored.
    }

    destroy() {
        this.dom.remove();
    }
}
