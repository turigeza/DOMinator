import {
    liftListItem,
    wrapInList
} from "prosemirror-schema-list"
import {
    nodeIsActive,
    getMarkRange,
    getBlockRange
} from "./DOMinatorUtilities"
import {
    findParentNode
} from 'prosemirror-utils'
import {
    toggleMark as toggleMarkCommand,
    setBlockType,
    wrapIn,
    lift
} from "./prosemirrorcommands"
import {
    ReplaceAroundStep
} from "prosemirror-transform"
import {
    Slice,
    Fragment
} from "prosemirror-model"

export function updateAlignmentButton(button, menu, classKey){
    button.deactivate();

    const className = menu.dominator.options.textAlignClasses[classKey];
    if(!className){
        return false;
    }
    if(menu.activeBlock && menu.activeBlock.attrs.class && menu.activeBlock.attrs.class.includes(className)){
        button.activate();
        return true;
    }
    return false;
}

export function alignSelection(view, classKey, classes){

    const selection = view.state.selection;

    let transaction = view.state.tr;
    view.state.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
        let clearOnly = false;
        if(!classKey){
            clearOnly = true
        } else if(!classes[classKey]) {
            console.error(classes);
            throw 'Class does not exist with a key: '+classKey;
        }

        if(node.type.spec.canTakeAligment){

            // remove alignment classes
            let className = '';
            if(node.attrs.class){
                className = node.attrs.class;
                Object.keys(classes).forEach(key =>{
                    className = className.replace(classes[key], '');
                });
            }
            className = className.trim();

            if(!clearOnly){
                className += ' '+classes[classKey];
                className = className.trim();
            }

            let attrs = { ...node.attrs, 'class': className};
            const type = node.type
            let newNode = type.create(attrs, null, node.marks)

            transaction.step(
                new ReplaceAroundStep(pos, pos + node.nodeSize, pos + 1, pos + node.nodeSize - 1, new Slice(Fragment.from(newNode), 0, 0), 1, true)
            )
        }
    });

    if(transaction.docChanged){
        view.dispatch(transaction);
    }
}

// export function alignSelectionOld(view, classKey, classes){
//     const selection = view.state.selection;
//
//     view.state.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
//
//         if(!classes[classKey]){
//             console.error(classes);
//             throw 'Class does not exist with a key: '+classKey;
//         }
//
//         let trans = view.state.tr();
//         if(node.type.spec.canTakeAligment){
//             // remove alignment classes
//             let className = '';
//             if(node.attrs.class){
//                 className = node.attrs.class;
//                 Object.keys(classes).forEach(key =>{
//                     className = className.replace(classes[key], '');
//                 });
//             }
//             className = className.trim();
//             className += ' '+classes[classKey];
//             className = className.trim();
//
//             let attrs = { ...node.attrs, 'class': className};
//             view.dispatch(view.state.tr.setNodeMarkup(pos, null, attrs ));
//         }
//     });
// }

export function stripPaddingMarginClasses(string, strip, classes){
    let stripped = {};
    strip.forEach(key => {
        const cl = classes[key];
        Object.keys(cl).forEach(objKey=>{
            const val = cl[objKey];
            const includes = string.includes(val);
            if(includes){
                string = string.replace(val, '');
                stripped[key] = objKey;
            }
        });
    });

    string = string.trim();
    return { string, stripped };
}

export function changeAttributeOnNode(menu, attribute, value){
    let range = getBlockRange(menu);
    let attrs = {};
    attrs[attribute] = value;
    let rs = menu.view.dispatch(menu.view.state.tr.setNodeMarkup(range.from, null, attrs).scrollIntoView());
}

export function normalizePaddingMargin(menu, paddingOrMargin, side, size){

    const classes = paddingOrMargin === 'padding' ? menu.dominator.options.paddingClasses : menu.dominator.options.marginClasses;
    const sizes = ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'none'];
    const sides = ['left', 'right', 'x', 'y', 'all', 'top', 'bottom'];

    if(size && sizes.indexOf(size) == -1){
        throw size + 'is not a valid size.';
    }
    if(side && sides.indexOf(side) == -1){
        throw side + 'is not a valid side.';
    }

    if(!menu.activeBlock){
        console.trace();
        throw('No active block set!');
    }

    const node = menu.activeBlock;

    if(typeof node.type.attrs.class === 'undefined'){
        console.log(node.type.name);
        console.log(node.type);
        throw('This element does not support a class.');
    }

    let className = node.attrs.class ? node.attrs.class : '';

    if(side === 'all'){
        // strip all classes and add classes to all four sides
        let rs = stripPaddingMarginClasses(className, ['left', 'right', 'x', 'y', 'all', 'top', 'bottom'], classes);
        className = rs.string;
    }else if(side === 'x'){
        let rs = stripPaddingMarginClasses(className, ['x', 'all', 'left', 'right'], classes);
        className = rs.string;
        if(rs.stripped.all){
            className += ' ' + classes.y[rs.stripped.all];
        }
    }else if(side === 'y'){
        let rs = stripPaddingMarginClasses(className, ['y', 'all', 'top', 'bottom'], classes);
        className = rs.string;
        if(rs.stripped.all){
            className += ' ' + classes.x[rs.stripped.all];
        }
    }else if(side === 'left'){
        let rs = stripPaddingMarginClasses(className, ['x', 'all', 'left'], classes);
        className = rs.string;

        if(rs.stripped.all){
            className += ' ' + classes.y[rs.stripped.all];
            className += ' ' + classes.right[rs.stripped.all];
        } else if(rs.stripped.x){
            className += ' ' + classes.right[rs.stripped.x];
        }

    }else if(side === 'right'){
        let rs = stripPaddingMarginClasses(className, ['x', 'all', 'right'], classes);
        className = rs.string;

        if(rs.stripped.all){
            className += ' ' + classes.y[rs.stripped.all];
            className += ' ' + classes.left[rs.stripped.all];
        } else if(rs.stripped.x){
            className += ' ' + classes.left[rs.stripped.x];
        }
    }else if(side === 'bottom'){
        let rs = stripPaddingMarginClasses(className, ['y', 'all', 'bottom'], classes);
        className = rs.string;

        if(rs.stripped.all){
            className += ' ' + classes.x[rs.stripped.all];
            className += ' ' + classes.top[rs.stripped.all];
        } else if(rs.stripped.y){
            className += ' ' + classes.top[rs.stripped.y];
        }
    }else if(side === 'top'){
        let rs = stripPaddingMarginClasses(className, ['y', 'all', 'top'], classes);
        className = rs.string;

        if(rs.stripped.all){
            className += ' ' + classes.x[rs.stripped.all];
            className += ' ' + classes.bottom[rs.stripped.all];
        } else if(rs.stripped.y){
            className += ' ' + classes.bottom[rs.stripped.y];
        }
    }else{
        let rs = stripPaddingMarginClasses(className, ['all', 'y', 'x', 'top', 'bottom', 'left', 'right'], classes);
        className = rs.string;
    }

    if(size){
        className += ' ' + classes[side][size];
    }

    className = className.trim();
    changeAttributeOnNode(menu, 'class', className);
}

export function convertBlock(nodeKey, attrs, menu) {
    const nodeType = menu.editorSchema.nodes[nodeKey];
    const selection = menu.view.state.selection;
    let range = getBlockRange(menu);
    if(!range){
        console.log('Range is empty');
        return;
    }

    menu.view.dispatch(menu.view.state.tr.setBlockType(range.from, range.to, nodeType, attrs).scrollIntoView());
}

export function clearFormatting(menu) {
    let state = menu.view.state;
    let dispatch = menu.view.dispatch;

    if (!state.selection.empty) {
        var {
            from,
            to
        } = state.selection;
    } else if (menu.activeMark) {
        var {
            from,
            to
        } = getMarkRange(state.selection.$cursor, menu.activeMark);
    } else {
        return;
    }

    dispatch(state.tr.removeMark(from, to, menu.activeMark));
}

export function toggleMark(menu, mark) {
    let cmd = toggleMarkCommand(mark);
    cmd(menu.view.state, menu.view.dispatch);
}

export function toggleClassOnMark(menu, activeMark, style, strip) {
    const view = menu.view;
    const attrsNow = activeMark.attrs;
    const {
        from,
        to
    } = getMarkRange(view.state.selection.$cursor, activeMark);

    let className = activeMark.attrs.class;
    if (!className) {
        className = '';
    }

    let hadStyle = false;

    if (className.includes(style)) {
        hadStyle = true;
        className = className.replace(style, '');
    }

    if (strip && strip.length > 0) {
        strip.forEach(
            str => className = className.replace(str, '')
        );
    }

    // the link already has this style
    if (!hadStyle) {
        className += ' ' + style;
    }

    className = className.trim();

    const attrs = {
        ...{},
        ...attrsNow,
        'class': className
    };
    view.dispatch(view.state.tr.addMark(from, to, activeMark.type.create(attrs)));
}

export function changeAttributeOnMark(attribute, value, menu, mark) {
    if (!mark) {
        mark = menu.activeMark;
    }
    const attrsNow = mark.attrs;
    const {
        from,
        to
    } = getMarkRange(menu.view.state.selection.$cursor, mark);
    let attrsNew = {};
    attrsNew[attribute] = value;
    const attrs = {
        ...{},
        ...attrsNow,
        ...attrsNew
    };
    menu.view.dispatch(menu.view.state.tr.addMark(from, to, mark.type.create(attrs)));
}

export function toggleAttributeOnMark(attribute, value, menu, mark) {
    if (!mark) {
        mark = menu.activeMark;
    }
    const view = menu.view;
    const attrsNow = mark.attrs;
    if (attrsNow[attribute]) {
        if (!value || value === attrsNow[attribute]) {
            value = null;
        }
    }

    changeAttributeOnMark(attribute, value, menu, mark);
}

export function updateLinkStyleButton(style, button, menu) {
    const mark = menu.activeMark;
    if (mark.attrs.class && mark.attrs.class.includes(style)) {
        button.activate();
    } else {
        button.deactivate();
    }
}

// the rest comes from tiptap
function isList(node, schema) {
    return (node.type === schema.nodes.bullet_list || node.type === schema.nodes.ordered_list)
}

export function toggleWrap(nodeKey, menu) {
    const type = menu.editorSchema.nodes[nodeKey];
    const state = menu.view.state;
    const dispatch = menu.view.dispatch;
    const view = menu.view;

    const isActive = nodeIsActive(state, type)

    if (isActive) {
        return lift(state, dispatch)
    }

    return wrapIn(type)(state, dispatch, view)
}

export function toggleList(nodeKey, menu) {

    const listType = menu.editorSchema.nodes[nodeKey];
    const itemType = menu.editorSchema.nodes['list_item'];
    const state = menu.view.state;
    const dispatch = menu.view.dispatch;
    const view = menu.view;

    // let cmd = wrapInList(nodeType, {});
    // cmd(menu.view.state, menu.view.dispatch);
    const schema = menu.editorSchema;
    const selection = menu.view.state.selection;
    const {
        $from,
        $to
    } = selection;
    const range = $from.blockRange($to)

    if (!range) {
        return false
    }

    const parentList = findParentNode(node => isList(node, schema))(selection);

    if (range.depth >= 1 && parentList && range.depth - parentList.depth <= 1) {
        if (parentList.node.type === listType) {
            return liftListItem(itemType)(state, dispatch, view);
        }

        if (isList(parentList.node, schema) && listType.validContent(parentList.node.content)) {
            const {
                tr
            } = state
            tr.setNodeMarkup(parentList.pos, listType)
            dispatch(tr)
            return false
        }
    }

    return wrapInList(listType)(state, dispatch, view)
}


export function insertPhotograph(menu, photograph){

    const selection = view.state.selection;


}
