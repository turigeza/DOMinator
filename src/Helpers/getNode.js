import getPosition from "./getPosition"
export default function getNode(menu){
    let pos = getPosition(menu.view.state.selection);
    let node = menu.view.state.doc.nodeAt(pos);
    return node;
}
