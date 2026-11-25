// Paste into the same Figma tool call as planLayout(input). Uses only plain JS.
function planLayout(input) {
  function number(value, label, minimum = 0) {
    if (!Number.isFinite(value) || value < minimum) throw Error('Invalid ' + label);
    return value;
  }
  function list(items, label) {
    if (!Array.isArray(items) || !items.length) throw Error('Missing ' + label);
    return items;
  }
  const placements = [];
  const ids = new Set();
  function put(box, x, y, width = box.width, height = box.height, role) {
    if (typeof box.id !== 'string' || !box.id || ids.has(box.id)) {
      throw Error('Missing or duplicate node ID: ' + box.id);
    }
    ids.add(box.id);
    placements.push({ id: box.id, role, x, y,
      width: number(width, 'width', 0.001), height: number(height, 'height', 0.001) });
  }

  const left = number(input.left, 'left');
  let rowTop = number(input.top, 'top');
  let bottom = rowTop;
  let right = left;
  for (const row of list(input.rows, 'rows')) {
    const modules = list(row.modules, 'modules');
    const headerHeight = Math.max(...modules.map(m => number(m.title.height, 'title height', 0.001)));
    const subHeight = Math.max(0, ...modules.flatMap(m => list(m.groups, 'groups')
      .map(g => g.title ? number(g.title.height, 'subtitle height', 0.001) : 0)));
    const preferredGap = number(row.headerGap ?? (subHeight ? 225 : 125), 'header gap');
    const boardTop = rowTop + headerHeight + Math.max(preferredGap, subHeight);
    put(row.category, left, boardTop, row.category.width, row.category.height, 'category');
    let x = left + row.category.width + 240;
    bottom = Math.max(boardTop + row.category.height, number(row.occupiedBottom ?? 0, 'occupied bottom'));

    for (const mod of modules) {
      const moduleLeft = x;
      for (const group of mod.groups) {
        const groupLeft = x;
        for (const board of list(group.boards, 'boards')) {
          put(board, x, boardTop, board.width, board.height, 'board');
          const boardBottom = boardTop + board.height;
          bottom = Math.max(bottom, boardBottom);
          if (board.remark) {
            // Remark heights must be remeasured at the final board width.
            if (Math.abs(board.remark.width - board.width) > 0.01) {
              throw Error('Measure Remark at board width: ' + board.remark.id);
            }
            put(board.remark, x, boardBottom + 64, board.width, board.remark.height, 'remark');
            bottom = Math.max(bottom, boardBottom + 64 + board.remark.height);
          }
          right = Math.max(right, x + board.width);
          x += board.width + 120;
        }
        const groupRight = x - 120;
        if (group.title) {
          put(group.title, groupLeft, rowTop + headerHeight, groupRight - groupLeft, group.title.height, 'subgroup');
        }
        x = groupRight + 240;
      }
      const headerWidth = x - 240 - moduleLeft;
      put(mod.title, moduleLeft, rowTop + headerHeight - mod.title.height, headerWidth, mod.title.height, 'module');
    }
    rowTop = bottom + number(row.rowGap ?? 800, 'row gap');
  }
  return {
    placements,
    width: Math.max(number(input.width, 'section width'), right + number(input.rightMargin ?? 0, 'right margin')),
    height: Math.max(number(input.height, 'section height'), bottom + number(input.bottomMargin ?? 0, 'bottom margin'))
  };
}
