// The basic shema got a from prosemirror-schema-basic and then modified to our needs
import {
    Schema
} from "prosemirror-model"

// [Specs](#model.NodeSpec) for the nodes defined in this schema.
export const nodes = {
    // :: NodeSpec The top level document node.
    doc: {
        content: "(block | layout)+"
    },

    // :: NodeSpec A plain paragraph textblock. Represented in the DOM
    // as a `<p>` element.
    paragraph: {
        content: "inline*",
        group: "block",
        canTakeAligment: true,
        attrs: {
            class: {
                default: null
            }
        },
        parseDOM: [{
            tag: "p",
            getAttrs: dom => {
                let attrs = {};
                attrs.class = dom.getAttribute("class");
                return attrs;
            }
        }],
        toDOM(node) {
            return ["p", node.attrs, 0];
        }
    },

    // :: NodeSpec A blockquote (`<blockquote>`) wrapping one or more blocks.
    blockquote: {
        content: "block+",
        group: "block",
        excludes: '',
        defining: true,
        parseDOM: [{
            tag: "blockquote"
        }],
        toDOM() {
            return ["blockquote", {}, 0];
        }
    },

    // :: NodeSpec A horizontal rule (`<hr>`).
    horizontal_rule: {
        group: "block",
        parseDOM: [{
            tag: "hr"
        }],
        toDOM() {
            return ["hr"];
        }
    },

    // :: NodeSpec A heading textblock, with a `level` attribute that
    // should hold the number 1 to 6. Parsed and serialized as `<h1>` to
    // `<h6>` elements.
    heading: {
        attrs: {
            level: {
                default: 1
            },
            'class': {
                default: null
            }
        },
        content: "inline*",
        group: "block",
        defining: true,
        parseDOM: [{
            tag: "h1, h2, h3, h4, h5, h6",
            getAttrs: dom => {
                let attrs = {};

                // level
                if(dom.nodeName === 'H1'){
                    attrs.level = 1;
                }else if(dom.nodeName === 'H2'){
                    attrs.level = 2;
                }else if(dom.nodeName === 'H3'){
                    attrs.level = 3;
                }else if(dom.nodeName === 'H4'){
                    attrs.level = 4;
                }else if(dom.nodeName === 'H5'){
                    attrs.level = 5;
                }else if(dom.nodeName === 'H6'){
                    attrs.level = 6;
                }else{
                    console.error('No way ! ' + dom.nodeName);
                }

                attrs.class = dom.getAttribute("class") || null;
                return attrs;
            }
        }],
        toDOM(node) {
            let attrs = {};
            if(node.attrs.class !== ''){
                attrs.class = node.attrs.class;
            }
            return ["h" + node.attrs.level, attrs, 0]
        }
    },

    // :: NodeSpec A code listing. Disallows marks or non-text inline
    // nodes by default. Represented as a `<pre>` element with a
    // `<code>` element inside of it.
    code_block: {
        content: "text*",
        marks: "",
        group: "block",
        code: true,
        defining: true,
        parseDOM: [{
            tag: "pre",
            preserveWhitespace: "full"
        }],
        toDOM() {
            return ["pre", ["code", 0]];
        }
    },

    // :: NodeSpec The text node.
    text: {
        group: "inline"
    },

    // :: NodeSpec An inline image (`<img>`) node. Supports `src`,
    // `alt`, and `href` attributes. The latter two default to the empty
    // string.
    image: {
        inline: false,
        attrs: {
            id: {
                default: null
            },
            src: {
                default: null
            },
            alt: {
                default: null
            },
            title: {
                default: null
            },
            'data-photograph_id': {
                default: null
            },
            'data-photograph_medium': {
                default: null
            },
            'data-photograph_large': {
                default: null
            },
            draggable: {
                default: false
            }

        },
        group: "block",
        draggable: false,
        selectable: false,
        parseDOM: [{
            tag: "img[src]",
            getAttrs(dom) {
                return {
                    src: dom.getAttribute("src"),
                    title: dom.getAttribute("title"),
                    alt: dom.getAttribute("alt"),
                    'data-photograph_id': dom.getAttribute('data-photograph_id'),
                    'data-photograph_medium': dom.getAttribute('data-photograph_medium'),
                    'data-photograph_large': dom.getAttribute('data-photograph_large'),
                }
            }
        }],
        toDOM(node) {
            return ["img", node.attrs];
        }
    },

    // :: NodeSpec A hard line break, represented in the DOM as `<br>`.
    hard_break: {
        inline: true,
        group: "inline",
        selectable: false,
        parseDOM: [{
            tag: "br"
        }],
        toDOM() {
            return ["br"];
        }
    },
    layout_12: {
        content: "cl_12{1}",
        group: "layout",
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
        group: "layout",
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
        group: "layout",
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
        group: "layout",
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
        group: "layout",
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
        group: "layout",
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
    photograph: {
        content: "image{1} photograph_caption{1}",
        group: "block",
        defining: true,
        selectable: true,
        draggable: false,
        attrs: {
            class: {
                default: 'tg_subwidget_photograph'
            },
            id: {
                default: null
            }
        },
        parseDOM: [{
            tag: 'div.tg_subwidget_photograph',
            getAttrs: dom => {
                return {
                    id: dom.getAttribute("id"),
                    'class': dom.getAttribute("class")
                };
            }
        }],
        toDOM(node) {
            return [
                "div",
                node.attrs,
                0
            ]
        }
    },
    photograph_caption: {
        menu: 'photograph',
        content: "inline*",
        group: "block",
        defining: true,
        selectable: false,
        draggable: false,
        attrs: {
            class: {
                default: 'tg_subwidget_photograph_text'
            }
        },
        parseDOM: [{
            tag: 'div.tg_subwidget_photograph_text',
            getAttrs: dom => {
                return {
                    'class': dom.getAttribute("class")
                };
            }
        }],
        toDOM(node) {
            return [
                "div",
                node.attrs,
                0
            ]
        }
    },
    carousel: {
        group: "block",
        defining: true, // node is considered an important parent node during replace operations
        selectable: true,
        atom: true, // though this isn't a leaf node, it doesn't have directly editable content and should be treated as a single unit in the view.
        draggable: false,
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
            tag: 'div.tg_subwidget_carousel',
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
            if(node.attrs){
                newDiv.setAttribute('class', node.attrs.class);
            }

            return newDiv;

        }
    },
    custom_html: {
        group: "block",
        defining: true, // node is considered an important parent node during replace operations
        selectable: true,
        atom: true, // though this isn't a leaf node, it doesn't have directly editable content and should be treated as a single unit in the view.
        draggable: false,
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
            if(node.attrs){
                newDiv.setAttribute('class', node.attrs.class);
            }

            return newDiv;

        }
    },

}

// :: Object [Specs](#model.MarkSpec) for the marks in the schema.
export const marks = {
    // :: MarkSpec A link. Has `href` and `title` attributes. `title`
    // defaults to the empty string. Rendered and parsed as an `<a>`
    // element.
    link: {
        attrs: {
            href: {
                default: ''
            },
            title: {
                default: null
            },
            target: {
                default: null
            },
            'class': {
                default: null
            },

        },
        excludes: 'span link',
        inclusive: false,
        parseDOM: [{
            tag: "a", //[href]
            getAttrs(dom) {

                return {
                    href: dom.getAttribute("href"),
                    title: dom.getAttribute("title"),
                    target:  dom.getAttribute("target"),
                    'class': dom.getAttribute("class"),
                }
            }
        }],
        toDOM(node) {
            return ["a", node.attrs, 0]
        }
    },

    // for inline styling
    span: {
        attrs: {
            'class': {
                default: null
            }
        },
        parseDOM: [{
            tag: "span",
            getAttrs: dom => {
                return {
                    'class':  dom.getAttribute("class") || null
                }
            }
        }],
        toDOM(node) {
            return ["span", node.attrs, 0];
        }
    },
    // :: MarkSpec An emphasis mark. Rendered as an `<em>` element.
    // Has parse rules that also match `<i>` and `font-style: italic`.
    i: {
        parseDOM: [{
            tag: "i"
        }, {
            tag: "em"
        }, {
            style: "font-style=italic"
        }],
        toDOM() {
            return ["i", 0];
        }
    },

    // :: MarkSpec A strong mark. Rendered as `<strong>`, parse rules
    // also match `<b>` and `font-weight: bold`.
    b: {
        parseDOM: [{
                tag: "strong"
            },
            // This works around a Google Docs misbehavior where
            // pasted content will be inexplicably wrapped in `<b>`
            // tags with a font-weight normal.
            {
                tag: "b",
                getAttrs: node => node.style.fontWeight != "normal" && null
            },
            {
                style: "font-weight",
                getAttrs: value => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null
            }
        ],
        toDOM() {
            return ["b", 0];
        }
    },

    // :: MarkSpec Code font mark. Represented as a `<code>` element.
    code: {
        parseDOM: [{
            tag: "code"
        }],
        toDOM() {
            return ["code", 0];
        }
    },
    del: {
        parseDOM: [{
            tag: "del"
        }],
        toDOM() {
            return ["del", 0];
        }
    },
    u: {
        parseDOM: [{
            tag: "u"
        }],
        toDOM() {
            return ["u", 0];
        }
    },
    sub: {
        parseDOM: [{
            tag: "sub"
        }],
        excludes: 'sub sup',
        toDOM() {
            return ["sub", 0];
        }
    },
    sup: {
        parseDOM: [{
            tag: "sup"
        }],
        excludes: 'sub sup',
        toDOM() {
            return ["sup", 0];
        }
    },

}

// :: Schema
// This schema roughly corresponds to the document schema used by
// [CommonMark](http://commonmark.org/), minus the list elements,
// which are defined in the [`prosemirror-schema-list`](#schema-list)
// module.
//
// To reuse elements from this schema, extend or read from its
// `spec.nodes` and `spec.marks` [properties](#model.Schema.spec).
export const schema = new Schema({
    nodes,
    marks
})
