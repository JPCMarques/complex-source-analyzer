import parser from '@babel/parser';
import traverse from '@babel/traverse';
import { readFile } from 'fs/promises';

const fileData = (await readFile('./src/test.js')).toString();

const ast = parser.parse(fileData, {
  sourceType: 'script'
});

const processedRequires = [];
const unprocessedRequires = [];


traverse.default(ast, {
  Identifier: function (path) {
    if (path.node.name === 'require') {
      const parent = path.parent;
      const grandParent = path.parentPath.parent;
      switch (path.parentPath.parent.type) {
        case 'VariableDeclarator':
          processedRequires.push({ from: parent.arguments[0].value, to: grandParent.id.name, type: 'variable' })
          break;
        case 'ClassDeclaration':
          if (grandParent.superClass.type === 'CallExpression'
            && grandParent.superClass.callee.name === 'require'
          ) {
            processedRequires.push({ from: parent.arguments[0].value, to: grandParent.id.name, type: 'class' })
            break;
          }
        default:
          unprocessedRequires.push(path);
      }
    }
  }
})



console.log('success')