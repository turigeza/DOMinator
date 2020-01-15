// You can get the content of a selection by calling slice on the document and passing in the from and to from the selection.

// link around position
function linkAround(doc, pos) {
    let $pos = doc.resolve(pos), parent = $pos.parent
    let start = parent.childAfter($pos.parentOffset)
    if (!start.node) return null
    let link = start.node.marks.find(mark => mark.type.name == "link")
    if (!link) return null

    let startIndex = $pos.index(), startPos = $pos.start() + start.offset
    while (startIndex > 0 && link.isInSet($pos.child(startIndex - 1).marks))
    startPos -= $pos.child(--startIndex).nodeSize
    let endIndex = $pos.indexAfter(), endPos = startPos + start.node.nodeSize
    while (end < parent.childCount && link.isInSet($pos.child(endIndex).marks))
    endPos += $pos.child(endIndex++).nodeSize
    return {from: startPos, to: endPos}
}

// https://discuss.prosemirror.net/t/set-attribute-on-all-selected-nodes/394/7
// Ah, I see. So you want to make a change to all applicable blocks touched by the selection?
// (For one thing, doing doc.resolve(x).pos is just going to give you x, so don’t do that.)
// Something like this might work (untested):
function setAlign(pm, align) {
  let tr = pm.tr
  pm.doc.nodesBetween(pm.selection.from, pm.selection.to, (node, pos) => {
    if (typeSupportsAlign(node.type) && node.attrs.align != align)
      tr.setNodeType(pos, node.type, Object.assign({}, node.attrs, {align}))
  })
  tr.apply()
}
