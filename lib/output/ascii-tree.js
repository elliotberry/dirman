import { promises as fs } from 'fs';
import chalk from 'chalk';

async function printAsciiTree(arr, highlights = []) {
  const findHighlight = (parentId, id) => highlights.find(hl => hl.parentId === parentId && hl.id === id);

  const printNode = (node, prefix = '', last = true) => {
    const highlight = findHighlight(node[0], node[1]);
    const getLine = () => last ? '└── ' : '├── ';

    if (highlight) {
      const colorize = chalk[highlight.color] || chalk.red;
      console.log(prefix + getLine() + colorize(node[2]));
    } else {
      console.log(prefix + getLine() + node[2]);
    }

    const children = arr.filter(item => item[0] === node[1]);
    children.forEach((child, index) => {
      const newPrefix = prefix + (last ? '    ' : '│   ');
      printNode(child, newPrefix, index === children.length - 1);
    });
  };

  const rootNodes = arr.filter(item => item[0] === null);
  rootNodes.forEach((node, index) => printNode(node, '', index === rootNodes.length - 1));
}

async function main() {
  const items = [
    [null, 1, 'Root'],
    [1, 2, 'Child 1'],
    [1, 3, 'Child 2'],
    [3, 4, 'Grandchild 1'],
    [2, 5, 'Grandchild 2']
  ];
  
  // Specify multiple highlights with more granular control
  const highlights = [
    { parentId: 1, id: 3, color: 'blue' },
    { parentId: 3, id: 4, color: 'green' }
  ];
  
  await printAsciiTree(items, highlights);
}

main();
