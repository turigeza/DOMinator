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
import {
    TextSelection,
    NodeSelection
} from "prosemirror-state"

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
    const {from, to} = getBlockRange(menu);
    const node = menu.view.state.doc.nodeAt(from);
    const selection = menu.view.state.selection;

    let attrs;
    if(typeof attribute === "object" && attribute !== null){
        attrs = { ...node.attrs, ...attribute }; // to update multiple attributes at the same time
    }else{
        attrs = { ...node.attrs };
        attrs[attribute] = value;
    }

    let rs = menu.view.dispatch(menu.view.state.tr.setNodeMarkup(from, null, attrs).scrollIntoView());

    // none atom nodes require to be selected again to maintain the selection
    if(selection.constructor.name === 'NodeSelection' && !node.type.isAtom){
        const newSelection = NodeSelection.create(menu.view.state.doc, from);
        menu.view.dispatch(menu.view.state.tr.setSelection(newSelection));
    }
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
        console.error(node.type.name);
        console.error(node.type);
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

export function insertLayout(menu, layoutKey){

    const selection = menu.view.state.selection;
    const state = menu.view.state;
    const layout = state.schema.nodes[layoutKey];
    const content = layout.spec.content;
    const contentArray = content.split(' ');
    // "cl_8{1} cl_4{1}"

    const columns = [];
    let columnIndex = 1;
    contentArray.forEach((column)=>{
        const [columnKey, occurrence] = column.replace('}', '').split('{');
        for (let j = 0; j < occurrence; j++) {
            const columnText = state.schema.nodes.paragraph.create({}, state.schema.text('Column '+ columnIndex));
            const columnNode = state.schema.nodes[columnKey].create({}, columnText);
            columns.push(columnNode);
            columnIndex++;
        }
    });

    const layoutNode = layout.create({}, columns);
    const pos = selection.$head.after(1);

    let tr = state.tr.insert( pos, layoutNode );
    tr.setSelection(TextSelection.create(tr.doc, pos +1));
    menu.view.dispatch(tr.scrollIntoView());
}

export function canInsertDownloads(menu){
    if(!menu.view.state.selection.empty || !menu.view.state.selection.$cursor){
        return false;
    }
    return true;
}

export function insertDownloads(menu, items){
    if(!canInsertDownloads(menu)){
        return false;
    }

    // see if we are adding to an existing list or it is a new list
    const state = menu.view.state;
    const $cursor = menu.view.state.selection.$cursor;

    const grandParent = $cursor.node($cursor.depth-1);
    let links = [];

    items.forEach(item => {
        links.push( state.schema.nodes.download_link.create(item, state.schema.text(item.title)) );
    });

    const after = $cursor.after();

    // we are within a download
    if(grandParent && grandParent.type.name === 'downloads'){
        const tr = state.tr.insert( after, links );
        menu.view.dispatch(tr.scrollIntoView());
    }else{
        const title = state.schema.nodes.download_title.create({}, state.schema.text('Download'));
        links.unshift(title);
        const downloads = state.schema.nodes.downloads.create({}, links);
        insertBlock(menu, downloads);
    }
}

// export function canInsertBlock(menu, block){
//
// }

export function insertBlock(menu, block){

    const view = menu.view;
    const selection = view.state.selection;
    const state = view.state;
    const pos = selection.from;
    const $pos = selection.$from;

    // start(depth: ?⁠number) → number
    // The (absolute) position at the start of the node at the given level.
    //
    // end(depth: ?⁠number) → number
    // The (absolute) position at the end of the node at the given level.
    //
    // before(depth: ?⁠number) → number
    // The (absolute) position directly before the wrapping node at the given level, or, when depth is this.depth + 1, the original position.
    //
    // after(depth: ?⁠number) → number
    // The (absolute) position directly after the wrapping node at the given level, or the original position when depth is this.depth + 1.
    // // const $cursor = selection.$cursor;
    // const grandParent = $cursor.node($cursor.depth-1);
    // const before = $cursor.before();
    // const after = $cursor.after();


    // console.log(selection);
    // // console.log('before');
    // // console.log($pos.before());
    // // console.log('after');
    // // console.log($pos.after());
    // console.log('start');
    // console.log($pos.start());
    // console.log('end');
    // console.log($pos.end());

    // console.log('nodeAfter');
    // console.log($pos.nodeAfter);
    // console.log('nodeBefore');
    // console.log($pos.nodeBefore);
    // console.log('selection.constructor.name');
    // console.log(selection.constructor.name);

    if(!selection.empty){
        return;
    }

    let insertPosition = pos;
    let tr = null;

    if(selection.constructor.name === 'TextSelection'){
        // selection is with the text
        if($pos.nodeBefore && $pos.nodeBefore.type.name === 'text' && $pos.nodeAfter && $pos.nodeAfter.type.name === 'text' ){
            // this behaves well on the most part except if you new line invisible characters in the html
            console.log('text - text');
        }else if(!$pos.nodeAfter && $pos.nodeBefore){
            console.log('!$pos.nodeAfter');
            // end of a text node would
            insertPosition = pos+1;
        }else if(!$pos.nodeBefore && $pos.nodeAfter){
            console.log('!$pos.nodeBefore');
            insertPosition = pos-1;
        }else if(!$pos.nodeBefore && !$pos.nodeAfter){
            console.log('!$pos.nodeBefore && !$pos.nodeAfter');
            insertPosition = pos-1;
        }else if($pos.nodeBefore && $pos.nodeAfter){
            console.log('NODE = NODE - both node exist but not text');
        }else{
            console.error('We can not insert a block here');
        }
    }else if(selection.constructor.name === 'NodeSelection'){
        // we don't care about this sceanrio it should not be possible to do this
        // console.log('NodeSelection');
        return false;
    }else if(selection.constructor.name === 'GapCursor'){
        // console.log('GapCursor');
        // this behaves well out of the box
    }

    tr = state.tr.insert( insertPosition, block );
    view.dispatch(tr.scrollIntoView());

}

export function toggleClassOnNode(menu, className){
    const selection = menu.view.state.selection;

    let pos = 0;
    let selectionType = false;
    if(selection.empty && selection.$cursor){
        pos = selection.$cursor.start()-1;
        selectionType = 'text';
    }else if(selection.constructor.name === 'NodeSelection'){
        pos = selection.from;
        selectionType = 'node';
    }

    const node = menu.view.state.doc.nodeAt(pos);

    // this should never exist anyway
    if(node.type.name === 'text'){
        throw 'This is a text node. It can not take a class.';
        return false;
    }

    if(!node.type.spec.attrs.class){
        return false;
    }

    let classNameNow = node.attrs.class || '';
    let newClassName = '';

    if(classNameNow.includes(className)){
        newClassName = classNameNow.replace(className, '').trim();
    }else{
        newClassName = classNameNow + ' ' + className;
        newClassName = newClassName.trim();
    }
    if(newClassName === ''){
        newClassName = null;
    }

    const newAttrs = { ...node.attrs, 'class': newClassName };
    menu.view.dispatch(menu.view.state.tr.setNodeMarkup(pos, null, newAttrs).scrollIntoView());

    let newSelection;
    if(selectionType === 'node'){
        newSelection = NodeSelection.create(menu.view.state.doc, pos);
    }else{
        newSelection = TextSelection.create(menu.view.state.doc, selection.$cursor.pos);
    }

    menu.view.dispatch(menu.view.state.tr.setSelection(newSelection));
}
// comes from TIPTAP https://tiptap.scrumpy.io/
function isList(node, schema) {
    return (node.type === schema.nodes.bullet_list || node.type === schema.nodes.ordered_list)
}

// comes from TIPTAP https://tiptap.scrumpy.io/
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

// comes from TIPTAP https://tiptap.scrumpy.io/
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
