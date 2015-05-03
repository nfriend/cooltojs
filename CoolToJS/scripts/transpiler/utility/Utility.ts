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

    // from http://stackoverflow.com/a/11616993/1063392
    export function stringify(ast: Node): string {
        var cache = [];
        var returnVal = JSON.stringify(ast, function (key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // Circular reference found, discard key
                    return;
                }
                // Store value in our collection
                cache.push(value);
            }
            return value;
        }, 2);
        cache = null; // Enable garbage collection

        return returnVal;
    }

    // adds the implied classes (Object, IO, Integer, etc.)
    // to our program node's class list
    export function addBuiltinObjects(programNode: ProgramNode): void {

        // Object class
        var objectClass = new ClassNode('Object');

        var abortMethodNode = new MethodNode();
        abortMethodNode.methodName = 'abort';
        abortMethodNode.returnTypeName = 'Object'
        objectClass.children.push(abortMethodNode);

        var typeNameMethodNode = new MethodNode();
        typeNameMethodNode.methodName = 'type_name';
        typeNameMethodNode.returnTypeName = 'String'
        objectClass.children.push(typeNameMethodNode);

        var copyMethodNode = new MethodNode();
        copyMethodNode.methodName = 'copy';
        copyMethodNode.returnTypeName = 'SELF_TYPE'
        objectClass.children.push(copyMethodNode);

        programNode.children.push(objectClass);

        // IO Class
        var ioClass = new ClassNode('IO');

        var outStringMethodNode = new MethodNode();
        outStringMethodNode.methodName = 'out_string';
        outStringMethodNode.returnTypeName = 'SELF_TYPE';
        outStringMethodNode.parameters.push({
            parameterName: 'x',
            parameterTypeName: 'String'
        });
        ioClass.children.push(outStringMethodNode);

        var outIntMethodNode = new MethodNode();
        outIntMethodNode.methodName = 'out_int';
        outIntMethodNode.returnTypeName = 'SELF_TYPE';
        outIntMethodNode.parameters.push({
            parameterName: 'x',
            parameterTypeName: 'Int'
        });
        ioClass.children.push(outIntMethodNode);

        var inStringMethodNode = new MethodNode();
        inStringMethodNode.methodName = 'in_string';
        inStringMethodNode.returnTypeName = 'String';
        ioClass.children.push(inStringMethodNode);

        var inIntMethodNode = new MethodNode();
        inIntMethodNode.methodName = 'in_int';
        inIntMethodNode.returnTypeName = 'Int';
        ioClass.children.push(inIntMethodNode);

        programNode.children.push(ioClass);

        // Int
        var intClass = new ClassNode('Int');
        programNode.children.push(intClass);

        // String
        var stringClass = new ClassNode('String');

        var lengthMethodNode = new MethodNode();
        lengthMethodNode.methodName = 'length';
        lengthMethodNode.returnTypeName = 'Int';
        stringClass.children.push(lengthMethodNode);

        var concatMethodNode = new MethodNode();
        concatMethodNode.methodName = 'concat';
        concatMethodNode.returnTypeName = 'String';
        concatMethodNode.parameters.push({
            parameterName: 's',
            parameterTypeName: 'String'
        });
        stringClass.children.push(concatMethodNode);

        var substrMethodNode = new MethodNode();
        substrMethodNode.methodName = 'substr';
        substrMethodNode.returnTypeName = 'String';
        substrMethodNode.parameters.push({
            parameterName: 'i',
            parameterTypeName: 'Int'
        });
        substrMethodNode.parameters.push({
            parameterName: 'l',
            parameterTypeName: 'Int'
        });
        stringClass.children.push(substrMethodNode);

        programNode.children.push(stringClass);

        // Bool
        var boolClass = new ClassNode('Bool');
        programNode.children.push(boolClass);
    }
} 