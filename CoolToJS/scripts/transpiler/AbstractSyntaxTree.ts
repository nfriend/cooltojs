module CoolToJS.AST {
    'use strict';

    export enum NodeType {
        Program = 0,
        Class = 1,
        Property = 2,
        Method = 3,
        Expression = 4,
        BlockExpression = 5,
    }

    export class Node {
        constructor(type: NodeType) {
            this.type = type;
            this.children = [];
        }

        type: NodeType;
        sourceLocation: SourceLocation;
        children: Array<Node>;
        parent: Node;
    }

    export class ProgramNode extends Node {
        constructor() {
            super(NodeType.Program);
        }

        get classList(): Array<ClassNode> {
            return <Array<ClassNode>>this.children;
        }
        set classList(classList: Array<ClassNode>) {
            this.children = classList;
        }
    }

    export class ClassNode extends Node {
        constructor(className: string) {
            this.className = className;
            super(NodeType.Class);
        }

        className: string;
        superClassName: string;

        get isSubClass(): boolean {
            return Utility.isNullUndefinedOrWhitespace(this.superClassName);
        }
    }

    export class MethodNode extends Node {
        constructor() {
            super(NodeType.Method);
        }
    }
} 