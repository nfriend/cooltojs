module CoolToJS.AST {
    'use strict';

    export enum NodeType {
        Program = 0,
        Class = 1,
        Property = 2,
        Method = 3,
        AssignmentExpression = 4,
        MethodCallExpression = 5,
        IfThenElseExpression = 6,
        WhileExpression = 7,
        BlockExpression = 8,
        LetExpression = 9,
        CaseExpression = 10,
        NewExpression = 11,
        IsvoidExpression = 12,
        BinaryOperationExpression = 13,
        UnaryOperationExpression = 14,
        ParantheticalExpression = 15,
        ObjectIdentifierExpression = 16,
        IntegerLiteralExpression = 17,
        StringLiteralExpression = 18,
        TrueKeywordExpression = 19,
        FalseKeywordExpression = 20
    }

    export class Node {
        constructor(type: NodeType) {
            this.type = type;
            this.children = [];
            this.nodeTypeName = NodeType[this.type];
        }

        type: NodeType;

        // for debugging
        nodeTypeName: string;

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

        get propertyList(): Array<PropertyNode> {
            var propertyList: Array<PropertyNode> = [];
            for (var i = 0; i < this.children.length; i++) {
                if (this.children[i].type === NodeType.Property) {
                    propertyList.push(<PropertyNode>this.children[i]);
                }
            }
            return <Array<PropertyNode>>propertyList;
        }

        set propertyList(propertyList: Array<PropertyNode>) {
            throw 'Setter for ClassNode.propertyList not yet implemented';
        }

        get merthodList(): Array<MethodNode> {
            var methodNode: Array<MethodNode> = [];
            for (var i = 0; i < this.children.length; i++) {
                if (this.children[i].type === NodeType.Method) {
                    methodNode.push(<MethodNode>this.children[i]);
                }
            }
            return <Array<MethodNode>>methodNode;
        }

        set merthodList(methodList: Array<MethodNode>) {
            throw 'Setter for ClassNode.methodList not yet implemented';
        }

        get isSubClass(): boolean {
            return Utility.isNullUndefinedOrWhitespace(this.superClassName);
        }
    }

    export class MethodNode extends Node {
        constructor(methodName: string) {
            super(NodeType.Method);
            this.methodName = methodName;
        }

        methodName: string;
        returnTypeName: string;
        parameters: Array<{ parameterName: string; parameterTypeName: string }> = [];

        get hasParameters(): boolean {
            return this.parameters.length > 0;
        }

        get methodBodyExpression(): ExpressionNode {
            return <ExpressionNode>this.children[0];
        }

        set methodBodyExpression(methodBodyExpression: ExpressionNode) {
            this.children[0] = methodBodyExpression;
        }
    }

    export class PropertyNode extends Node {
        constructor(propertyName: string) {
            super(NodeType.Property);
            this.propertyName = propertyName;
        }

        propertyName: string;
        typeName: string;

        get propertyInitializerExpression(): ExpressionNode {
            return <ExpressionNode>this.children[0];
        }

        set propertyInitializerExpression(propertyInitializerExpression: ExpressionNode) {
            this.children[0] = propertyInitializerExpression;
        }
    }

    export class ExpressionNode extends Node {
        constructor(expressionType: NodeType) {
            super(expressionType);
        }
    }

    export class AssignmentExpressionNode extends ExpressionNode {
        constructor() {
            super(NodeType.AssignmentExpression);
        }

        identifierName: string;

        get assignmentExpression(): ExpressionNode {
            return <ExpressionNode>this.children[0];
        }

        set assignmentExpression(assignmentExpression: ExpressionNode) {
            this.children[0] = assignmentExpression;
        }
    }

    export class MethodCallExpressionNode extends ExpressionNode {
        constructor() {
            super(NodeType.MethodCallExpression);
        }

        methodName: string;
        isCallToParent: boolean = false;
        isCallToSelf: boolean = false;

        get parameterExpressionList(): Array<ExpressionNode> {
            return <Array<ExpressionNode>>this.children;
        }

        set parameterExpressionList(expressions: Array<ExpressionNode>) {
            throw 'Setter for MethodCallExpressionNode.parameterExpressionList not yet implemented';
        }
    }
} 