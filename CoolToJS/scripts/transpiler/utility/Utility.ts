﻿module CoolToJS.Utility {

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
        abortMethodNode.returnTypeName = 'Object';
        abortMethodNode.parent = objectClass;
        objectClass.children.push(abortMethodNode);

        var typeNameMethodNode = new MethodNode();
        typeNameMethodNode.methodName = 'type_name';
        typeNameMethodNode.returnTypeName = 'String';
        typeNameMethodNode.parent = objectClass;
        objectClass.children.push(typeNameMethodNode);

        var copyMethodNode = new MethodNode();
        copyMethodNode.methodName = 'copy';
        copyMethodNode.returnTypeName = 'SELF_TYPE';
        copyMethodNode.parent = objectClass;
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
        outStringMethodNode.parent = ioClass;
        ioClass.children.push(outStringMethodNode);

        var outIntMethodNode = new MethodNode();
        outIntMethodNode.methodName = 'out_int';
        outIntMethodNode.returnTypeName = 'SELF_TYPE';
        outIntMethodNode.parameters.push({
            parameterName: 'x',
            parameterTypeName: 'Int'
        });
        outIntMethodNode.parent = ioClass;
        ioClass.children.push(outIntMethodNode);

        var inStringMethodNode = new MethodNode();
        inStringMethodNode.methodName = 'in_string';
        inStringMethodNode.returnTypeName = 'String';
        inStringMethodNode.isAsync = true;
        inStringMethodNode.isInStringOrInInt = true;
        inStringMethodNode.parent = ioClass;
        ioClass.children.push(inStringMethodNode);

        var inIntMethodNode = new MethodNode();
        inIntMethodNode.methodName = 'in_int';
        inIntMethodNode.returnTypeName = 'Int';
        inIntMethodNode.isAsync = true;
        inIntMethodNode.isInStringOrInInt = true;
        inIntMethodNode.parent = ioClass;
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
        lengthMethodNode.parent = stringClass;
        stringClass.children.push(lengthMethodNode);

        var concatMethodNode = new MethodNode();
        concatMethodNode.methodName = 'concat';
        concatMethodNode.returnTypeName = 'String';
        concatMethodNode.parameters.push({
            parameterName: 's',
            parameterTypeName: 'String'
        });
        concatMethodNode.parent = stringClass;
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
        stringClass.parent = stringClass;
        stringClass.children.push(substrMethodNode);

        programNode.children.push(stringClass);

        // Bool
        var boolClass = new ClassNode('Bool');
        programNode.children.push(boolClass);
    }

    export function getFunctionDetails(func): { body: string; parameters: Array<string> } {
        return {
            body: getFunctionBody(func),
            parameters: getFunctionParameters(func)
        }
    }

    export function getFunctionBody(func): string {
        return func.toString().slice(func.toString().indexOf("{") + 1, func.toString().lastIndexOf("}"));
    }

    var stripComments = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var argumentNames = /([^\s,]+)/g;
    export function getFunctionParameters(func): Array<string> {
        var fnStr = func.toString().replace(stripComments, '');
        var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(argumentNames);
        if (result === null)
            result = [];
        return result;
    }

    var reserved = [
        'break', 'case', 'class', 'catch', 'const', 'continue', 'debugger', 'default', 'delete',
        'do', 'else', 'export', 'extends', 'finally', 'for', 'function', 'if', 'import', 'in',
        'instanceof', 'let', 'new', 'return', 'super', 'switch', 'this', 'throw', 'try', 'typeof',
        'var', 'void', 'while', 'with', 'yield', 'enum', 'await', 'implements', 'package', 'protected',
        'static', 'interface', 'private', 'public', 'abstract', 'boolean', 'byte', 'char', 'double',
        'final', 'float', 'goto', 'int', 'long', 'native', 'short', 'synchronized', 'transient',
        'volatile', 'null'
    ];
    export function escapeIfReserved(id: string): string {
        if (reserved.indexOf(id.toLowerCase()) !== -1) {
            return '__' + id;
        } else {
            return id;
        }
    }

    export var baseObjectClass = "\
class _Object {\n\
    constructor(typeName) {\n\
        this._type_name = typeName;\n\
    }\n\
    \n\
    abort() {\n\
        throw 'Abort called from class ' + this.type_name()._value;\n\
    }\n\
    type_name() {\n\
        return new _String(this._type_name);\n\
    }\n\
    copy() {\n\
        var copiedObject = Object.create(this.constructor);\n\
        for (var prop in this) {\n\
            copiedObject[prop] = this[prop];\n\
        }\n\
        return copiedObject;\n\
    }\n\
}\n\n";

    export var baseStringClass = '\
class _String extends _Object {\n\
    constructor (_stringValue) {\n\
        super(\"String\");\n\
        this._value = _stringValue;\n\
    }\n\
    _value;\n\
    length() {\n\
        return new _Int(this._value.length);\n\
    }\n\
    concat(_otherString) {\n\
        return new _String(this._value.concat(_otherString._value));\n\
    }\n\
    substr(_start, _length) {\n\
        if ((this._value.length === 0 && _start._value !== 0)\n\
            || (this._value.length !== 0 && _start._value > this._value.length - 1)) {\n\
\n\
            throw "Index provided to substr (" + _start._value + ") is too big (string is of length " + this._value.length + ")";\n\
        } else if ((this._value.length === 0 && _length._value !== 0)\n\
                   || (this._value.length !== 0 && _length._value > this._value.length - _start._value)) {\n\
\n\
            throw "Start index (" + _start._value + ") + length (" + _length._value + ") provided to substr is too long (string is of length " + this._value.length + ")";\n\
        }\n\
        return new _String(this._value.substr(_start._value, _length._value));\n\
    }\n\
}\n\n';

    export var baseIntClass = "\
class _Int extends _Object {\n\
    constructor (_intValue) {\n\
        super(\"Int\");\n\
        this._value = _intValue;\n\
    }\n\
    _value;\n\
}\n\n";

    export var baseBoolClass = "\
class _Bool extends _Object {\n\
    constructor (_boolValue) {\n\
        super(\"Bool\");\n\
        this._value = _boolValue;\n\
    }\n\
    _value;\n\
}\n\n";

    export var baseObjectClasses = [
        baseObjectClass, baseStringClass, baseIntClass, baseBoolClass
    ];

    export var binaryOperationFunctions = [
        { operation: BinaryOperationType.Addition, func: '_add = (a, b) => { return new _Int(a._value + b._value); }' },
        { operation: BinaryOperationType.Subtraction, func: '_subtract = (a, b) => { return new _Int(a._value - b._value); }' },
        { operation: BinaryOperationType.Division, func: '_divide = (a, b) => { return new _Int(Math.floor(a._value / b._value)); }' },
        { operation: BinaryOperationType.Multiplication, func: '_multiply = (a, b) => { return new _Int(a._value * b._value); }' },
        { operation: BinaryOperationType.LessThan, func: '_lessThan = (a, b) => { return new _Bool(a._value < b._value); }' },
        { operation: BinaryOperationType.LessThanOrEqualTo, func: '_lessThanOrEqualTo = (a, b) => { return new _Bool(a._value <= b._value); }' },
        { operation: BinaryOperationType.Comparison, func: '_equals = (a, b) => {\n\        if (!a || !b || typeof a._value === "undefined" || typeof b._value === "undefined") {\n\            return new _Bool(a === b);\n\        } else {\n\            return new _Bool(a._value === b._value);\n\        }\n\    }' },
    ];

    export var unaryOperationFunctions = [
        { operation: UnaryOperationType.Complement, func: '_complement = (a) => { return new _Int(-1 * a._value); }' },
        { operation: UnaryOperationType.Not, func: '_not = (a) => { return new _Bool(!a._value); }' },
    ];

    export var getCaseFunction = (isAsync: boolean): string => {
        if (isAsync) {
            var funcString = '_asyncCase = function *(obj, branches, thisObj, currentTypeName) {\n';
        } else {
            var funcString = '_case = (obj, branches, thisObj, currentTypeName) => {\n';
        }

        funcString += '\
        if (obj === null || typeof obj === "undefined") {\n\
            throw "Match on void in case statement";\n\
        }\n\
        let firstRound = branches.filter(branch => {\n\
            return obj instanceof branch[0]; \n\
        });\n\
        if (firstRound.length === 0) {\n\
            throw "No match in case statement for class " + currentTypeName;\n\
        } else if (firstRound.length === 1) {\n';

        if (isAsync) {
            funcString += '            return yield * firstRound[0][1].call(thisObj, obj);\n';
        } else {
            funcString += '            return firstRound[0][1].call(thisObj, obj);\n';
        }

        funcString += '\
        } else {\n\
            let nextRound = firstRound,\n\
                currentRound,\n\
                eliminatedBranches;\n\
            while (nextRound.length !== 0) {\n\
                eliminatedBranches = [];\n\
                currentRound = nextRound.map(branch => {\n\
                    return [Object.getPrototypeOf(branch[0]), branch[1]];\n\
                }).filter(branch => {\n\
                    if (branch[0].prototype && obj instanceof branch[0]) {\n\
                        return true;\n\
                    } else {\n\
                        eliminatedBranches.push(branch);\n\
                    }\n\
                });\n\
                nextRound = currentRound;\n\
            }\n\
            if (eliminatedBranches.length !== 1) {\n\
                throw "Invalid state: Case statement matched more than one branch";\n\
            }\n';
        if (isAsync) {
            funcString += '            return yield* eliminatedBranches[0][1].call(thisObj, obj);\n';
        } else {
            funcString += '            return eliminatedBranches[0][1].call(thisObj, obj);\n';
        }

        funcString += '\
        }\n\
    }';

        return funcString;
    }
} 