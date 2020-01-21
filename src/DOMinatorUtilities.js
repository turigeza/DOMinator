import {
    findParentNode,
    findSelectedNodeOfType,
} from 'prosemirror-utils';

export function getMarkRange(ResolvedPos, mark) {

    let parent = ResolvedPos.parent;
    let index = ResolvedPos.index();

    // ResolvedPos is at the end of parent there are nodes with this index
    if (parent.content.content.length === index){
        return false;
    }

    const child = parent.content.content[index];

    let from = ResolvedPos.start() + ResolvedPos.parentOffset - ResolvedPos.textOffset;
    let to = from + child.nodeSize;

    // look ahead
    for (let i = index + 1; i < parent.content.content.length; i++) {
        let temp = parent.content.content[i];
        if(mark.isInSet(temp.marks)){
            to += temp.nodeSize;
        }else{
            break;
        }
    }

    // look back
    for (let i = index - 1; i >= 0 ; i--) {
        let temp = parent.content.content[i];
        if(mark.isInSet(temp.marks)){
            from -= temp.nodeSize;
        }else{
            break;
        }
    }

    return { from, to };
}

export function getBlockRange(menu) {
    const selection = menu.view.state.selection;
    let from, to;
    if (selection.constructor.name === 'TextSelection' && selection.empty) {
        from = selection.$cursor.start() - 1;
        to = selection.$cursor.end() + 1;
    } else if (selection.constructor.name === 'NodeSelection') {
        from = selection.from;
        to = selection.to;
    } else {
        return false;
    }
    
    return {from, to};
}

// the rest comes from tiptap
export function nodeIsActive(state, type, attrs = {}) {
    const predicate = node => node.type === type
    const node = findSelectedNodeOfType(type)(state.selection)
    || findParentNode(predicate)(state.selection)

    if (!Object.keys(attrs).length || !node) {
        return !!node
    }

    return node.node.hasMarkup(type, attrs)
}
