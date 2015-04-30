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
} 