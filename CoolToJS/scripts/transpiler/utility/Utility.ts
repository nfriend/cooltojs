module CoolToJS.Utility {

    export function PrintSyntaxTree(syntaxTree: SyntaxTree, indent: string = '', last: boolean = true) {
        var stringToWrite = indent;
        if (last) {
            stringToWrite += '\\-';
            indent += '  ';
        } else {
            stringToWrite += '|-';
            indent += '| ';
        }
        console.log(stringToWrite + SyntaxKind[syntaxTree.syntaxKind]);

        for (var i = 0; i < syntaxTree.children.length; i++) {
            Utility.PrintSyntaxTree(syntaxTree.children[i], indent, i === syntaxTree.children.length - 1);
        }
    }

    export function ShallowCopySyntaxTree(syntaxTree: SyntaxTree, parentTree: SyntaxTree = null): SyntaxTree {
        var newTree: SyntaxTree = {
            syntaxKind: syntaxTree.syntaxKind,
            syntaxKindName: SyntaxKind[syntaxTree.syntaxKind],
            token: syntaxTree.token,
            children: [],
            parent: parentTree
        }

        for (var i = 0; i < syntaxTree.children.length; i++) {
            newTree.children.push(ShallowCopySyntaxTree(syntaxTree.children[i], newTree));
        }

        return newTree;
    }

    export function isNullUndefinedOrWhitespace(s: string): boolean {
        return typeof s === 'undefined' || s === null || !/\S/.test(s);
    }
} 