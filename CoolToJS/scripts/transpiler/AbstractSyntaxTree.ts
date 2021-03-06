﻿module CoolToJS {

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
        LocalVariableDeclaration = 10,
        CaseExpression = 11,
        CaseOption = 12,
        NewExpression = 13,
        IsvoidExpression = 14,
        BinaryOperationExpression = 15,
        UnaryOperationExpression = 16,
        ParentheticalExpression = 17,
        SelfExpression = 18,
        ObjectIdentifierExpression = 19,
        IntegerLiteralExpression = 20,
        StringLiteralExpression = 21,
        TrueKeywordExpression = 22,
        FalseKeywordExpression = 23
    }

    export enum BinaryOperationType {
        Addition = 0,
        Subtraction = 1,
        Division = 2,
        Multiplication = 3,
        LessThan = 4,
        LessThanOrEqualTo = 5,
        Comparison = 6,
    }

    export enum UnaryOperationType {
        Complement = 0,
        Not = 1,
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
        token: Token;
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
            super(NodeType.Class);
            this.className = className;
        }

        className: string;
        superClassName: string;
        isAsync: boolean = false;
        calls: Array<MethodNode|PropertyNode|ClassNode> = [];
        calledBy: Array<MethodNode|PropertyNode> = [];

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

        get methodList(): Array<MethodNode> {
            var methodNode: Array<MethodNode> = [];
            for (var i = 0; i < this.children.length; i++) {
                if (this.children[i].type === NodeType.Method) {
                    methodNode.push(<MethodNode>this.children[i]);
                }
            }
            return <Array<MethodNode>>methodNode;
        }

        set methodList(methodList: Array<MethodNode>) {
            throw 'Setter for ClassNode.methodList not yet implemented';
        }

        get isSubClass(): boolean {
            return !Utility.isNullUndefinedOrWhitespace(this.superClassName);
        }
    }

    export class MethodNode extends Node {
        constructor() {
            super(NodeType.Method);
        }

        methodName: string;
        returnTypeName: string;
        parameters: Array<{ parameterName: string; parameterTypeName: string }> = [];
        isAsync: boolean = false;
        isInStringOrInInt: boolean = false;
        isUsed: boolean = false;
        calls: Array<MethodNode|PropertyNode|ClassNode> = [];
        calledBy: Array<MethodNode|PropertyNode> = [];

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
        constructor() {
            super(NodeType.Property);
        }

        propertyName: string;
        typeName: string;
        isUsed: boolean = false;
        isAsync: boolean = false;
        calls: Array<MethodNode|PropertyNode|ClassNode> = [];
        calledBy: Array<MethodNode|PropertyNode> = [];

        get hasInitializer(): boolean {
            return typeof this.propertyInitializerExpression !== 'undefined'
        }

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
        isAssignmentToSelfVariable: boolean = false;

        get assignmentExpression(): ExpressionNode {
            return this.children[0];
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
        explicitParentCallTypeName: string;
        isCallToSelf: boolean = false;
        targetExpression: ExpressionNode;
        method: MethodNode;
        isInStringOrInInt: boolean = false;

        get parameterExpressionList(): Array<ExpressionNode> {
            return this.children;
        }

        set parameterExpressionList(expressions: Array<ExpressionNode>) {
            throw 'Setter for MethodCallExpressionNode.parameterExpressionList not yet implemented';
        }
    }

    export class IfThenElseExpressionNode extends ExpressionNode {
        constructor() {
            super(NodeType.IfThenElseExpression);
        }

        get predicate(): ExpressionNode {
            return this.children[0];
        }

        set predicate(predicate: ExpressionNode) {
            this.children[0] = predicate;
        }

        get consequent(): ExpressionNode {
            return this.children[1];
        }

        set consequent(consequent: ExpressionNode) {
            this.children[1] = consequent;
        }

        get alternative(): ExpressionNode {
            return this.children[2];
        }

        set alternative(alternative: ExpressionNode) {
            this.children[2] = alternative;
        }
    }

    export class WhileExpressionNode extends ExpressionNode {
        constructor() {
            super(NodeType.WhileExpression);
        }

        get whileConditionExpression(): ExpressionNode {
            return this.children[0];
        }

        set whileConditionExpression(conditionExpression: ExpressionNode) {
            this.children[0] = conditionExpression;
        }

        get whileBodyExpression(): ExpressionNode {
            return this.children[1];
        }

        set whileBodyExpression(bodyExpression: ExpressionNode) {
            this.children[1] = bodyExpression;
        }
    }

    export class BlockExpressionNode extends ExpressionNode {
        constructor() {
            super(NodeType.BlockExpression);
        }

        get expressionList(): Array<ExpressionNode> {
            return this.children;
        }

        set expressionList(expressions: Array<ExpressionNode>) {
            throw 'Setter for BlockExpressionNode.expressionList not yet implemented';
        }
    }

    export class LetExpressionNode extends ExpressionNode {
        constructor() {
            super(NodeType.LetExpression);
        }

        localVariableDeclarations: Array<LocalVariableDeclarationNode> = [];

        get letBodyExpression(): ExpressionNode {
            return this.children[0];
        }

        set letBodyExpression(bodyExpression: ExpressionNode) {
            this.children[0] = bodyExpression;
        }
    }

    export class LocalVariableDeclarationNode extends Node {
        constructor() {
            super(NodeType.LocalVariableDeclaration);
        }

        identifierName: string
        typeName: string;

        get initializerExpression(): ExpressionNode {
            return this.children[0];
        }

        set initializerExpression(initializer: ExpressionNode) {
            this.children[0] = initializer;
        }
    }

    export class CaseExpressionNode extends ExpressionNode {
        constructor() {
            super(NodeType.CaseExpression);
        }

        condition: ExpressionNode;

        get caseOptionList(): Array<CaseOptionNode> {
            return <Array<CaseOptionNode>>this.children;
        }

        set caseOptionList(optionsList: Array<CaseOptionNode>) {
            throw 'Setter for CaseExpressionNode.caseOptionList not yet implemented';
        }
    }

    export class CaseOptionNode extends Node {
        constructor() {
            super(NodeType.CaseOption);
        }

        identiferName: string;
        typeName: string;

        get caseOptionExpression(): ExpressionNode {
            return this.children[0];
        }

        set caseOptionExpression(expression: ExpressionNode){
            this.children[0] = expression;
        }
    }

    export class NewExpressionNode extends ExpressionNode {
        constructor() {
            super(NodeType.NewExpression);
        }

        typeName: string;
        classNode: ClassNode;
    }

    export class IsVoidExpressionNode extends ExpressionNode {
        constructor() {
            super(NodeType.IsvoidExpression);
        }

        get isVoidCondition(): ExpressionNode {
            return this.children[0];
        }

        set isVoidCondition(condition: ExpressionNode) {
            this.children[0] = condition;
        }
    }

    export class BinaryOperationExpressionNode extends ExpressionNode {
        constructor() {
            super(NodeType.BinaryOperationExpression);
        }

        operationType: BinaryOperationType;

        get operand1(): ExpressionNode {
            return this.children[0];
        }

        set operand1(operand: ExpressionNode) {
            this.children[0] = operand;
        }

        get operand2(): ExpressionNode {
            return this.children[1];
        }

        set operand2(operand: ExpressionNode) {
            this.children[1] = operand;
        }
    }

    export class UnaryOperationExpressionNode extends ExpressionNode {
        constructor() {
            super(NodeType.UnaryOperationExpression);
        }

        operationType: UnaryOperationType;

        get operand(): ExpressionNode {
            return this.children[0];
        }

        set operand(operand: ExpressionNode) {
            this.children[0] = operand;
        }
    }

    export class ParentheticalExpressionNode extends ExpressionNode {
        constructor() {
            super(NodeType.ParentheticalExpression);
        }

        get innerExpression(): ExpressionNode {
            return this.children[0];
        }

        set innerExpression(inner: ExpressionNode) {
            this.children[0] = inner;
        }
    }

    export class SelfExpressionNode extends ExpressionNode {
        constructor() {
            super(NodeType.SelfExpression);
        }
    }

    export class ObjectIdentifierExpressionNode extends ExpressionNode {
        constructor() {
            super(NodeType.ObjectIdentifierExpression);
        }
        isCallToSelf: boolean = false;

        objectIdentifierName: string;
    }


    export class IntegerLiteralExpressionNode extends ExpressionNode {
        constructor() {
            super(NodeType.IntegerLiteralExpression);
        }

        value: number;
    }

    export class StringLiteralExpressionNode extends ExpressionNode {
        constructor() {
            super(NodeType.StringLiteralExpression);
        }

        value: string;
    }

    export class TrueKeywordExpressionNode extends ExpressionNode {
        constructor() {
            super(NodeType.TrueKeywordExpression);
        }
    }

    export class FalseKeywordExpressionNode extends ExpressionNode {
        constructor() {
            super(NodeType.FalseKeywordExpression);
        }
    }
} 