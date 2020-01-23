export default {
    layout_12: {
        content: "cl_12{1}",
        group: "block layout",
        defining: true,
        selectable: true,
        parseDOM: [{
            tag: 'div.layout_12'
        }],
        toDOM() {
            return [
                "div",
                {
                    class:"layout layout_12"
                },
                0
            ]
        }
    },
    layout_48: {
        content: "cl_4{1} cl_8{1}",
        group: "block layout",
        defining: true,
        parseDOM: [{
            tag: 'div.layout_48'
        }],
        toDOM() {
            return [
                "div",
                {
                    class:"layout layout_48"
                },
                0
            ]
        }
    },
    layout_66: {
        content: "cl_6{2}",
        group: "block layout",
        defining: true,
        parseDOM: [{
            tag: 'div.layout_66'
        }],
        toDOM() {
            return [
                "div",
                {
                    class:"layout layout_66"
                },
                0
            ]
        }
    },
    layout_84: {
        content: "cl_8{1} cl_4{1}",
        group: "block layout",
        defining: true,
        parseDOM: [{
            tag: 'div.layout_84'
        }],
        toDOM() {
            return [
                "div",
                {
                    class:"layout layout_84"
                },
                0
            ]
        }
    },
    layout_444: {
        content: "cl_4{3}",
        group: "block layout",
        defining: true,
        parseDOM: [{
            tag: 'div.layout_444'
        }],
        toDOM() {
            return [
                "div",
                {
                    class:"layout layout_444"
                },
                0
            ]
        }
    },
    layout_3333: {
        content: "cl_3{4}",
        group: "block layout",
        defining: true,
        parseDOM: [{
            tag: 'div.layout_3333'
        }],
        toDOM() {
            return [
                "div",
                {
                    class:"layout layout_3333"
                },
                0
            ]
        }
    },

    cl_3: {
        content: "block+",
        group: "layout_columns",
        defining: true,
        selectable: false,
        parseDOM: [{
            tag: 'div.cl_3'
        }],
        toDOM() {
            return [
                "div",
                {
                    class:"cl_3"
                },
                0
            ]
        }
    },
    cl_4: {
        content: "block+",
        group: "layout_columns",
        defining: true,
        selectable: false,
        parseDOM: [{
            tag: 'div.cl_4'
        }],
        toDOM() {
            return [
                "div",
                {
                    class:"cl_4"
                },
                0
            ]
        }
    },
    cl_6: {
        content: "block+",
        group: "layout_columns",
        defining: true,
        selectable: false,
        parseDOM: [{
            tag: 'div.cl_6'
        }],
        toDOM() {
            return [
                "div",
                {
                    class:"cl_6"
                },
                0
            ]
        }
    },
    cl_8: {
        content: "block+",
        group: "layout_columns",
        defining: true,
        selectable: false,
        parseDOM: [{
            tag: 'div.cl_8'
        }],
        toDOM() {
            return [
                "div",
                {
                    class:"cl_8"
                },
                0
            ]
        }
    },
    cl_12: {
        content: "block+",
        group: "layout_columns",
        defining: true,
        selectable: false,
        parseDOM: [{
            tag: 'div.cl_12'
        }],
        toDOM() {
            return [
                "div",
                {
                    class:"cl_12"
                },
                0
            ]
        }
    },
    custom_html: {
        content: "block+",
        group: "block",
        defining: true, // node is considered an important parent node during replace operations
        selectable: true,
        atom: true, // though this isn't a leaf node, it doesn't have directly editable content and should be treated as a single unit in the view.
        draggable: false, // does not work for some reason
        // isolating: true, // When enabled (default is false), the sides of nodes of this type count as boundaries that regular editing operations, like backspacing or lifting, won't cross.
        attrs: {
            class: {
                default: null
            },
            html: {
                default: ''
            },
        },
        parseDOM: [{
            tag: 'div',
            getAttrs: dom => {
                // console.log(dom.getAttribute("class"));
                // let attributes = Array.prototype.slice.call(dom.attributes);
                return {
                    'class': dom.getAttribute("class"),
                    html: dom.innerHTML
                };
            }
        }],
        toDOM(node) {
            let newDiv = document.createElement("div");
            newDiv.innerHTML = node.attrs.html;
            console.log(node.attrs.class);
            if(node.attrs){
                newDiv.setAttribute('class', node.attrs.class);
            }

            return newDiv;

        }
    },

}
