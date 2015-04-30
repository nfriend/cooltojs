module CoolToJS.AST {
    'use strict';

    export enum NodeType {
        Program,
        Class,
        Property,
        Method,
        Expression,
        BlockExpression,
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
    }

    export class ClassNode extends Node {
        constructor(className: string) {
            this.className = className;
            super(NodeType.Class);
        }

        className: string;
    }
} 