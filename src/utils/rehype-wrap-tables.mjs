/**
 * Envuelve cada tabla del MDX en un contenedor con scroll horizontal
 * para que el artículo no se desborde en móvil.
 * @param {any} node
 */
function wrapTables(node) {
  if (!node || typeof node !== 'object' || !Array.isArray(node.children)) return;

  for (let i = 0; i < node.children.length; i += 1) {
    const child = node.children[i];
    if (child?.type === 'element' && child.tagName === 'table') {
      node.children[i] = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['blog-table-scroll'] },
        children: [child],
      };
      continue;
    }
    wrapTables(child);
  }
}

export default function rehypeWrapTables() {
  return (tree) => {
    wrapTables(tree);
  };
}
