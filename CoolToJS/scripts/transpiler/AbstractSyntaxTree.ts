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
        type: NodeType;
        sourcelocation: SourceLocation;
        children: Array<Node> = [];
        parent: Node;
    }
} 