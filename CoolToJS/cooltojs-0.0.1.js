var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CoolToJS;
(function (CoolToJS) {
    'use strict';
    (function (NodeType) {
        NodeType[NodeType["Program"] = 0] = "Program";
        NodeType[NodeType["Class"] = 1] = "Class";
        NodeType[NodeType["Property"] = 2] = "Property";
        NodeType[NodeType["Method"] = 3] = "Method";
        NodeType[NodeType["AssignmentExpression"] = 4] = "AssignmentExpression";
        NodeType[NodeType["MethodCallExpression"] = 5] = "MethodCallExpression";
        NodeType[NodeType["IfThenElseExpression"] = 6] = "IfThenElseExpression";
        NodeType[NodeType["WhileExpression"] = 7] = "WhileExpression";
        NodeType[NodeType["BlockExpression"] = 8] = "BlockExpression";
        NodeType[NodeType["LetExpression"] = 9] = "LetExpression";
        NodeType[NodeType["LocalVariableDeclaration"] = 10] = "LocalVariableDeclaration";
        NodeType[NodeType["CaseExpression"] = 11] = "CaseExpression";
        NodeType[NodeType["CaseOption"] = 12] = "CaseOption";
        NodeType[NodeType["NewExpression"] = 13] = "NewExpression";
        NodeType[NodeType["IsvoidExpression"] = 14] = "IsvoidExpression";
        NodeType[NodeType["BinaryOperationExpression"] = 15] = "BinaryOperationExpression";
        NodeType[NodeType["UnaryOperationExpression"] = 16] = "UnaryOperationExpression";
        NodeType[NodeType["ParantheticalExpression"] = 17] = "ParantheticalExpression";
        NodeType[NodeType["ObjectIdentifierExpression"] = 18] = "ObjectIdentifierExpression";
        NodeType[NodeType["IntegerLiteralExpression"] = 19] = "IntegerLiteralExpression";
        NodeType[NodeType["StringLiteralExpression"] = 20] = "StringLiteralExpression";
        NodeType[NodeType["TrueKeywordExpression"] = 21] = "TrueKeywordExpression";
        NodeType[NodeType["FalseKeywordExpression"] = 22] = "FalseKeywordExpression";
    })(CoolToJS.NodeType || (CoolToJS.NodeType = {}));
    var NodeType = CoolToJS.NodeType;
    (function (BinaryOperationType) {
        BinaryOperationType[BinaryOperationType["Addition"] = 0] = "Addition";
        BinaryOperationType[BinaryOperationType["Subtraction"] = 1] = "Subtraction";
        BinaryOperationType[BinaryOperationType["Division"] = 2] = "Division";
        BinaryOperationType[BinaryOperationType["Multiplication"] = 3] = "Multiplication";
        BinaryOperationType[BinaryOperationType["LessThan"] = 4] = "LessThan";
        BinaryOperationType[BinaryOperationType["LessThanOrEqualTo"] = 4] = "LessThanOrEqualTo";
        BinaryOperationType[BinaryOperationType["Comparison"] = 4] = "Comparison";
    })(CoolToJS.BinaryOperationType || (CoolToJS.BinaryOperationType = {}));
    var BinaryOperationType = CoolToJS.BinaryOperationType;
    (function (UnaryOperationType) {
        UnaryOperationType[UnaryOperationType["Complement"] = 0] = "Complement";
        UnaryOperationType[UnaryOperationType["Not"] = 1] = "Not";
    })(CoolToJS.UnaryOperationType || (CoolToJS.UnaryOperationType = {}));
    var UnaryOperationType = CoolToJS.UnaryOperationType;
    var Node = (function () {
        function Node(type) {
            this.type = type;
            this.children = [];
            this.nodeTypeName = NodeType[this.type];
        }
        return Node;
    })();
    CoolToJS.Node = Node;
    var ProgramNode = (function (_super) {
        __extends(ProgramNode, _super);
        function ProgramNode() {
            _super.call(this, 0 /* Program */);
        }
        Object.defineProperty(ProgramNode.prototype, "classList", {
            get: function () {
                return this.children;
            },
            set: function (classList) {
                this.children = classList;
            },
            enumerable: true,
            configurable: true
        });
        return ProgramNode;
    })(Node);
    CoolToJS.ProgramNode = ProgramNode;
    var ClassNode = (function (_super) {
        __extends(ClassNode, _super);
        function ClassNode(className) {
            this.className = className;
            _super.call(this, 1 /* Class */);
        }
        Object.defineProperty(ClassNode.prototype, "propertyList", {
            get: function () {
                var propertyList = [];
                for (var i = 0; i < this.children.length; i++) {
                    if (this.children[i].type === 2 /* Property */) {
                        propertyList.push(this.children[i]);
                    }
                }
                return propertyList;
            },
            set: function (propertyList) {
                throw 'Setter for ClassNode.propertyList not yet implemented';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClassNode.prototype, "methodList", {
            get: function () {
                var methodNode = [];
                for (var i = 0; i < this.children.length; i++) {
                    if (this.children[i].type === 3 /* Method */) {
                        methodNode.push(this.children[i]);
                    }
                }
                return methodNode;
            },
            set: function (methodList) {
                throw 'Setter for ClassNode.methodList not yet implemented';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClassNode.prototype, "isSubClass", {
            get: function () {
                return CoolToJS.Utility.isNullUndefinedOrWhitespace(this.superClassName);
            },
            enumerable: true,
            configurable: true
        });
        return ClassNode;
    })(Node);
    CoolToJS.ClassNode = ClassNode;
    var MethodNode = (function (_super) {
        __extends(MethodNode, _super);
        function MethodNode() {
            _super.call(this, 3 /* Method */);
            this.parameters = [];
        }
        Object.defineProperty(MethodNode.prototype, "hasParameters", {
            get: function () {
                return this.parameters.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MethodNode.prototype, "methodBodyExpression", {
            get: function () {
                return this.children[0];
            },
            set: function (methodBodyExpression) {
                this.children[0] = methodBodyExpression;
            },
            enumerable: true,
            configurable: true
        });
        return MethodNode;
    })(Node);
    CoolToJS.MethodNode = MethodNode;
    var PropertyNode = (function (_super) {
        __extends(PropertyNode, _super);
        function PropertyNode() {
            _super.call(this, 2 /* Property */);
        }
        Object.defineProperty(PropertyNode.prototype, "hasInitializer", {
            get: function () {
                return typeof this.propertyInitializerExpression !== 'undefined';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertyNode.prototype, "propertyInitializerExpression", {
            get: function () {
                return this.children[0];
            },
            set: function (propertyInitializerExpression) {
                this.children[0] = propertyInitializerExpression;
            },
            enumerable: true,
            configurable: true
        });
        return PropertyNode;
    })(Node);
    CoolToJS.PropertyNode = PropertyNode;
    var ExpressionNode = (function (_super) {
        __extends(ExpressionNode, _super);
        function ExpressionNode(expressionType) {
            _super.call(this, expressionType);
        }
        return ExpressionNode;
    })(Node);
    CoolToJS.ExpressionNode = ExpressionNode;
    var AssignmentExpressionNode = (function (_super) {
        __extends(AssignmentExpressionNode, _super);
        function AssignmentExpressionNode() {
            _super.call(this, 4 /* AssignmentExpression */);
        }
        Object.defineProperty(AssignmentExpressionNode.prototype, "assignmentExpression", {
            get: function () {
                return this.children[0];
            },
            set: function (assignmentExpression) {
                this.children[0] = assignmentExpression;
            },
            enumerable: true,
            configurable: true
        });
        return AssignmentExpressionNode;
    })(ExpressionNode);
    CoolToJS.AssignmentExpressionNode = AssignmentExpressionNode;
    var MethodCallExpressionNode = (function (_super) {
        __extends(MethodCallExpressionNode, _super);
        function MethodCallExpressionNode() {
            _super.call(this, 5 /* MethodCallExpression */);
            this.isCallToParent = false;
            this.isCallToSelf = false;
        }
        Object.defineProperty(MethodCallExpressionNode.prototype, "parameterExpressionList", {
            get: function () {
                return this.children;
            },
            set: function (expressions) {
                throw 'Setter for MethodCallExpressionNode.parameterExpressionList not yet implemented';
            },
            enumerable: true,
            configurable: true
        });
        return MethodCallExpressionNode;
    })(ExpressionNode);
    CoolToJS.MethodCallExpressionNode = MethodCallExpressionNode;
    var IfThenElseExpressionNode = (function (_super) {
        __extends(IfThenElseExpressionNode, _super);
        function IfThenElseExpressionNode() {
            _super.call(this, 6 /* IfThenElseExpression */);
        }
        Object.defineProperty(IfThenElseExpressionNode.prototype, "predicate", {
            get: function () {
                return this.children[0];
            },
            set: function (predicate) {
                this.children[0] = predicate;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IfThenElseExpressionNode.prototype, "consequent", {
            get: function () {
                return this.children[0];
            },
            set: function (consequent) {
                this.children[0] = consequent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IfThenElseExpressionNode.prototype, "alternative", {
            get: function () {
                return this.children[0];
            },
            set: function (alternative) {
                this.children[0] = alternative;
            },
            enumerable: true,
            configurable: true
        });
        return IfThenElseExpressionNode;
    })(ExpressionNode);
    CoolToJS.IfThenElseExpressionNode = IfThenElseExpressionNode;
    var WhileExpressionNode = (function (_super) {
        __extends(WhileExpressionNode, _super);
        function WhileExpressionNode() {
            _super.call(this, 7 /* WhileExpression */);
        }
        Object.defineProperty(WhileExpressionNode.prototype, "whileConditionExpression", {
            get: function () {
                return this.children[0];
            },
            set: function (conditionExpression) {
                this.children[0] = conditionExpression;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WhileExpressionNode.prototype, "whileBodyExpression", {
            get: function () {
                return this.children[1];
            },
            set: function (bodyExpression) {
                this.children[1] = bodyExpression;
            },
            enumerable: true,
            configurable: true
        });
        return WhileExpressionNode;
    })(ExpressionNode);
    CoolToJS.WhileExpressionNode = WhileExpressionNode;
    var BlockExpressionNode = (function (_super) {
        __extends(BlockExpressionNode, _super);
        function BlockExpressionNode() {
            _super.call(this, 8 /* BlockExpression */);
        }
        Object.defineProperty(BlockExpressionNode.prototype, "expressionList", {
            get: function () {
                return this.children;
            },
            set: function (expressions) {
                throw 'Setter for BlockExpressionNode.expressionList not yet implemented';
            },
            enumerable: true,
            configurable: true
        });
        return BlockExpressionNode;
    })(ExpressionNode);
    CoolToJS.BlockExpressionNode = BlockExpressionNode;
    var LetExpressionNode = (function (_super) {
        __extends(LetExpressionNode, _super);
        function LetExpressionNode() {
            _super.call(this, 9 /* LetExpression */);
            this.localVariableDeclarations = [];
        }
        Object.defineProperty(LetExpressionNode.prototype, "letBodyExpression", {
            get: function () {
                return this.children[0];
            },
            set: function (bodyExpression) {
                this.children[0] = bodyExpression;
            },
            enumerable: true,
            configurable: true
        });
        return LetExpressionNode;
    })(ExpressionNode);
    CoolToJS.LetExpressionNode = LetExpressionNode;
    var LocalVariableDeclarationNode = (function (_super) {
        __extends(LocalVariableDeclarationNode, _super);
        function LocalVariableDeclarationNode() {
            _super.call(this, 10 /* LocalVariableDeclaration */);
        }
        Object.defineProperty(LocalVariableDeclarationNode.prototype, "initializerExpression", {
            get: function () {
                return this.children[0];
            },
            set: function (initializer) {
                this.children[0] = initializer;
            },
            enumerable: true,
            configurable: true
        });
        return LocalVariableDeclarationNode;
    })(Node);
    CoolToJS.LocalVariableDeclarationNode = LocalVariableDeclarationNode;
    var CaseExpressionNode = (function (_super) {
        __extends(CaseExpressionNode, _super);
        function CaseExpressionNode() {
            _super.call(this, 11 /* CaseExpression */);
        }
        Object.defineProperty(CaseExpressionNode.prototype, "caseOptionList", {
            get: function () {
                return this.children;
            },
            set: function (optionsList) {
                throw 'Setter for CaseExpressionNode.caseOptionList not yet implemented';
            },
            enumerable: true,
            configurable: true
        });
        return CaseExpressionNode;
    })(ExpressionNode);
    CoolToJS.CaseExpressionNode = CaseExpressionNode;
    var CaseOptionNode = (function (_super) {
        __extends(CaseOptionNode, _super);
        function CaseOptionNode() {
            _super.call(this, 12 /* CaseOption */);
        }
        return CaseOptionNode;
    })(Node);
    CoolToJS.CaseOptionNode = CaseOptionNode;
    var NewExpressionNode = (function (_super) {
        __extends(NewExpressionNode, _super);
        function NewExpressionNode() {
            _super.call(this, 13 /* NewExpression */);
        }
        return NewExpressionNode;
    })(ExpressionNode);
    CoolToJS.NewExpressionNode = NewExpressionNode;
    var IsVoidExpressionNode = (function (_super) {
        __extends(IsVoidExpressionNode, _super);
        function IsVoidExpressionNode() {
            _super.call(this, 14 /* IsvoidExpression */);
        }
        Object.defineProperty(IsVoidExpressionNode.prototype, "isVoidCondition", {
            get: function () {
                return this.children[0];
            },
            set: function (condition) {
                this.children[0] = condition;
            },
            enumerable: true,
            configurable: true
        });
        return IsVoidExpressionNode;
    })(ExpressionNode);
    CoolToJS.IsVoidExpressionNode = IsVoidExpressionNode;
    var BinaryOperationExpressionNode = (function (_super) {
        __extends(BinaryOperationExpressionNode, _super);
        function BinaryOperationExpressionNode() {
            _super.call(this, 15 /* BinaryOperationExpression */);
        }
        Object.defineProperty(BinaryOperationExpressionNode.prototype, "operand1", {
            get: function () {
                return this.children[0];
            },
            set: function (operand) {
                this.children[0] = operand;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BinaryOperationExpressionNode.prototype, "operand2", {
            get: function () {
                return this.children[1];
            },
            set: function (operand) {
                this.children[1] = operand;
            },
            enumerable: true,
            configurable: true
        });
        return BinaryOperationExpressionNode;
    })(ExpressionNode);
    CoolToJS.BinaryOperationExpressionNode = BinaryOperationExpressionNode;
    var UnaryOperationExpressionNode = (function (_super) {
        __extends(UnaryOperationExpressionNode, _super);
        function UnaryOperationExpressionNode() {
            _super.call(this, 16 /* UnaryOperationExpression */);
        }
        Object.defineProperty(UnaryOperationExpressionNode.prototype, "operand", {
            get: function () {
                return this.children[0];
            },
            set: function (operand) {
                this.children[0] = operand;
            },
            enumerable: true,
            configurable: true
        });
        return UnaryOperationExpressionNode;
    })(ExpressionNode);
    CoolToJS.UnaryOperationExpressionNode = UnaryOperationExpressionNode;
    var ParantheticalExpressionNode = (function (_super) {
        __extends(ParantheticalExpressionNode, _super);
        function ParantheticalExpressionNode() {
            _super.call(this, 17 /* ParantheticalExpression */);
        }
        Object.defineProperty(ParantheticalExpressionNode.prototype, "innerExpression", {
            get: function () {
                return this.children[0];
            },
            set: function (inner) {
                this.children[0] = inner;
            },
            enumerable: true,
            configurable: true
        });
        return ParantheticalExpressionNode;
    })(ExpressionNode);
    CoolToJS.ParantheticalExpressionNode = ParantheticalExpressionNode;
    var ObjectIdentifierExpressionNode = (function (_super) {
        __extends(ObjectIdentifierExpressionNode, _super);
        function ObjectIdentifierExpressionNode() {
            _super.call(this, 18 /* ObjectIdentifierExpression */);
        }
        return ObjectIdentifierExpressionNode;
    })(ExpressionNode);
    CoolToJS.ObjectIdentifierExpressionNode = ObjectIdentifierExpressionNode;
    var IntegerLiteralExpressionNode = (function (_super) {
        __extends(IntegerLiteralExpressionNode, _super);
        function IntegerLiteralExpressionNode() {
            _super.call(this, 19 /* IntegerLiteralExpression */);
        }
        return IntegerLiteralExpressionNode;
    })(ExpressionNode);
    CoolToJS.IntegerLiteralExpressionNode = IntegerLiteralExpressionNode;
    var StringLiteralExpressionNode = (function (_super) {
        __extends(StringLiteralExpressionNode, _super);
        function StringLiteralExpressionNode() {
            _super.call(this, 20 /* StringLiteralExpression */);
        }
        return StringLiteralExpressionNode;
    })(ExpressionNode);
    CoolToJS.StringLiteralExpressionNode = StringLiteralExpressionNode;
    var TrueKeywordExpressionNode = (function (_super) {
        __extends(TrueKeywordExpressionNode, _super);
        function TrueKeywordExpressionNode() {
            _super.call(this, 21 /* TrueKeywordExpression */);
        }
        return TrueKeywordExpressionNode;
    })(ExpressionNode);
    CoolToJS.TrueKeywordExpressionNode = TrueKeywordExpressionNode;
    var FalseKeywordExpressionNode = (function (_super) {
        __extends(FalseKeywordExpressionNode, _super);
        function FalseKeywordExpressionNode() {
            _super.call(this, 22 /* FalseKeywordExpression */);
        }
        return FalseKeywordExpressionNode;
    })(ExpressionNode);
    CoolToJS.FalseKeywordExpressionNode = FalseKeywordExpressionNode;
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    'use strict';
    var AbstractSyntaxTreeConverter = (function () {
        function AbstractSyntaxTreeConverter() {
            var _this = this;
            this.Convert = function (parserOutput) {
                return {
                    success: true,
                    abstractSyntaxTree: _this.convert(parserOutput.syntaxTree),
                    errorMessages: parserOutput.errorMessages,
                    warningMessages: parserOutput.warningMessages
                };
            };
            this.convert = function (syntaxTree) {
                var convertedNode;
                // use a shallow copy of the provided tree so we
                // don't alter the original
                syntaxTree = CoolToJS.Utility.ShallowCopySyntaxTree(syntaxTree);
                /* PROGRAM */
                if (syntaxTree.syntaxKind === 53 /* Program */) {
                    _this.flattenRecursion(syntaxTree);
                    convertedNode = new CoolToJS.ProgramNode();
                    for (var i = 0; i < syntaxTree.children.length; i++) {
                        if (syntaxTree.children[i].syntaxKind === 44 /* Class */) {
                            var childClassNode = _this.convert(syntaxTree.children[i]);
                            childClassNode.parent = convertedNode;
                            convertedNode.children.push(childClassNode);
                        }
                    }
                }
                else if (syntaxTree.syntaxKind === 44 /* Class */) {
                    var classNode = new CoolToJS.ClassNode(syntaxTree.children[1].token.match);
                    classNode.token = syntaxTree.children[1].token;
                    if (syntaxTree.children[2].syntaxKind === 25 /* InheritsKeyword */) {
                        // if this class is a subclass
                        classNode.superClassName = syntaxTree.children[3].token.match;
                    }
                    for (var i = 0; i < syntaxTree.children.length; i++) {
                        if (syntaxTree.children[i].syntaxKind === 49 /* FeatureList */) {
                            _this.flattenRecursion(syntaxTree.children[i]);
                            for (var j = 0; j < syntaxTree.children[i].children.length; j++) {
                                if (syntaxTree.children[i].children[j].syntaxKind === 48 /* Feature */) {
                                    var childFeatureNode = _this.convert(syntaxTree.children[i].children[j]);
                                    childFeatureNode.parent = classNode;
                                    classNode.children.push(childFeatureNode);
                                }
                            }
                            break;
                        }
                    }
                    convertedNode = classNode;
                }
                else if (syntaxTree.syntaxKind === 48 /* Feature */) {
                    if (syntaxTree.children[1].syntaxKind === 1 /* OpenParenthesis */) {
                        // we should convert into a method
                        var methodNode = new CoolToJS.MethodNode();
                        methodNode.methodName = syntaxTree.children[0].token.match;
                        methodNode.token = syntaxTree.children[0].token;
                        if (syntaxTree.children[2].syntaxKind === 51 /* FormalList */) {
                            // this method has at least one parameter
                            methodNode.returnTypeName = syntaxTree.children[5].token.match;
                            _this.flattenRecursion(syntaxTree.children[2]);
                            for (var i = 0; i < syntaxTree.children[2].children.length; i++) {
                                if (syntaxTree.children[2].children[i].syntaxKind === 50 /* Formal */) {
                                    methodNode.parameters.push({
                                        parameterName: syntaxTree.children[2].children[i].children[0].token.match,
                                        parameterTypeName: syntaxTree.children[2].children[i].children[2].token.match
                                    });
                                }
                            }
                            // convert the method body
                            var methodBodyNode = _this.convert(syntaxTree.children[7]);
                            methodBodyNode.parent = methodNode;
                            methodNode.children.push(methodBodyNode);
                        }
                        else {
                            // this method has no parameters
                            methodNode.returnTypeName = syntaxTree.children[4].token.match;
                            // convert the method body
                            var methodBodyNode = _this.convert(syntaxTree.children[6]);
                            methodBodyNode.parent = methodNode;
                            methodNode.children.push(methodBodyNode);
                        }
                        convertedNode = methodNode;
                    }
                    else if (syntaxTree.children[1].syntaxKind === 9 /* Colon */) {
                        // we should convert into a property
                        var propertyNode = new CoolToJS.PropertyNode();
                        propertyNode.propertyName = syntaxTree.children[0].token.match;
                        propertyNode.token = syntaxTree.children[0].token;
                        propertyNode.typeName = syntaxTree.children[2].token.match;
                        if (syntaxTree.children[4]) {
                            // if this property has an initializer
                            // convert the property initializer
                            var propertyInitializerNode = _this.convert(syntaxTree.children[4]);
                            propertyInitializerNode.parent = propertyNode;
                            propertyNode.children.push(propertyInitializerNode);
                        }
                        convertedNode = propertyNode;
                    }
                    else {
                        throw 'Unexpected SyntaxKind: second child of a Feature should either be a ( or a :';
                    }
                }
                else if (syntaxTree.syntaxKind === 45 /* Expression */) {
                    /* ASSIGNMENT EXPRESSION */
                    if (syntaxTree.children[1] && syntaxTree.children[1].syntaxKind === 12 /* AssignmentOperator */) {
                        var assignmentExprNode = new CoolToJS.AssignmentExpressionNode();
                        assignmentExprNode.identifierName = syntaxTree.children[0].token.match;
                        assignmentExprNode.token = syntaxTree.children[0].token;
                        var assignmentExpression = _this.convert(syntaxTree.children[2]);
                        assignmentExpression.parent = assignmentExprNode;
                        assignmentExprNode.children.push(assignmentExpression);
                        convertedNode = assignmentExprNode;
                    }
                    else if (syntaxTree.children[1] && (syntaxTree.children[1].syntaxKind === 7 /* DotOperator */ || syntaxTree.children[1].syntaxKind === 16 /* AtSignOperator */ || (syntaxTree.children[0].syntaxKind === 32 /* ObjectIdentifier */ && syntaxTree.children[1].syntaxKind === 1 /* OpenParenthesis */))) {
                        var methodCallExprNode = new CoolToJS.MethodCallExpressionNode(), expressionListIndex;
                        if (syntaxTree.children[1].syntaxKind === 7 /* DotOperator */) {
                            // standard method call on an expression
                            methodCallExprNode.methodName = syntaxTree.children[2].token.match;
                            methodCallExprNode.token = syntaxTree.children[2].token;
                            methodCallExprNode.targetExpression = _this.convert(syntaxTree.children[0]);
                            expressionListIndex = 4;
                        }
                        else if (syntaxTree.children[1].syntaxKind === 16 /* AtSignOperator */) {
                            // method call to parent class
                            methodCallExprNode.methodName = syntaxTree.children[4].token.match;
                            methodCallExprNode.token = syntaxTree.children[4].token;
                            methodCallExprNode.targetExpression = _this.convert(syntaxTree.children[0]);
                            methodCallExprNode.isCallToParent = true;
                            expressionListIndex = 6;
                        }
                        else if (syntaxTree.children[1].syntaxKind === 1 /* OpenParenthesis */) {
                            // method call to implied "self"
                            methodCallExprNode.methodName = syntaxTree.children[0].token.match;
                            methodCallExprNode.token = syntaxTree.children[0].token;
                            methodCallExprNode.isCallToSelf = true;
                            expressionListIndex = 2;
                        }
                        else {
                            throw 'Unknown method call expression type';
                        }
                        if (syntaxTree.children[expressionListIndex].syntaxKind === 46 /* ExpressionList */) {
                            _this.flattenRecursion(syntaxTree.children[expressionListIndex]);
                            for (var i = 0; i < syntaxTree.children[expressionListIndex].children.length; i++) {
                                if (syntaxTree.children[expressionListIndex].children[i].syntaxKind === 45 /* Expression */) {
                                    var parameterExprNode = _this.convert(syntaxTree.children[expressionListIndex].children[i]);
                                    parameterExprNode.parent = methodCallExprNode;
                                    methodCallExprNode.children.push(parameterExprNode);
                                }
                            }
                        }
                        convertedNode = methodCallExprNode;
                    }
                    else if (syntaxTree.children[0].syntaxKind === 23 /* IfKeyword */) {
                        var ifThenElseExprNode = new CoolToJS.IfThenElseExpressionNode();
                        var predicateNode = _this.convert(syntaxTree.children[1]);
                        ifThenElseExprNode.children[0] = predicateNode;
                        var consequentNode = _this.convert(syntaxTree.children[3]);
                        ifThenElseExprNode.children[1] = consequentNode;
                        var alternativeNode = _this.convert(syntaxTree.children[5]);
                        ifThenElseExprNode.children[2] = alternativeNode;
                        predicateNode.parent = ifThenElseExprNode;
                        consequentNode.parent = ifThenElseExprNode;
                        alternativeNode.parent = ifThenElseExprNode;
                        convertedNode = ifThenElseExprNode;
                    }
                    else if (syntaxTree.children[0].syntaxKind === 39 /* WhileKeyword */) {
                        var whileExprNode = new CoolToJS.WhileExpressionNode();
                        var conditionNode = _this.convert(syntaxTree.children[1]);
                        whileExprNode.children[0] = conditionNode;
                        var bodyExpressionNode = _this.convert(syntaxTree.children[3]);
                        whileExprNode.children[1] = bodyExpressionNode;
                        conditionNode.parent = whileExprNode;
                        bodyExpressionNode.parent = whileExprNode;
                        convertedNode = whileExprNode;
                    }
                    else if (syntaxTree.children[0].syntaxKind === 40 /* OpenCurlyBracket */) {
                        var blockExpressionNode = new CoolToJS.BlockExpressionNode();
                        _this.flattenRecursion(syntaxTree.children[1]);
                        for (var i = 0; i < syntaxTree.children[1].children.length; i++) {
                            if (syntaxTree.children[1].children[i].syntaxKind === 45 /* Expression */) {
                                var childExpressionNode = _this.convert(syntaxTree.children[1].children[i]);
                                childExpressionNode.parent = blockExpressionNode;
                                blockExpressionNode.children.push(childExpressionNode);
                            }
                        }
                        convertedNode = blockExpressionNode;
                    }
                    else if (syntaxTree.children[0].syntaxKind === 28 /* LetKeyword */) {
                        var letExpressionNode = new CoolToJS.LetExpressionNode();
                        _this.flattenRecursion(syntaxTree.children[1]);
                        for (var i = 0; i < syntaxTree.children[1].children.length; i++) {
                            if (syntaxTree.children[1].children[i].syntaxKind === 32 /* ObjectIdentifier */) {
                                var localVarDeclaration = new CoolToJS.LocalVariableDeclarationNode();
                                localVarDeclaration.identifierName = syntaxTree.children[1].children[i].token.match;
                                localVarDeclaration.typeName = syntaxTree.children[1].children[i + 2].token.match;
                                if (syntaxTree.children[1].children[i + 3] && syntaxTree.children[1].children[i + 3].syntaxKind == 12 /* AssignmentOperator */) {
                                    var localVarDeclInitExprNode = _this.convert(syntaxTree.children[1].children[i + 4]);
                                    localVarDeclInitExprNode.parent = localVarDeclaration;
                                    // Why are getters/setters not working?
                                    //localVarDeclaration.initializerExpression = localVarDeclInitExprNode;
                                    localVarDeclaration.children[0] = localVarDeclInitExprNode;
                                }
                                localVarDeclaration.parent = letExpressionNode;
                                letExpressionNode.localVariableDeclarations.push(localVarDeclaration);
                            }
                        }
                        var expressionBodyNode = _this.convert(syntaxTree.children[3]);
                        expressionBodyNode.parent = letExpressionNode;
                        letExpressionNode.children.push(expressionBodyNode);
                        convertedNode = letExpressionNode;
                    }
                    else if (syntaxTree.children[0].syntaxKind === 17 /* CaseKeyword */) {
                        var caseExpressionNode = new CoolToJS.CaseExpressionNode();
                        _this.flattenRecursion(syntaxTree.children[3]);
                        for (var i = 0; i < syntaxTree.children[3].children.length; i++) {
                            if (syntaxTree.children[3].children[i].syntaxKind === 32 /* ObjectIdentifier */) {
                                var caseOptionNode = new CoolToJS.CaseOptionNode();
                                caseOptionNode.identiferName = syntaxTree.children[3].children[i].token.match;
                                caseOptionNode.typeName = syntaxTree.children[3].children[i + 2].token.match;
                                var caseOptionExpressionNode = _this.convert(syntaxTree.children[3].children[i + 4]);
                                caseOptionExpressionNode.parent = caseOptionNode;
                                caseOptionNode.children[0] = caseOptionExpressionNode;
                                caseOptionNode.parent = caseExpressionNode;
                                caseExpressionNode.caseOptionList.push(caseOptionNode);
                            }
                        }
                        var caseConditionNode = _this.convert(syntaxTree.children[1]);
                        caseConditionNode.parent = caseExpressionNode;
                        caseExpressionNode.condition = caseConditionNode;
                        convertedNode = caseExpressionNode;
                    }
                    else if (syntaxTree.children[0].syntaxKind === 30 /* NewKeyword */) {
                        var newExpressionNode = new CoolToJS.NewExpressionNode();
                        newExpressionNode.typeName = syntaxTree.children[1].token.match;
                        convertedNode = newExpressionNode;
                    }
                    else if (syntaxTree.children[0].syntaxKind === 27 /* IsvoidKeyword */) {
                        var isVoidExpressionNode = new CoolToJS.IsVoidExpressionNode();
                        var isVoidConditionNode = _this.convert(syntaxTree.children[1]);
                        isVoidExpressionNode.parent = isVoidExpressionNode;
                        isVoidExpressionNode.children[0] = isVoidConditionNode;
                        convertedNode = isVoidExpressionNode;
                    }
                    else if (syntaxTree.children[1] && _this.isBinaryOperator(syntaxTree.children[1])) {
                        var binaryOperationExprNode = new CoolToJS.BinaryOperationExpressionNode();
                        switch (syntaxTree.children[1].syntaxKind) {
                            case 4 /* AdditionOperator */:
                                binaryOperationExprNode.operationType = 0 /* Addition */;
                                break;
                            case 6 /* SubtractionOperator */:
                                binaryOperationExprNode.operationType = 1 /* Subtraction */;
                                break;
                            case 3 /* MultiplationOperator */:
                                binaryOperationExprNode.operationType = 3 /* Multiplication */;
                                break;
                            case 8 /* DivisionOperator */:
                                binaryOperationExprNode.operationType = 2 /* Division */;
                                break;
                            case 11 /* LessThanOperator */:
                                binaryOperationExprNode.operationType = 4 /* LessThan */;
                                break;
                            case 13 /* LessThanOrEqualsOperator */:
                                binaryOperationExprNode.operationType = 4 /* LessThanOrEqualTo */;
                                break;
                            case 14 /* EqualsOperator */:
                                binaryOperationExprNode.operationType = 4 /* Comparison */;
                                break;
                            default:
                                throw 'Unknown BinaryOperationType';
                        }
                        var operand1Node = _this.convert(syntaxTree.children[0]);
                        operand1Node.parent = binaryOperationExprNode;
                        var operand2Node = _this.convert(syntaxTree.children[0]);
                        operand2Node.parent = binaryOperationExprNode;
                        binaryOperationExprNode.children[0] = operand1Node;
                        binaryOperationExprNode.children[1] = operand2Node;
                        convertedNode = binaryOperationExprNode;
                    }
                    else if (syntaxTree.children[0].syntaxKind === 42 /* TildeOperator */) {
                        var unaryOperationExprNode = new CoolToJS.UnaryOperationExpressionNode();
                        var operandNode = _this.convert(syntaxTree.children[1]);
                        operandNode.parent = unaryOperationExprNode;
                        unaryOperationExprNode.children[0] = operandNode;
                        convertedNode = unaryOperationExprNode;
                    }
                    else if (syntaxTree.children[0].syntaxKind === 42 /* TildeOperator */ || syntaxTree.children[0].syntaxKind === 31 /* NotKeyword */) {
                        var unaryOperationExprNode = new CoolToJS.UnaryOperationExpressionNode();
                        if (syntaxTree.children[0].syntaxKind === 42 /* TildeOperator */) {
                            unaryOperationExprNode.operationType = 0 /* Complement */;
                        }
                        else if (syntaxTree.children[0].syntaxKind === 31 /* NotKeyword */) {
                            unaryOperationExprNode.operationType = 1 /* Not */;
                        }
                        else {
                            throw 'Unknown UnaryOperationType';
                        }
                        var operandNode = _this.convert(syntaxTree.children[1]);
                        operandNode.parent = unaryOperationExprNode;
                        unaryOperationExprNode.children[0] = operandNode;
                        convertedNode = unaryOperationExprNode;
                    }
                    else if (syntaxTree.children[0].syntaxKind === 1 /* OpenParenthesis */) {
                        var parExprNod = new CoolToJS.ParantheticalExpressionNode();
                        var innerExprNode = _this.convert(syntaxTree.children[1]);
                        innerExprNode.parent = parExprNod;
                        parExprNod.children[0] = innerExprNode;
                        convertedNode = parExprNod;
                    }
                    else if (syntaxTree.children[0].syntaxKind === 32 /* ObjectIdentifier */ && syntaxTree.children.length === 1) {
                        var objIdentExprNode = new CoolToJS.ObjectIdentifierExpressionNode();
                        objIdentExprNode.objectIdentifierName = syntaxTree.children[0].token.match;
                        objIdentExprNode.token = syntaxTree.children[0].token;
                        convertedNode = objIdentExprNode;
                    }
                    else if (syntaxTree.children[0].syntaxKind === 26 /* Integer */) {
                        var intLiteralExprNode = new CoolToJS.IntegerLiteralExpressionNode();
                        intLiteralExprNode.value = parseInt(syntaxTree.children[0].token.match, 10);
                        convertedNode = intLiteralExprNode;
                    }
                    else if (syntaxTree.children[0].syntaxKind === 35 /* String */) {
                        var stringLiteralExprNode = new CoolToJS.StringLiteralExpressionNode();
                        // TODO: remove quotes
                        stringLiteralExprNode.value = syntaxTree.children[0].token.match;
                        convertedNode = stringLiteralExprNode;
                    }
                    else if (syntaxTree.children[0].syntaxKind === 37 /* TrueKeyword */) {
                        var trueKeywordExprNode = new CoolToJS.TrueKeywordExpressionNode();
                        convertedNode = trueKeywordExprNode;
                    }
                    else if (syntaxTree.children[0].syntaxKind === 21 /* FalseKeyword */) {
                        var falseKeywordExprNode = new CoolToJS.FalseKeywordExpressionNode();
                        convertedNode = falseKeywordExprNode;
                    }
                }
                else {
                    throw 'Unknown syntaxTree kind!';
                }
                return convertedNode;
            };
        }
        AbstractSyntaxTreeConverter.prototype.flattenRecursion = function (syntaxTree) {
            for (var i = 0; i < syntaxTree.children.length; i++) {
                if (syntaxTree.children[i].syntaxKind === syntaxTree.syntaxKind) {
                    // replace the node with its children
                    syntaxTree.children.splice.apply(syntaxTree.children, [i, 1].concat(syntaxTree.children[i].children));
                }
            }
        };
        AbstractSyntaxTreeConverter.prototype.isBinaryOperator = function (syntaxTree) {
            return (syntaxTree.syntaxKind === 4 /* AdditionOperator */ || syntaxTree.syntaxKind === 6 /* SubtractionOperator */ || syntaxTree.syntaxKind === 3 /* MultiplationOperator */ || syntaxTree.syntaxKind === 8 /* DivisionOperator */ || syntaxTree.syntaxKind === 11 /* LessThanOperator */ || syntaxTree.syntaxKind === 13 /* LessThanOrEqualsOperator */ || syntaxTree.syntaxKind === 14 /* EqualsOperator */);
        };
        return AbstractSyntaxTreeConverter;
    })();
    CoolToJS.AbstractSyntaxTreeConverter = AbstractSyntaxTreeConverter;
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    // finds all Cool program sources referenced in 
    // <script type="text/cool"> elements and returns 
    // them asynchonously via the completedCallback
    function GetReferencedCoolSources(completedCallback) {
        // get all <script> elements of type "text/cool" and get the script's source as a string
        var coolProgramReferences = document.querySelectorAll('script[type="text/cool"]');
        var coolPrograms = [];
        for (var i = 0; i < coolProgramReferences.length; i++) {
            var filename = coolProgramReferences[i].attributes['src'].value;
            // call a separate function here to avoid closure problem
            getCoolProgramText(i, filename);
        }
        function getCoolProgramText(index, filename) {
            makeAjaxRequest(filename, function (responseText) {
                coolPrograms[index] = ({ filename: filename, program: responseText });
                // if all ajax calls have returned, execute the callback with the Cool source 
                if (coolPrograms.length == coolProgramReferences.length) {
                    completedCallback(coolPrograms.map(function (x) {
                        return x.program;
                    }));
                }
            });
        }
        // generic function to make AJAX call
        function makeAjaxRequest(url, successCallback, errorCallback) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                    if (xmlhttp.status == 200) {
                        successCallback(xmlhttp.responseText);
                    }
                    else {
                        if (errorCallback) {
                            errorCallback();
                        }
                    }
                }
            };
            xmlhttp.open('GET', url, true);
            xmlhttp.send();
        }
    }
    CoolToJS.GetReferencedCoolSources = GetReferencedCoolSources;
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    var LexicalAnalyzer = (function () {
        function LexicalAnalyzer() {
            var _this = this;
            this.tabLength = 4;
            this.Analyze = function (coolProgramSource) {
                var tokens = [], currentLineNumber = 1, currentColumnNumber = 1, errorMessages = [];
                while (coolProgramSource.length > 0) {
                    var longestMatch = null;
                    for (var i = 0; i < CoolToJS.TokenLookup.length; i++) {
                        var currentTokenOption = CoolToJS.TokenLookup[i], matchIsKeyword = CoolToJS.isKeyword(currentTokenOption.token), matchString = null;
                        if (currentTokenOption.matchFunction) {
                            matchString = currentTokenOption.matchFunction(coolProgramSource);
                        }
                        else {
                            var match = currentTokenOption.regex.exec(coolProgramSource);
                            if (match !== null && typeof match[1] !== 'undefined') {
                                matchString = match[1];
                            }
                            else {
                                matchString = null;
                            }
                        }
                        if (!matchString) {
                            continue;
                        }
                        if (!longestMatch || matchString.length > longestMatch.match.length) {
                            longestMatch = {
                                token: currentTokenOption.token,
                                tokenName: CoolToJS.SyntaxKind[currentTokenOption.token],
                                match: matchString,
                                location: {
                                    line: currentLineNumber,
                                    column: currentColumnNumber,
                                    length: matchString.length
                                }
                            };
                        }
                    }
                    if (longestMatch) {
                        // we successfully found a match
                        if (longestMatch.token === 56 /* NewLine */) {
                            currentLineNumber++;
                            currentColumnNumber = 1;
                        }
                        else if (longestMatch.token === 35 /* String */ || longestMatch.token === 58 /* Comment */) {
                            // strings and comments can also have newlines 
                            // in them, if they're multi-line
                            var lines = longestMatch.match.split('\n');
                            currentLineNumber += lines.length - 1;
                            if (lines.length > 1) {
                                currentColumnNumber = lines[lines.length - 1].length + 1;
                            }
                            else {
                                currentColumnNumber += longestMatch.match.length;
                            }
                        }
                        else if (longestMatch.token === 57 /* Tab */) {
                            currentColumnNumber += _this.tabLength;
                        }
                        else if (longestMatch.token !== 55 /* CarriageReturn */) {
                            // update the column counter
                            currentColumnNumber += longestMatch.match.length;
                        }
                        tokens.push(longestMatch);
                        coolProgramSource = coolProgramSource.slice(longestMatch.match.length);
                    }
                    else {
                        // we weren't able to find a match
                        var errorMessage = 'Line ' + currentLineNumber + ', column ' + currentColumnNumber + ':\tSyntax error: Unexpected character sequence near "' + coolProgramSource.slice(0, 20).replace(/\r\n|\r|\n|\t|[\s]+/g, ' ') + '..."';
                        // figure out an approximate length of the error token
                        var untilWhitespaceMatch = /^([^\s]*)/.exec(coolProgramSource);
                        if (untilWhitespaceMatch === null || typeof untilWhitespaceMatch[1] === 'undefined') {
                            var length = 1;
                        }
                        else {
                            var length = untilWhitespaceMatch[1].length;
                        }
                        errorMessages.push({
                            message: errorMessage,
                            location: {
                                line: currentLineNumber,
                                column: currentColumnNumber,
                                length: length
                            }
                        });
                        // chop off the problematic chunk of input and try to keep analyzing
                        coolProgramSource = coolProgramSource.slice(length);
                        currentColumnNumber += length;
                    }
                }
                //for (var i = 0; i < tokens.length; i++) {
                //    console.log(SyntaxKind[tokens[i].token] + ': "' + tokens[i].match + '", line: ' + tokens[i].location.line + ', column: ' + tokens[i].location.column);
                //}
                // put an EndOfInput on the end of the token array
                tokens.push({
                    token: 0 /* EndOfInput */,
                    tokenName: CoolToJS.SyntaxKind[0 /* EndOfInput */],
                    match: null,
                    location: {
                        column: currentColumnNumber,
                        line: currentLineNumber,
                        length: 1
                    }
                });
                return {
                    success: errorMessages.length === 0,
                    tokens: tokens,
                    errorMessages: errorMessages,
                };
            };
        }
        return LexicalAnalyzer;
    })();
    CoolToJS.LexicalAnalyzer = LexicalAnalyzer;
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    var Parser = (function () {
        function Parser() {
            var _this = this;
            this.Parse = function (lexerOutput) {
                var tokens = lexerOutput.tokens, warnings = lexerOutput.warningMessages || [], stack = [], inputPointer = 0, isAtEndOfInput = function () {
                    return inputPointer === tokens.length - 1;
                }, 
                // records which tokens we've already added warnings for, 
                // to avoid duplicate warnings
                alreadyWarnedTokens = [], recordAmbiguousParseWarning = function () {
                    var warningToken;
                    for (var i = inputPointer; i >= 0; i--) {
                        if (tokens[i].token === 28 /* LetKeyword */) {
                            warningToken = tokens[i];
                            break;
                        }
                    }
                    warningToken = warningToken || tokens[inputPointer];
                    if (alreadyWarnedTokens.indexOf(warningToken) !== -1) {
                        return;
                    }
                    var warningMessage = 'Line ' + warningToken.location.line + ', column ' + warningToken.location.column + ':\t' + 'Ambiguous shift/reduce detected in parse table.  Automatically took shift option. ' + 'To remove abiguity and ensure proper parsing, ensure all "let" blocks surround their contents in curly brackets.';
                    warnings.push({
                        message: warningMessage,
                        location: {
                            line: warningToken.location.line,
                            column: warningToken.location.column,
                            length: warningToken.match ? warningToken.match.length : 1
                        }
                    });
                    alreadyWarnedTokens.push(warningToken);
                };
                // remove any characters we don't care about while parsing
                tokens = _this.cleanseTokenArray(tokens);
                // #region for debugging
                // prints the current stack to the console
                var printStack = function () {
                    var output = [];
                    for (var i = 0; i < stack.length; i++) {
                        output.push(CoolToJS.SyntaxKind[stack[i].syntaxKind]);
                    }
                    console.log('[' + output.join(', ') + ']');
                    return output;
                };
                while (!(stack.length === 1 && stack[0].syntaxKind === CoolToJS.StartSyntaxKind && isAtEndOfInput())) {
                    var state = 0, tableEntry;
                    for (var i = 0; i < stack.length; i++) {
                        tableEntry = CoolToJS.slr1ParseTable[state][stack[i].syntaxKind];
                        // ambiguous entries appear as Arrays.
                        if (tableEntry instanceof Array) {
                            tableEntry = tableEntry[0];
                            recordAmbiguousParseWarning();
                        }
                        state = tableEntry.nextState;
                    }
                    tableEntry = CoolToJS.slr1ParseTable[state][tokens[inputPointer].token];
                    if (tableEntry instanceof Array) {
                        tableEntry = tableEntry[0];
                        recordAmbiguousParseWarning();
                    }
                    if (tableEntry === null || (tableEntry.action === 2 /* Accept */ && isAtEndOfInput())) {
                        tableEntry = CoolToJS.slr1ParseTable[state][0 /* EndOfInput */];
                        if (tableEntry instanceof Array) {
                            tableEntry = tableEntry[0];
                            recordAmbiguousParseWarning();
                        }
                    }
                    // if tableEntry is STILL null, we have a parse error.
                    if (tableEntry === null) {
                        // TODO: better error reporting
                        var errorMessage = '';
                        if (tokens[inputPointer].token === 0 /* EndOfInput */) {
                            errorMessage = 'Line ' + tokens[inputPointer].location.line + ', column ' + tokens[inputPointer].location.column + ':\tParse error: unexpected end of input';
                        }
                        else {
                            errorMessage = 'Line ' + tokens[inputPointer].location.line + ', column ' + tokens[inputPointer].location.column + ':\tParse error: unexpected token: "' + tokens[inputPointer].match + '"';
                        }
                        return {
                            success: false,
                            errorMessages: [{
                                message: errorMessage,
                                location: {
                                    line: tokens[inputPointer].location.line,
                                    column: tokens[inputPointer].location.column,
                                    length: tokens[inputPointer].match ? tokens[inputPointer].match.length : 1
                                }
                            }]
                        };
                    }
                    if (tableEntry.action === 0 /* Shift */) {
                        stack.push({
                            syntaxKind: tokens[inputPointer].token,
                            syntaxKindName: CoolToJS.SyntaxKind[tokens[inputPointer].token],
                            token: tokens[inputPointer],
                            parent: null,
                            children: [],
                        });
                        inputPointer++;
                    }
                    else if (tableEntry.action === 1 /* Reduce */) {
                        var production = CoolToJS.productions[tableEntry.productionIndex];
                        var removedItems = stack.splice(-1 * production.popCount, production.popCount);
                        var newStackItem = {
                            syntaxKind: production.reduceResult,
                            syntaxKindName: CoolToJS.SyntaxKind[production.reduceResult],
                            children: removedItems,
                            parent: null,
                        };
                        for (var i = 0; i < newStackItem.children.length; i++) {
                            newStackItem.children[i].parent = newStackItem;
                        }
                        stack.push(newStackItem);
                    }
                    else {
                        // Parse error!
                        // TODO: does this always mean "unexpected end of program"?
                        var errorMessage = 'Line ' + tokens[inputPointer].location.line + ', column ' + tokens[inputPointer].location.column + ':\tParse error: expected end of program, but instead saw "' + tokens[inputPointer].match + '"';
                        return {
                            success: false,
                            errorMessages: [{
                                message: errorMessage,
                                location: {
                                    line: tokens[inputPointer].location.line,
                                    column: tokens[inputPointer].location.column,
                                    length: tokens[inputPointer].match ? tokens[inputPointer].match.length : 1
                                }
                            }]
                        };
                    }
                }
                //Utility.PrintSyntaxTree(stack[0]);
                return {
                    success: true,
                    syntaxTree: stack[0],
                    warningMessages: warnings
                };
            };
        }
        // returns a copy of the provided array with whitespace,
        // newlines, comments, etc. removed
        Parser.prototype.cleanseTokenArray = function (tokens) {
            var cleanArray = [];
            for (var i = 0; i < tokens.length; i++) {
                if (tokens[i].token !== 55 /* CarriageReturn */ && tokens[i].token !== 58 /* Comment */ && tokens[i].token !== 56 /* NewLine */ && tokens[i].token !== 57 /* Tab */ && tokens[i].token !== 54 /* WhiteSpace */) {
                    cleanArray.push(tokens[i]);
                }
            }
            return cleanArray;
        };
        return Parser;
    })();
    CoolToJS.Parser = Parser;
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    (function (Action) {
        Action[Action["Shift"] = 0] = "Shift";
        Action[Action["Reduce"] = 1] = "Reduce";
        Action[Action["Accept"] = 2] = "Accept";
        Action[Action["None"] = 3] = "None";
    })(CoolToJS.Action || (CoolToJS.Action = {}));
    var Action = CoolToJS.Action;
    CoolToJS.slr1ParseTable = [
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 3 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 3 /* None */, nextState: 2 }, null, null, null, null, null, null, null, null, { action: 3 /* None */, nextState: 1 }],
        [{ action: 2 /* Accept */ }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 4 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 5 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [{ action: 1 /* Reduce */, productionIndex: 1 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 3 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 3 /* None */, nextState: 2 }, null, null, null, null, null, null, null, null, { action: 3 /* None */, nextState: 6 }],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 7 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 8 }, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [{ action: 1 /* Reduce */, productionIndex: 2 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 9 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 12 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 3 /* None */, nextState: 11 }, { action: 3 /* None */, nextState: 10 }, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 13 }, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 14 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 15 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 16 }, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 17 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 12 }, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 19 }, null, null, null, null, null, null, { action: 3 /* None */, nextState: 11 }, { action: 3 /* None */, nextState: 18 }, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 7 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 12 }, null, null, null, null, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 3 }, null, null, null, null, null, null, { action: 3 /* None */, nextState: 11 }, { action: 3 /* None */, nextState: 20 }, null, null, null, null],
        [null, null, { action: 0 /* Shift */, nextState: 22 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 24 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 3 /* None */, nextState: 23 }, { action: 3 /* None */, nextState: 21 }, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 25 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 26 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 6 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 4 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 0 /* Shift */, nextState: 27 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 28 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 8 }, null, null, { action: 0 /* Shift */, nextState: 29 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 30 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 13 }, null, { action: 0 /* Shift */, nextState: 31 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 5 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 32 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 33 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 24 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 3 /* None */, nextState: 23 }, { action: 3 /* None */, nextState: 34 }, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 35 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 36 }, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 52 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 53 }, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 9 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 14 }, null, null, { action: 1 /* Reduce */, productionIndex: 14 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, null, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, { action: 1 /* Reduce */, productionIndex: 12 }, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 64 }, { action: 1 /* Reduce */, productionIndex: 49 }, { action: 1 /* Reduce */, productionIndex: 49 }, { action: 1 /* Reduce */, productionIndex: 49 }, { action: 1 /* Reduce */, productionIndex: 49 }, { action: 1 /* Reduce */, productionIndex: 49 }, { action: 1 /* Reduce */, productionIndex: 49 }, { action: 1 /* Reduce */, productionIndex: 49 }, null, { action: 1 /* Reduce */, productionIndex: 49 }, { action: 1 /* Reduce */, productionIndex: 49 }, { action: 0 /* Shift */, nextState: 63 }, { action: 1 /* Reduce */, productionIndex: 49 }, { action: 1 /* Reduce */, productionIndex: 49 }, null, { action: 1 /* Reduce */, productionIndex: 49 }, null, null, { action: 1 /* Reduce */, productionIndex: 49 }, null, null, { action: 1 /* Reduce */, productionIndex: 49 }, null, { action: 1 /* Reduce */, productionIndex: 49 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 49 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 49 }, { action: 1 /* Reduce */, productionIndex: 49 }, null, { action: 1 /* Reduce */, productionIndex: 49 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 49 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 65 }, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 66 }, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 68 }, null, { action: 3 /* None */, nextState: 67 }, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 70 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 3 /* None */, nextState: 69 }, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 71 }, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 72 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 73 }, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 74 }, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 75 }, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 76 }, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 50 }, { action: 1 /* Reduce */, productionIndex: 50 }, { action: 1 /* Reduce */, productionIndex: 50 }, { action: 1 /* Reduce */, productionIndex: 50 }, { action: 1 /* Reduce */, productionIndex: 50 }, { action: 1 /* Reduce */, productionIndex: 50 }, { action: 1 /* Reduce */, productionIndex: 50 }, null, { action: 1 /* Reduce */, productionIndex: 50 }, { action: 1 /* Reduce */, productionIndex: 50 }, null, { action: 1 /* Reduce */, productionIndex: 50 }, { action: 1 /* Reduce */, productionIndex: 50 }, null, { action: 1 /* Reduce */, productionIndex: 50 }, null, null, { action: 1 /* Reduce */, productionIndex: 50 }, null, null, { action: 1 /* Reduce */, productionIndex: 50 }, null, { action: 1 /* Reduce */, productionIndex: 50 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 50 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 50 }, { action: 1 /* Reduce */, productionIndex: 50 }, null, { action: 1 /* Reduce */, productionIndex: 50 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 50 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 51 }, { action: 1 /* Reduce */, productionIndex: 51 }, { action: 1 /* Reduce */, productionIndex: 51 }, { action: 1 /* Reduce */, productionIndex: 51 }, { action: 1 /* Reduce */, productionIndex: 51 }, { action: 1 /* Reduce */, productionIndex: 51 }, { action: 1 /* Reduce */, productionIndex: 51 }, null, { action: 1 /* Reduce */, productionIndex: 51 }, { action: 1 /* Reduce */, productionIndex: 51 }, null, { action: 1 /* Reduce */, productionIndex: 51 }, { action: 1 /* Reduce */, productionIndex: 51 }, null, { action: 1 /* Reduce */, productionIndex: 51 }, null, null, { action: 1 /* Reduce */, productionIndex: 51 }, null, null, { action: 1 /* Reduce */, productionIndex: 51 }, null, { action: 1 /* Reduce */, productionIndex: 51 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 51 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 51 }, { action: 1 /* Reduce */, productionIndex: 51 }, null, { action: 1 /* Reduce */, productionIndex: 51 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 51 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 52 }, { action: 1 /* Reduce */, productionIndex: 52 }, { action: 1 /* Reduce */, productionIndex: 52 }, { action: 1 /* Reduce */, productionIndex: 52 }, { action: 1 /* Reduce */, productionIndex: 52 }, { action: 1 /* Reduce */, productionIndex: 52 }, { action: 1 /* Reduce */, productionIndex: 52 }, null, { action: 1 /* Reduce */, productionIndex: 52 }, { action: 1 /* Reduce */, productionIndex: 52 }, null, { action: 1 /* Reduce */, productionIndex: 52 }, { action: 1 /* Reduce */, productionIndex: 52 }, null, { action: 1 /* Reduce */, productionIndex: 52 }, null, null, { action: 1 /* Reduce */, productionIndex: 52 }, null, null, { action: 1 /* Reduce */, productionIndex: 52 }, null, { action: 1 /* Reduce */, productionIndex: 52 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 52 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 52 }, { action: 1 /* Reduce */, productionIndex: 52 }, null, { action: 1 /* Reduce */, productionIndex: 52 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 52 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 53 }, { action: 1 /* Reduce */, productionIndex: 53 }, { action: 1 /* Reduce */, productionIndex: 53 }, { action: 1 /* Reduce */, productionIndex: 53 }, { action: 1 /* Reduce */, productionIndex: 53 }, { action: 1 /* Reduce */, productionIndex: 53 }, { action: 1 /* Reduce */, productionIndex: 53 }, null, { action: 1 /* Reduce */, productionIndex: 53 }, { action: 1 /* Reduce */, productionIndex: 53 }, null, { action: 1 /* Reduce */, productionIndex: 53 }, { action: 1 /* Reduce */, productionIndex: 53 }, null, { action: 1 /* Reduce */, productionIndex: 53 }, null, null, { action: 1 /* Reduce */, productionIndex: 53 }, null, null, { action: 1 /* Reduce */, productionIndex: 53 }, null, { action: 1 /* Reduce */, productionIndex: 53 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 53 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 53 }, { action: 1 /* Reduce */, productionIndex: 53 }, null, { action: 1 /* Reduce */, productionIndex: 53 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 53 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 77 }, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 78 }, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 79 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 80 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 81 }, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 82 }, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 83 }, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 84 }, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 85 }, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 86 }, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 87 }, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 88 }, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, { action: 0 /* Shift */, nextState: 89 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 91 }, { action: 3 /* None */, nextState: 90 }, null, null, null, null, null, null, null],
        [null, null, null, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, null, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, null, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 92 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, null, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, null, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 93 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 94 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, null, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, { action: 0 /* Shift */, nextState: 95 }, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 96 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 97 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, null, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, null, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 98 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 37 }, { action: 1 /* Reduce */, productionIndex: 37 }, { action: 1 /* Reduce */, productionIndex: 37 }, { action: 1 /* Reduce */, productionIndex: 37 }, { action: 1 /* Reduce */, productionIndex: 37 }, { action: 1 /* Reduce */, productionIndex: 37 }, { action: 1 /* Reduce */, productionIndex: 37 }, null, { action: 1 /* Reduce */, productionIndex: 37 }, { action: 1 /* Reduce */, productionIndex: 37 }, null, { action: 1 /* Reduce */, productionIndex: 37 }, { action: 1 /* Reduce */, productionIndex: 37 }, null, { action: 1 /* Reduce */, productionIndex: 37 }, null, null, { action: 1 /* Reduce */, productionIndex: 37 }, null, null, { action: 1 /* Reduce */, productionIndex: 37 }, null, { action: 1 /* Reduce */, productionIndex: 37 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 37 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 37 }, { action: 1 /* Reduce */, productionIndex: 37 }, null, { action: 1 /* Reduce */, productionIndex: 37 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 37 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 38 }, { action: 1 /* Reduce */, productionIndex: 38 }, { action: 1 /* Reduce */, productionIndex: 38 }, { action: 1 /* Reduce */, productionIndex: 38 }, { action: 1 /* Reduce */, productionIndex: 38 }, { action: 0 /* Shift */, nextState: 54 }, { action: 1 /* Reduce */, productionIndex: 38 }, null, { action: 1 /* Reduce */, productionIndex: 38 }, { action: 1 /* Reduce */, productionIndex: 38 }, null, { action: 1 /* Reduce */, productionIndex: 38 }, { action: 1 /* Reduce */, productionIndex: 38 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, { action: 1 /* Reduce */, productionIndex: 38 }, null, null, { action: 1 /* Reduce */, productionIndex: 38 }, null, { action: 1 /* Reduce */, productionIndex: 38 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 38 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 38 }, { action: 1 /* Reduce */, productionIndex: 38 }, null, { action: 1 /* Reduce */, productionIndex: 38 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 38 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 43 }, { action: 1 /* Reduce */, productionIndex: 43 }, { action: 1 /* Reduce */, productionIndex: 43 }, { action: 1 /* Reduce */, productionIndex: 43 }, { action: 1 /* Reduce */, productionIndex: 43 }, { action: 0 /* Shift */, nextState: 54 }, { action: 1 /* Reduce */, productionIndex: 43 }, null, { action: 1 /* Reduce */, productionIndex: 43 }, { action: 1 /* Reduce */, productionIndex: 43 }, null, { action: 1 /* Reduce */, productionIndex: 43 }, { action: 1 /* Reduce */, productionIndex: 43 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, { action: 1 /* Reduce */, productionIndex: 43 }, null, null, { action: 1 /* Reduce */, productionIndex: 43 }, null, { action: 1 /* Reduce */, productionIndex: 43 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 43 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 43 }, { action: 1 /* Reduce */, productionIndex: 43 }, null, { action: 1 /* Reduce */, productionIndex: 43 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 43 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 47 }, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, { action: 1 /* Reduce */, productionIndex: 47 }, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, { action: 1 /* Reduce */, productionIndex: 47 }, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, { action: 1 /* Reduce */, productionIndex: 47 }, null, null, { action: 1 /* Reduce */, productionIndex: 47 }, null, { action: 1 /* Reduce */, productionIndex: 47 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 47 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 47 }, { action: 1 /* Reduce */, productionIndex: 47 }, null, { action: 1 /* Reduce */, productionIndex: 47 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 47 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 0 /* Shift */, nextState: 99 }, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, null, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, null, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 100 }, null, null, null, null, null, null, null, null],
        [null, null, null, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, null, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, null, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 101 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 102 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 103 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 39 }, { action: 0 /* Shift */, nextState: 58 }, { action: 1 /* Reduce */, productionIndex: 39 }, { action: 1 /* Reduce */, productionIndex: 39 }, { action: 1 /* Reduce */, productionIndex: 39 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, { action: 1 /* Reduce */, productionIndex: 39 }, { action: 1 /* Reduce */, productionIndex: 39 }, null, { action: 1 /* Reduce */, productionIndex: 39 }, { action: 1 /* Reduce */, productionIndex: 39 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, { action: 1 /* Reduce */, productionIndex: 39 }, null, null, { action: 1 /* Reduce */, productionIndex: 39 }, null, { action: 1 /* Reduce */, productionIndex: 39 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 39 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 39 }, { action: 1 /* Reduce */, productionIndex: 39 }, null, { action: 1 /* Reduce */, productionIndex: 39 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 39 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 40 }, { action: 0 /* Shift */, nextState: 58 }, { action: 1 /* Reduce */, productionIndex: 40 }, { action: 1 /* Reduce */, productionIndex: 40 }, { action: 1 /* Reduce */, productionIndex: 40 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, { action: 1 /* Reduce */, productionIndex: 40 }, { action: 1 /* Reduce */, productionIndex: 40 }, null, { action: 1 /* Reduce */, productionIndex: 40 }, { action: 1 /* Reduce */, productionIndex: 40 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, { action: 1 /* Reduce */, productionIndex: 40 }, null, null, { action: 1 /* Reduce */, productionIndex: 40 }, null, { action: 1 /* Reduce */, productionIndex: 40 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 40 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 40 }, { action: 1 /* Reduce */, productionIndex: 40 }, null, { action: 1 /* Reduce */, productionIndex: 40 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 40 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 41 }, { action: 1 /* Reduce */, productionIndex: 41 }, { action: 1 /* Reduce */, productionIndex: 41 }, { action: 1 /* Reduce */, productionIndex: 41 }, { action: 1 /* Reduce */, productionIndex: 41 }, { action: 0 /* Shift */, nextState: 54 }, { action: 1 /* Reduce */, productionIndex: 41 }, null, { action: 1 /* Reduce */, productionIndex: 41 }, { action: 1 /* Reduce */, productionIndex: 41 }, null, { action: 1 /* Reduce */, productionIndex: 41 }, { action: 1 /* Reduce */, productionIndex: 41 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, { action: 1 /* Reduce */, productionIndex: 41 }, null, null, { action: 1 /* Reduce */, productionIndex: 41 }, null, { action: 1 /* Reduce */, productionIndex: 41 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 41 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 41 }, { action: 1 /* Reduce */, productionIndex: 41 }, null, { action: 1 /* Reduce */, productionIndex: 41 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 41 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 42 }, { action: 1 /* Reduce */, productionIndex: 42 }, { action: 1 /* Reduce */, productionIndex: 42 }, { action: 1 /* Reduce */, productionIndex: 42 }, { action: 1 /* Reduce */, productionIndex: 42 }, { action: 0 /* Shift */, nextState: 54 }, { action: 1 /* Reduce */, productionIndex: 42 }, null, { action: 1 /* Reduce */, productionIndex: 42 }, { action: 1 /* Reduce */, productionIndex: 42 }, null, { action: 1 /* Reduce */, productionIndex: 42 }, { action: 1 /* Reduce */, productionIndex: 42 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, { action: 1 /* Reduce */, productionIndex: 42 }, null, null, { action: 1 /* Reduce */, productionIndex: 42 }, null, { action: 1 /* Reduce */, productionIndex: 42 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 42 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 42 }, { action: 1 /* Reduce */, productionIndex: 42 }, null, { action: 1 /* Reduce */, productionIndex: 42 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 42 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 44 }, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, { action: 1 /* Reduce */, productionIndex: 44 }, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, { action: 1 /* Reduce */, productionIndex: 44 }, { action: 1 /* Reduce */, productionIndex: 44 }, null, { action: 1 /* Reduce */, productionIndex: 44 }, { action: 1 /* Reduce */, productionIndex: 44 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, { action: 1 /* Reduce */, productionIndex: 44 }, null, null, { action: 1 /* Reduce */, productionIndex: 44 }, null, { action: 1 /* Reduce */, productionIndex: 44 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 44 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 44 }, { action: 1 /* Reduce */, productionIndex: 44 }, null, { action: 1 /* Reduce */, productionIndex: 44 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 44 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 45 }, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, { action: 1 /* Reduce */, productionIndex: 45 }, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, { action: 1 /* Reduce */, productionIndex: 45 }, { action: 1 /* Reduce */, productionIndex: 45 }, null, { action: 1 /* Reduce */, productionIndex: 45 }, { action: 1 /* Reduce */, productionIndex: 45 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, { action: 1 /* Reduce */, productionIndex: 45 }, null, null, { action: 1 /* Reduce */, productionIndex: 45 }, null, { action: 1 /* Reduce */, productionIndex: 45 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 45 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 45 }, { action: 1 /* Reduce */, productionIndex: 45 }, null, { action: 1 /* Reduce */, productionIndex: 45 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 45 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 46 }, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, { action: 1 /* Reduce */, productionIndex: 46 }, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, { action: 1 /* Reduce */, productionIndex: 46 }, { action: 1 /* Reduce */, productionIndex: 46 }, null, { action: 1 /* Reduce */, productionIndex: 46 }, { action: 1 /* Reduce */, productionIndex: 46 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, { action: 1 /* Reduce */, productionIndex: 46 }, null, null, { action: 1 /* Reduce */, productionIndex: 46 }, null, { action: 1 /* Reduce */, productionIndex: 46 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 46 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 46 }, { action: 1 /* Reduce */, productionIndex: 46 }, null, { action: 1 /* Reduce */, productionIndex: 46 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 46 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 25 }, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, { action: 1 /* Reduce */, productionIndex: 25 }, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, { action: 1 /* Reduce */, productionIndex: 25 }, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, { action: 1 /* Reduce */, productionIndex: 25 }, null, null, { action: 1 /* Reduce */, productionIndex: 25 }, null, { action: 1 /* Reduce */, productionIndex: 25 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 25 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 25 }, { action: 1 /* Reduce */, productionIndex: 25 }, null, { action: 1 /* Reduce */, productionIndex: 25 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 25 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 30 }, { action: 1 /* Reduce */, productionIndex: 30 }, { action: 1 /* Reduce */, productionIndex: 30 }, { action: 1 /* Reduce */, productionIndex: 30 }, { action: 1 /* Reduce */, productionIndex: 30 }, { action: 1 /* Reduce */, productionIndex: 30 }, { action: 1 /* Reduce */, productionIndex: 30 }, null, { action: 1 /* Reduce */, productionIndex: 30 }, { action: 1 /* Reduce */, productionIndex: 30 }, null, { action: 1 /* Reduce */, productionIndex: 30 }, { action: 1 /* Reduce */, productionIndex: 30 }, null, { action: 1 /* Reduce */, productionIndex: 30 }, null, null, { action: 1 /* Reduce */, productionIndex: 30 }, null, null, { action: 1 /* Reduce */, productionIndex: 30 }, null, { action: 1 /* Reduce */, productionIndex: 30 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 30 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 30 }, { action: 1 /* Reduce */, productionIndex: 30 }, null, { action: 1 /* Reduce */, productionIndex: 30 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 30 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 0 /* Shift */, nextState: 104 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 15 }, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, { action: 0 /* Shift */, nextState: 105 }, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, null, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 106 }, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 107 }, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 34 }, { action: 1 /* Reduce */, productionIndex: 34 }, { action: 1 /* Reduce */, productionIndex: 34 }, { action: 1 /* Reduce */, productionIndex: 34 }, { action: 1 /* Reduce */, productionIndex: 34 }, { action: 1 /* Reduce */, productionIndex: 34 }, { action: 1 /* Reduce */, productionIndex: 34 }, null, { action: 1 /* Reduce */, productionIndex: 34 }, { action: 1 /* Reduce */, productionIndex: 34 }, null, { action: 1 /* Reduce */, productionIndex: 34 }, { action: 1 /* Reduce */, productionIndex: 34 }, null, { action: 1 /* Reduce */, productionIndex: 34 }, null, null, { action: 1 /* Reduce */, productionIndex: 34 }, null, null, { action: 1 /* Reduce */, productionIndex: 34 }, null, { action: 1 /* Reduce */, productionIndex: 34 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 34 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 34 }, { action: 1 /* Reduce */, productionIndex: 34 }, null, { action: 1 /* Reduce */, productionIndex: 34 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 34 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, { action: 1 /* Reduce */, productionIndex: 17 }, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 68 }, null, { action: 3 /* None */, nextState: 108 }, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 109 }, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 110 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 112 }, null, null, null, null, null, null, null, null, null, null, { action: 3 /* None */, nextState: 111 }, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 48 }, { action: 1 /* Reduce */, productionIndex: 48 }, { action: 1 /* Reduce */, productionIndex: 48 }, { action: 1 /* Reduce */, productionIndex: 48 }, { action: 1 /* Reduce */, productionIndex: 48 }, { action: 1 /* Reduce */, productionIndex: 48 }, { action: 1 /* Reduce */, productionIndex: 48 }, null, { action: 1 /* Reduce */, productionIndex: 48 }, { action: 1 /* Reduce */, productionIndex: 48 }, null, { action: 1 /* Reduce */, productionIndex: 48 }, { action: 1 /* Reduce */, productionIndex: 48 }, null, { action: 1 /* Reduce */, productionIndex: 48 }, null, null, { action: 1 /* Reduce */, productionIndex: 48 }, null, null, { action: 1 /* Reduce */, productionIndex: 48 }, null, { action: 1 /* Reduce */, productionIndex: 48 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 48 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 48 }, { action: 1 /* Reduce */, productionIndex: 48 }, null, { action: 1 /* Reduce */, productionIndex: 48 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 48 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, null, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, null, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 113 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 11 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, { action: 0 /* Shift */, nextState: 114 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 91 }, { action: 3 /* None */, nextState: 115 }, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 116 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 31 }, { action: 1 /* Reduce */, productionIndex: 31 }, { action: 1 /* Reduce */, productionIndex: 31 }, { action: 1 /* Reduce */, productionIndex: 31 }, { action: 1 /* Reduce */, productionIndex: 31 }, { action: 1 /* Reduce */, productionIndex: 31 }, { action: 1 /* Reduce */, productionIndex: 31 }, null, { action: 1 /* Reduce */, productionIndex: 31 }, { action: 1 /* Reduce */, productionIndex: 31 }, null, { action: 1 /* Reduce */, productionIndex: 31 }, { action: 1 /* Reduce */, productionIndex: 31 }, null, { action: 1 /* Reduce */, productionIndex: 31 }, null, null, { action: 1 /* Reduce */, productionIndex: 31 }, null, null, { action: 1 /* Reduce */, productionIndex: 31 }, null, { action: 1 /* Reduce */, productionIndex: 31 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 31 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 31 }, { action: 1 /* Reduce */, productionIndex: 31 }, null, { action: 1 /* Reduce */, productionIndex: 31 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 31 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 91 }, { action: 3 /* None */, nextState: 117 }, null, null, null, null, null, null, null],
        [null, null, null, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, null, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, null, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, { action: 0 /* Shift */, nextState: 118 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, null, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, null, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 119 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 18 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 35 }, [{ action: 0 /* Shift */, nextState: 58 }, { action: 1 /* Reduce */, productionIndex: 35 }], [{ action: 0 /* Shift */, nextState: 56 }, { action: 1 /* Reduce */, productionIndex: 35 }], { action: 1 /* Reduce */, productionIndex: 35 }, [{ action: 0 /* Shift */, nextState: 57 }, { action: 1 /* Reduce */, productionIndex: 35 }], [{ action: 0 /* Shift */, nextState: 54 }, { action: 1 /* Reduce */, productionIndex: 35 }], [{ action: 0 /* Shift */, nextState: 59 }, { action: 1 /* Reduce */, productionIndex: 35 }], null, { action: 1 /* Reduce */, productionIndex: 35 }, [{ action: 0 /* Shift */, nextState: 60 }, { action: 1 /* Reduce */, productionIndex: 35 }], null, [{ action: 0 /* Shift */, nextState: 61 }, { action: 1 /* Reduce */, productionIndex: 35 }], [{ action: 0 /* Shift */, nextState: 62 }, { action: 1 /* Reduce */, productionIndex: 35 }], null, [{ action: 0 /* Shift */, nextState: 55 }, { action: 1 /* Reduce */, productionIndex: 35 }], null, null, { action: 1 /* Reduce */, productionIndex: 35 }, null, null, { action: 1 /* Reduce */, productionIndex: 35 }, null, { action: 1 /* Reduce */, productionIndex: 35 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 35 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 35 }, { action: 1 /* Reduce */, productionIndex: 35 }, null, { action: 1 /* Reduce */, productionIndex: 35 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 35 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, { action: 0 /* Shift */, nextState: 121 }, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 120 }, null, null, null, null, null, null, null, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 19 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 122 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 123 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 10 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 26 }, { action: 1 /* Reduce */, productionIndex: 26 }, { action: 1 /* Reduce */, productionIndex: 26 }, { action: 1 /* Reduce */, productionIndex: 26 }, { action: 1 /* Reduce */, productionIndex: 26 }, { action: 1 /* Reduce */, productionIndex: 26 }, { action: 1 /* Reduce */, productionIndex: 26 }, null, { action: 1 /* Reduce */, productionIndex: 26 }, { action: 1 /* Reduce */, productionIndex: 26 }, null, { action: 1 /* Reduce */, productionIndex: 26 }, { action: 1 /* Reduce */, productionIndex: 26 }, null, { action: 1 /* Reduce */, productionIndex: 26 }, null, null, { action: 1 /* Reduce */, productionIndex: 26 }, null, null, { action: 1 /* Reduce */, productionIndex: 26 }, null, { action: 1 /* Reduce */, productionIndex: 26 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 26 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 26 }, { action: 1 /* Reduce */, productionIndex: 26 }, null, { action: 1 /* Reduce */, productionIndex: 26 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 26 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 0 /* Shift */, nextState: 124 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 125 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 16 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 126 }, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 33 }, { action: 1 /* Reduce */, productionIndex: 33 }, { action: 1 /* Reduce */, productionIndex: 33 }, { action: 1 /* Reduce */, productionIndex: 33 }, { action: 1 /* Reduce */, productionIndex: 33 }, { action: 1 /* Reduce */, productionIndex: 33 }, { action: 1 /* Reduce */, productionIndex: 33 }, null, { action: 1 /* Reduce */, productionIndex: 33 }, { action: 1 /* Reduce */, productionIndex: 33 }, null, { action: 1 /* Reduce */, productionIndex: 33 }, { action: 1 /* Reduce */, productionIndex: 33 }, null, { action: 1 /* Reduce */, productionIndex: 33 }, null, null, { action: 1 /* Reduce */, productionIndex: 33 }, null, null, { action: 1 /* Reduce */, productionIndex: 33 }, null, { action: 1 /* Reduce */, productionIndex: 33 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 33 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 33 }, { action: 1 /* Reduce */, productionIndex: 33 }, null, { action: 1 /* Reduce */, productionIndex: 33 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 33 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 127 }, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 70 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 3 /* None */, nextState: 128 }, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 36 }, { action: 1 /* Reduce */, productionIndex: 36 }, { action: 1 /* Reduce */, productionIndex: 36 }, { action: 1 /* Reduce */, productionIndex: 36 }, { action: 1 /* Reduce */, productionIndex: 36 }, { action: 1 /* Reduce */, productionIndex: 36 }, { action: 1 /* Reduce */, productionIndex: 36 }, null, { action: 1 /* Reduce */, productionIndex: 36 }, { action: 1 /* Reduce */, productionIndex: 36 }, null, { action: 1 /* Reduce */, productionIndex: 36 }, { action: 1 /* Reduce */, productionIndex: 36 }, null, { action: 1 /* Reduce */, productionIndex: 36 }, null, null, { action: 1 /* Reduce */, productionIndex: 36 }, null, null, { action: 1 /* Reduce */, productionIndex: 36 }, null, { action: 1 /* Reduce */, productionIndex: 36 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 36 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 36 }, { action: 1 /* Reduce */, productionIndex: 36 }, null, { action: 1 /* Reduce */, productionIndex: 36 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 36 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 129 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 27 }, { action: 1 /* Reduce */, productionIndex: 27 }, { action: 1 /* Reduce */, productionIndex: 27 }, { action: 1 /* Reduce */, productionIndex: 27 }, { action: 1 /* Reduce */, productionIndex: 27 }, { action: 1 /* Reduce */, productionIndex: 27 }, { action: 1 /* Reduce */, productionIndex: 27 }, null, { action: 1 /* Reduce */, productionIndex: 27 }, { action: 1 /* Reduce */, productionIndex: 27 }, null, { action: 1 /* Reduce */, productionIndex: 27 }, { action: 1 /* Reduce */, productionIndex: 27 }, null, { action: 1 /* Reduce */, productionIndex: 27 }, null, null, { action: 1 /* Reduce */, productionIndex: 27 }, null, null, { action: 1 /* Reduce */, productionIndex: 27 }, null, { action: 1 /* Reduce */, productionIndex: 27 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 27 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 27 }, { action: 1 /* Reduce */, productionIndex: 27 }, null, { action: 1 /* Reduce */, productionIndex: 27 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 27 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, { action: 0 /* Shift */, nextState: 130 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 91 }, { action: 3 /* None */, nextState: 131 }, null, null, null, null, null, null, null],
        [null, null, null, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, null, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, null, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, null, null, null, { action: 0 /* Shift */, nextState: 132 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, { action: 0 /* Shift */, nextState: 133 }, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, null, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, null, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 20 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 21 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 134 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 28 }, { action: 1 /* Reduce */, productionIndex: 28 }, { action: 1 /* Reduce */, productionIndex: 28 }, { action: 1 /* Reduce */, productionIndex: 28 }, { action: 1 /* Reduce */, productionIndex: 28 }, { action: 1 /* Reduce */, productionIndex: 28 }, { action: 1 /* Reduce */, productionIndex: 28 }, null, { action: 1 /* Reduce */, productionIndex: 28 }, { action: 1 /* Reduce */, productionIndex: 28 }, null, { action: 1 /* Reduce */, productionIndex: 28 }, { action: 1 /* Reduce */, productionIndex: 28 }, null, { action: 1 /* Reduce */, productionIndex: 28 }, null, null, { action: 1 /* Reduce */, productionIndex: 28 }, null, null, { action: 1 /* Reduce */, productionIndex: 28 }, null, { action: 1 /* Reduce */, productionIndex: 28 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 28 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 28 }, { action: 1 /* Reduce */, productionIndex: 28 }, null, { action: 1 /* Reduce */, productionIndex: 28 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 28 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 0 /* Shift */, nextState: 135 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 32 }, { action: 1 /* Reduce */, productionIndex: 32 }, { action: 1 /* Reduce */, productionIndex: 32 }, { action: 1 /* Reduce */, productionIndex: 32 }, { action: 1 /* Reduce */, productionIndex: 32 }, { action: 1 /* Reduce */, productionIndex: 32 }, { action: 1 /* Reduce */, productionIndex: 32 }, null, { action: 1 /* Reduce */, productionIndex: 32 }, { action: 1 /* Reduce */, productionIndex: 32 }, null, { action: 1 /* Reduce */, productionIndex: 32 }, { action: 1 /* Reduce */, productionIndex: 32 }, null, { action: 1 /* Reduce */, productionIndex: 32 }, null, null, { action: 1 /* Reduce */, productionIndex: 32 }, null, null, { action: 1 /* Reduce */, productionIndex: 32 }, null, { action: 1 /* Reduce */, productionIndex: 32 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 32 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 32 }, { action: 1 /* Reduce */, productionIndex: 32 }, null, { action: 1 /* Reduce */, productionIndex: 32 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 32 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 70 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 3 /* None */, nextState: 136 }, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 137 }, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 29 }, { action: 1 /* Reduce */, productionIndex: 29 }, { action: 1 /* Reduce */, productionIndex: 29 }, { action: 1 /* Reduce */, productionIndex: 29 }, { action: 1 /* Reduce */, productionIndex: 29 }, { action: 1 /* Reduce */, productionIndex: 29 }, { action: 1 /* Reduce */, productionIndex: 29 }, null, { action: 1 /* Reduce */, productionIndex: 29 }, { action: 1 /* Reduce */, productionIndex: 29 }, null, { action: 1 /* Reduce */, productionIndex: 29 }, { action: 1 /* Reduce */, productionIndex: 29 }, null, { action: 1 /* Reduce */, productionIndex: 29 }, null, null, { action: 1 /* Reduce */, productionIndex: 29 }, null, null, { action: 1 /* Reduce */, productionIndex: 29 }, null, { action: 1 /* Reduce */, productionIndex: 29 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 29 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 29 }, { action: 1 /* Reduce */, productionIndex: 29 }, null, { action: 1 /* Reduce */, productionIndex: 29 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 29 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 22 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, null, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, { action: 0 /* Shift */, nextState: 138 }, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 23 }, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 112 }, null, null, null, null, null, null, null, null, null, null, { action: 3 /* None */, nextState: 139 }, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 24 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]
    ];
    CoolToJS.productions = [
        { popCount: 2, reduceResult: null },
        { popCount: 2, reduceResult: 53 /* Program */ },
        { popCount: 3, reduceResult: 53 /* Program */ },
        { popCount: 2, reduceResult: 49 /* FeatureList */ },
        { popCount: 3, reduceResult: 49 /* FeatureList */ },
        { popCount: 7, reduceResult: 44 /* Class */ },
        { popCount: 6, reduceResult: 44 /* Class */ },
        { popCount: 5, reduceResult: 44 /* Class */ },
        { popCount: 1, reduceResult: 51 /* FormalList */ },
        { popCount: 3, reduceResult: 51 /* FormalList */ },
        { popCount: 9, reduceResult: 48 /* Feature */ },
        { popCount: 8, reduceResult: 48 /* Feature */ },
        { popCount: 5, reduceResult: 48 /* Feature */ },
        { popCount: 3, reduceResult: 48 /* Feature */ },
        { popCount: 3, reduceResult: 50 /* Formal */ },
        { popCount: 1, reduceResult: 46 /* ExpressionList */ },
        { popCount: 3, reduceResult: 46 /* ExpressionList */ },
        { popCount: 2, reduceResult: 47 /* ExpressionSeries */ },
        { popCount: 3, reduceResult: 47 /* ExpressionSeries */ },
        { popCount: 3, reduceResult: 52 /* LocalVariableDeclarationList */ },
        { popCount: 5, reduceResult: 52 /* LocalVariableDeclarationList */ },
        { popCount: 5, reduceResult: 52 /* LocalVariableDeclarationList */ },
        { popCount: 7, reduceResult: 52 /* LocalVariableDeclarationList */ },
        { popCount: 6, reduceResult: 43 /* CaseOption */ },
        { popCount: 7, reduceResult: 43 /* CaseOption */ },
        { popCount: 3, reduceResult: 45 /* Expression */ },
        { popCount: 5, reduceResult: 45 /* Expression */ },
        { popCount: 6, reduceResult: 45 /* Expression */ },
        { popCount: 7, reduceResult: 45 /* Expression */ },
        { popCount: 8, reduceResult: 45 /* Expression */ },
        { popCount: 3, reduceResult: 45 /* Expression */ },
        { popCount: 4, reduceResult: 45 /* Expression */ },
        { popCount: 7, reduceResult: 45 /* Expression */ },
        { popCount: 5, reduceResult: 45 /* Expression */ },
        { popCount: 3, reduceResult: 45 /* Expression */ },
        { popCount: 4, reduceResult: 45 /* Expression */ },
        { popCount: 5, reduceResult: 45 /* Expression */ },
        { popCount: 2, reduceResult: 45 /* Expression */ },
        { popCount: 2, reduceResult: 45 /* Expression */ },
        { popCount: 3, reduceResult: 45 /* Expression */ },
        { popCount: 3, reduceResult: 45 /* Expression */ },
        { popCount: 3, reduceResult: 45 /* Expression */ },
        { popCount: 3, reduceResult: 45 /* Expression */ },
        { popCount: 2, reduceResult: 45 /* Expression */ },
        { popCount: 3, reduceResult: 45 /* Expression */ },
        { popCount: 3, reduceResult: 45 /* Expression */ },
        { popCount: 3, reduceResult: 45 /* Expression */ },
        { popCount: 2, reduceResult: 45 /* Expression */ },
        { popCount: 3, reduceResult: 45 /* Expression */ },
        { popCount: 1, reduceResult: 45 /* Expression */ },
        { popCount: 1, reduceResult: 45 /* Expression */ },
        { popCount: 1, reduceResult: 45 /* Expression */ },
        { popCount: 1, reduceResult: 45 /* Expression */ },
        { popCount: 1, reduceResult: 45 /* Expression */ },
    ];
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    var SemanticAnalyzer = (function () {
        function SemanticAnalyzer() {
            var _this = this;
            this.Analyze = function (astConvertOutput) {
                var errorMessages = astConvertOutput.errorMessages || [];
                var warningMessages = astConvertOutput.warningMessages || [];
                var starterTypeEnvironment = {
                    currentClassType: null,
                    variableScope: [],
                    methodScope: []
                };
                _this.analyze(astConvertOutput.abstractSyntaxTree, starterTypeEnvironment, errorMessages, warningMessages);
                return {
                    success: errorMessages.length === 0,
                    errorMessages: errorMessages,
                    warningMessages: warningMessages
                };
            };
            // analyzes the current node and returns the inferred type name (if applicable)
            this.analyze = function (ast, typeEnvironment, errorMessages, warningMessages) {
                /* PROGRAM */
                if (ast.type === 0 /* Program */) {
                    var programNode = ast;
                    _this.addBuiltinObjects(programNode);
                    _this.buildInheritanceGraph(programNode);
                    // ensure that exactly 1 Main class is defined and that all class names are unique
                    var mainClass;
                    var duplicateClasses = [];
                    for (var i = 0; i < programNode.classList.length; i++) {
                        if (!mainClass && programNode.classList[i].className === 'Main') {
                            mainClass = programNode.classList[i];
                        }
                        if (programNode.classList.map(function (c) {
                            return c.className;
                        }).slice(0, i).indexOf(programNode.classList[i].className) !== -1) {
                            duplicateClasses.push(programNode.classList[i]);
                        }
                    }
                    if (!mainClass) {
                        errorMessages.push({
                            location: null,
                            message: 'Class "Main" is not defined'
                        });
                    }
                    duplicateClasses.forEach(function (classNode) {
                        errorMessages.push({
                            location: classNode.token.location,
                            message: 'Class "' + classNode.className + '" was previously defined'
                        });
                    });
                    // ensure that at least one main() method is defined in class Main and 
                    // that it takes no parameters
                    if (mainClass) {
                        var mainMethod;
                        for (var i = 0; i < mainClass.methodList.length; i++) {
                            if (mainClass.methodList[i].methodName === 'main') {
                                mainMethod = mainClass.methodList[i];
                                break;
                            }
                        }
                        if (!mainMethod) {
                            errorMessages.push({
                                location: mainClass.token.location,
                                message: 'No "main" method in class "Main"'
                            });
                        }
                        else if (mainMethod.hasParameters) {
                            errorMessages.push({
                                location: mainMethod.token.location,
                                message: '"main" method in class "Main" should have no arguments'
                            });
                        }
                    }
                    ast.children.forEach(function (node) {
                        _this.analyze(node, typeEnvironment, errorMessages, warningMessages);
                    });
                }
                else if (ast.type === 1 /* Class */) {
                    var classNode = ast;
                    typeEnvironment.currentClassType = classNode.className;
                    typeEnvironment.methodScope = [];
                    // add this class's superclass's methods to the methodscope
                    var superClass = _this.findTypeHeirarchy(classNode.className).parent;
                    var methodsToAddToScope = [];
                    while (superClass) {
                        superClass.classNode.methodList.forEach(function (methodNode) {
                            var newMethodScopeItem = {
                                methodName: methodNode.methodName,
                                methodReturnType: methodNode.returnTypeName,
                                methodParameters: []
                            };
                            methodNode.parameters.forEach(function (param) {
                                newMethodScopeItem.methodParameters.push({
                                    parameterName: param.parameterName,
                                    parameterType: param.parameterTypeName
                                });
                            });
                            methodsToAddToScope.push(newMethodScopeItem);
                        });
                        superClass = superClass.parent;
                    }
                    // add them to the methodscope in reverse order so the most basic methods
                    // appear on the bottom of the stack
                    typeEnvironment.methodScope = typeEnvironment.methodScope.concat(methodsToAddToScope.reverse());
                    // ensure that all method names are unique
                    var duplicateMethods = [];
                    for (var i = 0; i < classNode.methodList.length; i++) {
                        if (classNode.methodList.map(function (c) {
                            return c.methodName;
                        }).slice(0, i).indexOf(classNode.methodList[i].methodName) !== -1) {
                            duplicateMethods.push(classNode.methodList[i]);
                        }
                        else {
                            // add valid methods to the current methodScope
                            var newMethodScopeItem = {
                                methodName: classNode.methodList[i].methodName,
                                methodReturnType: classNode.methodList[i].returnTypeName,
                                methodParameters: []
                            };
                            classNode.methodList[i].parameters.forEach(function (param) {
                                newMethodScopeItem.methodParameters.push({
                                    parameterName: param.parameterName,
                                    parameterType: param.parameterTypeName
                                });
                            });
                            typeEnvironment.methodScope.push(newMethodScopeItem);
                        }
                    }
                    duplicateMethods.forEach(function (methodNode) {
                        errorMessages.push({
                            location: methodNode.token.location,
                            message: 'Method "' + methodNode.methodName + '" is multiply defined in class "' + classNode.className + '"'
                        });
                    });
                    // ensure that all property names are unique
                    var duplicateProperties = [];
                    for (var i = 0; i < classNode.propertyList.length; i++) {
                        if (classNode.propertyList.map(function (c) {
                            return c.propertyName;
                        }).slice(0, i).indexOf(classNode.propertyList[i].propertyName) !== -1) {
                            duplicateProperties.push(classNode.propertyList[i]);
                        }
                    }
                    duplicateProperties.forEach(function (propertyNode) {
                        errorMessages.push({
                            location: propertyNode.token.location,
                            message: 'Property "' + propertyNode.propertyName + '" is multiply defined in class "' + classNode.className + '"'
                        });
                    });
                    ast.children.forEach(function (node) {
                        _this.analyze(node, typeEnvironment, errorMessages, warningMessages);
                    });
                }
                else if (ast.type === 2 /* Property */) {
                    var propertyNode = ast;
                    if (propertyNode.hasInitializer) {
                        var initializerType = _this.analyze(propertyNode.propertyInitializerExpression, typeEnvironment, errorMessages, warningMessages);
                        if (!_this.isAssignableFrom(propertyNode.typeName, initializerType)) {
                            _this.addTypeError(propertyNode.typeName, initializerType, propertyNode.token.location, errorMessages);
                        }
                    }
                }
                else if (ast.type === 3 /* Method */) {
                    return null;
                }
                else if (ast.type === 4 /* AssignmentExpression */) {
                    var assignmentExpressionNode = ast;
                    for (var i = typeEnvironment.variableScope.length - 1; i >= 0; i--) {
                        if (typeEnvironment.variableScope[i].variableName === assignmentExpressionNode.identifierName) {
                            var expressionType = _this.analyze(assignmentExpressionNode.assignmentExpression, typeEnvironment, errorMessages, warningMessages);
                            if (!_this.isAssignableFrom(typeEnvironment.variableScope[i].variableType, expressionType)) {
                                _this.addTypeError(typeEnvironment.variableScope[i].variableType, expressionType, assignmentExpressionNode.token.location, errorMessages);
                            }
                            return expressionType;
                        }
                    }
                    errorMessages.push({
                        location: assignmentExpressionNode.token.location,
                        message: 'Assignment to undeclared variable "' + assignmentExpressionNode.identifierName + '"'
                    });
                    return _this.unknownType;
                }
                else if (ast.type === 5 /* MethodCallExpression */) {
                    var methodCallExpressionNode = ast;
                    var methodTargetType;
                    if (!methodCallExpressionNode.isCallToParent && !methodCallExpressionNode.isCallToSelf) {
                        methodTargetType = _this.analyze(methodCallExpressionNode.targetExpression, typeEnvironment, errorMessages, warningMessages);
                    }
                    else if (!methodCallExpressionNode.isCallToParent) {
                        methodTargetType = typeEnvironment.currentClassType;
                    }
                    else if (!methodCallExpressionNode.isCallToSelf) {
                        methodTargetType = methodCallExpressionNode.explicitParentCallTypeName;
                    }
                    else {
                        throw 'MethodCallExpressionNode should not have both isCallToParent = true AND isCallToSelf = true';
                    }
                    for (var i = typeEnvironment.methodScope.length - 1; i >= 0; i--) {
                        if (typeEnvironment.methodScope[i].methodName === methodCallExpressionNode.methodName) {
                            if (typeEnvironment.methodScope[i].methodParameters.length !== methodCallExpressionNode.parameterExpressionList.length) {
                                errorMessages.push({
                                    location: methodCallExpressionNode.token.location,
                                    message: ('Method "' + methodCallExpressionNode.methodName + '" takes exactly ' + typeEnvironment.methodScope[i].methodParameters.length + ' parameter' + (typeEnvironment.methodScope[i].methodParameters.length === 1 ? '' : 's') + '. ' + methodCallExpressionNode.parameterExpressionList.length + ' parameter' + (methodCallExpressionNode.parameterExpressionList.length === 1 ? '' : 's') + ' were provided.')
                                });
                            }
                            return typeEnvironment.methodScope[i].methodReturnType;
                        }
                    }
                    errorMessages.push({
                        location: methodCallExpressionNode.token.location,
                        message: 'Call to undefined method "' + methodCallExpressionNode.methodName + '"'
                    });
                    return _this.unknownType;
                }
                else if (ast.type === 8 /* BlockExpression */) {
                    var blockExpressionNode = ast;
                    var returnType;
                    blockExpressionNode.expressionList.forEach(function (expressionNode) {
                        returnType = _this.analyze(expressionNode, typeEnvironment, errorMessages, warningMessages);
                    });
                    return returnType;
                }
                else if (ast.type === 9 /* LetExpression */) {
                    var letExpressionNode = ast;
                    // add the new variables to the scope
                    letExpressionNode.localVariableDeclarations.forEach(function (varDeclarationNode) {
                        typeEnvironment.variableScope.push({
                            variableName: varDeclarationNode.identifierName,
                            variableType: varDeclarationNode.typeName
                        });
                    });
                    var returnType = _this.analyze(letExpressionNode.letBodyExpression, typeEnvironment, errorMessages, warningMessages);
                    // remove the added variables from the scope
                    typeEnvironment.variableScope.splice(typeEnvironment.variableScope.length - letExpressionNode.localVariableDeclarations.length, letExpressionNode.localVariableDeclarations.length);
                    return returnType;
                }
                else if (ast.type === 13 /* NewExpression */) {
                    var newExpressionNode = ast;
                    return newExpressionNode.typeName;
                }
                else if (ast.type === 18 /* ObjectIdentifierExpression */) {
                    var objectIdExpressionNode = ast;
                    for (var i = typeEnvironment.variableScope.length - 1; i >= 0; i--) {
                        if (typeEnvironment.variableScope[i].variableName === objectIdExpressionNode.objectIdentifierName) {
                            return typeEnvironment.variableScope[i].variableType;
                        }
                    }
                    errorMessages.push({
                        location: objectIdExpressionNode.token.location,
                        message: 'Undeclared variable "' + objectIdExpressionNode.objectIdentifierName + '"'
                    });
                    return _this.unknownType;
                }
                else if (ast.type === 19 /* IntegerLiteralExpression */) {
                    return 'Int';
                }
                else if (ast.type === 20 /* StringLiteralExpression */) {
                    return 'String';
                }
                else if (ast.type === 21 /* TrueKeywordExpression */ || ast.type === 22 /* FalseKeywordExpression */) {
                    return 'Bool';
                }
                else
                    return _this.unknownType;
            };
            this.unknownType = '$UnknownType$';
        }
        SemanticAnalyzer.prototype.typeExists = function (typeName) {
            return this.findTypeHeirarchy(typeName) !== null;
        };
        SemanticAnalyzer.prototype.findTypeHeirarchy = function (typeName) {
            var findTypeHeirarchy = function (typeHeirachy) {
                if (typeHeirachy.typeName === typeName) {
                    return typeHeirachy;
                }
                else {
                    for (var i = 0; i < typeHeirachy.children.length; i++) {
                        var findTypeResult = findTypeHeirarchy(typeHeirachy.children[i]);
                        if (findTypeResult) {
                            return findTypeResult;
                        }
                    }
                }
                return null;
            };
            return findTypeHeirarchy(this.inheritanceGraph);
        };
        // determines whether one class either inherits or is another
        // examples:
        // isAssignableFrom('BaseClass', 'SubClass') => true
        // isAssignableFrom('SubClass', 'BaseClass') => false
        // isAssignableFrom('SubClass', 'SubClass') => true
        SemanticAnalyzer.prototype.isAssignableFrom = function (type1Name, type2Name) {
            // shortcut for performance
            if (type1Name === type2Name) {
                return true;
            }
            if (type1Name === this.unknownType || type2Name === this.unknownType) {
                return true;
            }
            //temporary
            if (type1Name === 'SELF_TYPE' || type2Name === 'SELF_TYPE') {
                return true;
            }
            var typeHeirarchy2 = this.findTypeHeirarchy(type2Name);
            if (typeHeirarchy2) {
                while (typeHeirarchy2 != null) {
                    if (typeHeirarchy2.typeName === type1Name) {
                        return true;
                    }
                    typeHeirarchy2 = typeHeirarchy2.parent;
                }
                return false;
            }
            throw 'Type "' + type2Name + '" does not exist!';
        };
        SemanticAnalyzer.prototype.addTypeError = function (type1Name, type2Name, location, errorMessages) {
            errorMessages.push({
                location: location,
                message: 'Type "' + type2Name + '" is not assignable to type "' + type1Name + '"'
            });
        };
        // adds the implied classes (Object, IO, Integer, etc.)
        // to our program node's class list
        SemanticAnalyzer.prototype.addBuiltinObjects = function (programNode) {
            // Object class
            var objectClass = new CoolToJS.ClassNode('Object');
            var abortMethodNode = new CoolToJS.MethodNode();
            abortMethodNode.methodName = 'abort';
            abortMethodNode.returnTypeName = 'Object';
            objectClass.children.push(abortMethodNode);
            var typeNameMethodNode = new CoolToJS.MethodNode();
            typeNameMethodNode.methodName = 'type_name';
            typeNameMethodNode.returnTypeName = 'String';
            objectClass.children.push(typeNameMethodNode);
            var copyMethodNode = new CoolToJS.MethodNode();
            copyMethodNode.methodName = 'copy';
            copyMethodNode.returnTypeName = 'SELF_TYPE';
            objectClass.children.push(copyMethodNode);
            programNode.children.push(objectClass);
            // IO Class
            var ioClass = new CoolToJS.ClassNode('IO');
            var outStringMethodNode = new CoolToJS.MethodNode();
            outStringMethodNode.methodName = 'out_string';
            outStringMethodNode.returnTypeName = 'SELF_TYPE';
            outStringMethodNode.parameters.push({
                parameterName: 'x',
                parameterTypeName: 'String'
            });
            ioClass.children.push(outStringMethodNode);
            var outIntMethodNode = new CoolToJS.MethodNode();
            outIntMethodNode.methodName = 'out_int';
            outIntMethodNode.returnTypeName = 'SELF_TYPE';
            outIntMethodNode.parameters.push({
                parameterName: 'x',
                parameterTypeName: 'Int'
            });
            ioClass.children.push(outIntMethodNode);
            var inStringMethodNode = new CoolToJS.MethodNode();
            inStringMethodNode.methodName = 'in_string';
            inStringMethodNode.returnTypeName = 'String';
            ioClass.children.push(inStringMethodNode);
            var inIntMethodNode = new CoolToJS.MethodNode();
            inIntMethodNode.methodName = 'in_int';
            inIntMethodNode.returnTypeName = 'Int';
            ioClass.children.push(inIntMethodNode);
            programNode.children.push(ioClass);
            // Int
            var intClass = new CoolToJS.ClassNode('Int');
            programNode.children.push(intClass);
            // String
            var stringClass = new CoolToJS.ClassNode('String');
            var lengthMethodNode = new CoolToJS.MethodNode();
            lengthMethodNode.methodName = 'length';
            lengthMethodNode.returnTypeName = 'String';
            stringClass.children.push(lengthMethodNode);
            var concatMethodNode = new CoolToJS.MethodNode();
            concatMethodNode.methodName = 'concat';
            concatMethodNode.returnTypeName = 'String';
            concatMethodNode.parameters.push({
                parameterName: 's',
                parameterTypeName: 'String'
            });
            stringClass.children.push(concatMethodNode);
            var substrMethodNode = new CoolToJS.MethodNode();
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
            var boolClass = new CoolToJS.ClassNode('Bool');
            programNode.children.push(boolClass);
        };
        // constructs a heirarchy of all referenced classes
        // to allow for future inheritance checking
        SemanticAnalyzer.prototype.buildInheritanceGraph = function (programNode) {
            var _this = this;
            // create TypeHierarchy objects for every class defined in this program
            var allTypes = programNode.classList.map(function (c) {
                return {
                    parentName: c.superClassName || 'Object',
                    typeHeirarchy: new TypeHeirarchy(c)
                };
            });
            // assemble a tree out of the list of TypeHierarchy's from above
            allTypes.forEach(function (typeAndParent, i) {
                if (typeAndParent.typeHeirarchy.typeName === 'Object') {
                    _this.inheritanceGraph = typeAndParent.typeHeirarchy;
                }
                for (var j = 0; j < allTypes.length; j++) {
                    if (j === i)
                        continue;
                    if (typeAndParent.parentName === allTypes[j].typeHeirarchy.typeName) {
                        typeAndParent.typeHeirarchy.parent = allTypes[j].typeHeirarchy;
                        allTypes[j].typeHeirarchy.children.push(typeAndParent.typeHeirarchy);
                    }
                }
            });
        };
        return SemanticAnalyzer;
    })();
    CoolToJS.SemanticAnalyzer = SemanticAnalyzer;
    var TypeHeirarchy = (function () {
        function TypeHeirarchy(classNode) {
            this.children = [];
            this.classNode = classNode;
        }
        Object.defineProperty(TypeHeirarchy.prototype, "typeName", {
            get: function () {
                return this.classNode.className;
            },
            enumerable: true,
            configurable: true
        });
        return TypeHeirarchy;
    })();
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    var DontCompile;
    (function (DontCompile) {
        (function (SyntaxKind) {
            SyntaxKind[SyntaxKind["EndOfInput"] = 0] = "EndOfInput";
            SyntaxKind[SyntaxKind["OpenParenthesis"] = 1] = "OpenParenthesis";
            SyntaxKind[SyntaxKind["ClosedParenthesis"] = 2] = "ClosedParenthesis";
            SyntaxKind[SyntaxKind["MultiplicationOperator"] = 3] = "MultiplicationOperator";
            SyntaxKind[SyntaxKind["AdditionOperator"] = 4] = "AdditionOperator";
            SyntaxKind[SyntaxKind["Integer"] = 5] = "Integer";
            SyntaxKind[SyntaxKind["E"] = 6] = "E";
            SyntaxKind[SyntaxKind["WhiteSpace"] = 100] = "WhiteSpace";
            SyntaxKind[SyntaxKind["CarriageReturn"] = 101] = "CarriageReturn";
            SyntaxKind[SyntaxKind["NewLine"] = 102] = "NewLine";
            SyntaxKind[SyntaxKind["Tab"] = 103] = "Tab";
            // not used in this grammar - only added here so we can compile
            SyntaxKind[SyntaxKind["String"] = 1000] = "String";
            SyntaxKind[SyntaxKind["Comment"] = 1001] = "Comment";
        })(DontCompile.SyntaxKind || (DontCompile.SyntaxKind = {}));
        var SyntaxKind = DontCompile.SyntaxKind;
        DontCompile.StartSyntaxKind = 6 /* E */;
        // order signifies priority (keywords are listed first)
        DontCompile.TokenLookup = [
            {
                token: 5 /* Integer */,
                regex: /^([0-9]+)\b/,
            },
            {
                token: 3 /* MultiplicationOperator */,
                regex: /^(\*)/
            },
            {
                token: 4 /* AdditionOperator */,
                regex: /^(\+)/
            },
            {
                token: 1 /* OpenParenthesis */,
                regex: /^(\()/
            },
            {
                token: 2 /* ClosedParenthesis */,
                regex: /^(\))/
            },
            {
                token: 100 /* WhiteSpace */,
                regex: /^( +)/,
            },
            {
                token: 101 /* CarriageReturn */,
                regex: /^(\r)/,
            },
            {
                token: 102 /* NewLine */,
                regex: /^(\n)/,
            },
            {
                token: 103 /* Tab */,
                regex: /^(\t)/,
            },
        ];
        function isKeyword(tokenType) {
            return false;
        }
        DontCompile.isKeyword = isKeyword;
    })(DontCompile = CoolToJS.DontCompile || (CoolToJS.DontCompile = {}));
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    // the number values of these enums are the values used in the
    // slr(1) parse table.  Use caution when changing these values.
    (function (SyntaxKind) {
        SyntaxKind[SyntaxKind["EndOfInput"] = 0] = "EndOfInput";
        SyntaxKind[SyntaxKind["OpenParenthesis"] = 1] = "OpenParenthesis";
        SyntaxKind[SyntaxKind["ClosedParenthesis"] = 2] = "ClosedParenthesis";
        SyntaxKind[SyntaxKind["MultiplationOperator"] = 3] = "MultiplationOperator";
        SyntaxKind[SyntaxKind["AdditionOperator"] = 4] = "AdditionOperator";
        SyntaxKind[SyntaxKind["Comma"] = 5] = "Comma";
        SyntaxKind[SyntaxKind["SubtractionOperator"] = 6] = "SubtractionOperator";
        SyntaxKind[SyntaxKind["DotOperator"] = 7] = "DotOperator";
        SyntaxKind[SyntaxKind["DivisionOperator"] = 8] = "DivisionOperator";
        SyntaxKind[SyntaxKind["Colon"] = 9] = "Colon";
        SyntaxKind[SyntaxKind["SemiColon"] = 10] = "SemiColon";
        SyntaxKind[SyntaxKind["LessThanOperator"] = 11] = "LessThanOperator";
        SyntaxKind[SyntaxKind["AssignmentOperator"] = 12] = "AssignmentOperator";
        SyntaxKind[SyntaxKind["LessThanOrEqualsOperator"] = 13] = "LessThanOrEqualsOperator";
        SyntaxKind[SyntaxKind["EqualsOperator"] = 14] = "EqualsOperator";
        SyntaxKind[SyntaxKind["FatArrowOperator"] = 15] = "FatArrowOperator";
        SyntaxKind[SyntaxKind["AtSignOperator"] = 16] = "AtSignOperator";
        SyntaxKind[SyntaxKind["CaseKeyword"] = 17] = "CaseKeyword";
        SyntaxKind[SyntaxKind["ClassKeyword"] = 18] = "ClassKeyword";
        SyntaxKind[SyntaxKind["ElseKeyword"] = 19] = "ElseKeyword";
        SyntaxKind[SyntaxKind["EsacKeyword"] = 20] = "EsacKeyword";
        SyntaxKind[SyntaxKind["FalseKeyword"] = 21] = "FalseKeyword";
        SyntaxKind[SyntaxKind["FiKeyword"] = 22] = "FiKeyword";
        SyntaxKind[SyntaxKind["IfKeyword"] = 23] = "IfKeyword";
        SyntaxKind[SyntaxKind["InKeyword"] = 24] = "InKeyword";
        SyntaxKind[SyntaxKind["InheritsKeyword"] = 25] = "InheritsKeyword";
        SyntaxKind[SyntaxKind["Integer"] = 26] = "Integer";
        SyntaxKind[SyntaxKind["IsvoidKeyword"] = 27] = "IsvoidKeyword";
        SyntaxKind[SyntaxKind["LetKeyword"] = 28] = "LetKeyword";
        SyntaxKind[SyntaxKind["LoopKeyword"] = 29] = "LoopKeyword";
        SyntaxKind[SyntaxKind["NewKeyword"] = 30] = "NewKeyword";
        SyntaxKind[SyntaxKind["NotKeyword"] = 31] = "NotKeyword";
        SyntaxKind[SyntaxKind["ObjectIdentifier"] = 32] = "ObjectIdentifier";
        SyntaxKind[SyntaxKind["OfKeyword"] = 33] = "OfKeyword";
        SyntaxKind[SyntaxKind["PoolKeyword"] = 34] = "PoolKeyword";
        SyntaxKind[SyntaxKind["String"] = 35] = "String";
        SyntaxKind[SyntaxKind["ThenKeyword"] = 36] = "ThenKeyword";
        SyntaxKind[SyntaxKind["TrueKeyword"] = 37] = "TrueKeyword";
        SyntaxKind[SyntaxKind["TypeIdentifier"] = 38] = "TypeIdentifier";
        SyntaxKind[SyntaxKind["WhileKeyword"] = 39] = "WhileKeyword";
        SyntaxKind[SyntaxKind["OpenCurlyBracket"] = 40] = "OpenCurlyBracket";
        SyntaxKind[SyntaxKind["ClosedCurlyBracket"] = 41] = "ClosedCurlyBracket";
        SyntaxKind[SyntaxKind["TildeOperator"] = 42] = "TildeOperator";
        SyntaxKind[SyntaxKind["CaseOption"] = 43] = "CaseOption";
        SyntaxKind[SyntaxKind["Class"] = 44] = "Class";
        SyntaxKind[SyntaxKind["Expression"] = 45] = "Expression";
        SyntaxKind[SyntaxKind["ExpressionList"] = 46] = "ExpressionList";
        SyntaxKind[SyntaxKind["ExpressionSeries"] = 47] = "ExpressionSeries";
        SyntaxKind[SyntaxKind["Feature"] = 48] = "Feature";
        SyntaxKind[SyntaxKind["FeatureList"] = 49] = "FeatureList";
        SyntaxKind[SyntaxKind["Formal"] = 50] = "Formal";
        SyntaxKind[SyntaxKind["FormalList"] = 51] = "FormalList";
        SyntaxKind[SyntaxKind["LocalVariableDeclarationList"] = 52] = "LocalVariableDeclarationList";
        SyntaxKind[SyntaxKind["Program"] = 53] = "Program";
        SyntaxKind[SyntaxKind["WhiteSpace"] = 54] = "WhiteSpace";
        SyntaxKind[SyntaxKind["CarriageReturn"] = 55] = "CarriageReturn";
        SyntaxKind[SyntaxKind["NewLine"] = 56] = "NewLine";
        SyntaxKind[SyntaxKind["Tab"] = 57] = "Tab";
        SyntaxKind[SyntaxKind["Comment"] = 58] = "Comment";
    })(CoolToJS.SyntaxKind || (CoolToJS.SyntaxKind = {}));
    var SyntaxKind = CoolToJS.SyntaxKind;
    CoolToJS.StartSyntaxKind = 53 /* Program */;
    // order signifies priority (keywords are listed first)
    CoolToJS.TokenLookup = [
        {
            token: 18 /* ClassKeyword */,
            regex: /^(class)\b/i,
        },
        {
            token: 19 /* ElseKeyword */,
            regex: /^(else)\b/i,
        },
        {
            token: 21 /* FalseKeyword */,
            regex: /^(f[aA][lL][sS][eE])\b/,
        },
        {
            token: 37 /* TrueKeyword */,
            regex: /^(t[rR][uU][eE])\b/,
        },
        {
            token: 22 /* FiKeyword */,
            regex: /^(fi)\b/i,
        },
        {
            token: 23 /* IfKeyword */,
            regex: /^(if)\b/i,
        },
        {
            token: 25 /* InheritsKeyword */,
            regex: /^(inherits)\b/i,
        },
        {
            token: 27 /* IsvoidKeyword */,
            regex: /^(isvoid)\b/i,
        },
        {
            token: 28 /* LetKeyword */,
            regex: /^(let)\b/i,
        },
        {
            token: 24 /* InKeyword */,
            regex: /^(in)\b/i,
        },
        {
            token: 29 /* LoopKeyword */,
            regex: /^(loop)\b/i,
        },
        {
            token: 34 /* PoolKeyword */,
            regex: /^(pool)\b/i,
        },
        {
            token: 36 /* ThenKeyword */,
            regex: /^(then)\b/i,
        },
        {
            token: 39 /* WhileKeyword */,
            regex: /^(while)\b/i,
        },
        {
            token: 17 /* CaseKeyword */,
            regex: /^(case)\b/i,
        },
        {
            token: 20 /* EsacKeyword */,
            regex: /^(esac)\b/i,
        },
        {
            token: 30 /* NewKeyword */,
            regex: /^(new)\b/i,
        },
        {
            token: 33 /* OfKeyword */,
            regex: /^(of)\b/i,
        },
        {
            token: 31 /* NotKeyword */,
            regex: /^(not)\b/i,
        },
        {
            token: 26 /* Integer */,
            regex: /^([0-9]+)\b/,
        },
        {
            token: 35 /* String */,
            matchFunction: function (input) {
                // for a single-line string
                var singleLineMatch = /^("(?:[^\\]|\\.)*?")/.exec(input);
                if (singleLineMatch !== null && typeof singleLineMatch[1] !== 'undefined') {
                    return singleLineMatch[1];
                }
                // for a multi-line string
                var fullMatch = null;
                var firstLineMatch = /^(".*\\[\s]*\n)/.exec(input);
                if (firstLineMatch !== null && typeof firstLineMatch[1] !== 'undefined') {
                    if (stringContainsUnescapedQuotes(firstLineMatch[1])) {
                        return null;
                    }
                    fullMatch = firstLineMatch[1];
                    input = input.slice(firstLineMatch[1].length);
                    var middleLineRegex = /^(.*\\[\s]*\n)/;
                    var middleLineMatch = middleLineRegex.exec(input);
                    while (middleLineMatch !== null && typeof middleLineMatch[1] !== 'undefined' && !(stringContainsUnescapedQuotes(middleLineMatch[1]))) {
                        fullMatch += middleLineMatch[1];
                        input = input.slice(middleLineMatch[1].length);
                        middleLineMatch = middleLineRegex.exec(input);
                    }
                    var lastLineMatch = /^(.*?[^\\]")/.exec(input);
                    if (lastLineMatch !== null && lastLineMatch[1] !== 'undefined') {
                        fullMatch += lastLineMatch[1];
                        return fullMatch;
                    }
                    else {
                        return null;
                    }
                }
                else {
                    return null;
                }
            }
        },
        {
            token: 32 /* ObjectIdentifier */,
            regex: /^([a-z][a-zA-Z0-9_]*)\b/,
        },
        {
            token: 38 /* TypeIdentifier */,
            regex: /^([A-Z][a-zA-Z0-9_]*)\b/,
        },
        {
            token: 54 /* WhiteSpace */,
            regex: /^( +)/,
        },
        {
            token: 55 /* CarriageReturn */,
            regex: /^(\r)/,
        },
        {
            token: 56 /* NewLine */,
            regex: /^(\n)/,
        },
        {
            token: 57 /* Tab */,
            regex: /^(\t)/,
        },
        {
            token: 58 /* Comment */,
            regex: /^((?:--.*)|(?:\(\*(?:(?!\*\))[\s\S])*\*\)))/,
        },
        {
            token: 7 /* DotOperator */,
            regex: /^(\.)/
        },
        {
            token: 16 /* AtSignOperator */,
            regex: /^(\@)/
        },
        {
            token: 42 /* TildeOperator */,
            regex: /^(~)/
        },
        {
            token: 3 /* MultiplationOperator */,
            regex: /^(\*)/
        },
        {
            token: 8 /* DivisionOperator */,
            regex: /^(\/)/
        },
        {
            token: 4 /* AdditionOperator */,
            regex: /^(\+)/
        },
        {
            token: 6 /* SubtractionOperator */,
            regex: /^(-)/
        },
        {
            token: 13 /* LessThanOrEqualsOperator */,
            regex: /^(<=)/
        },
        {
            token: 11 /* LessThanOperator */,
            regex: /^(<)/
        },
        {
            token: 14 /* EqualsOperator */,
            regex: /^(=)/
        },
        {
            token: 12 /* AssignmentOperator */,
            regex: /^(<-)/
        },
        {
            token: 15 /* FatArrowOperator */,
            regex: /^(=>)/
        },
        {
            token: 1 /* OpenParenthesis */,
            regex: /^(\()/
        },
        {
            token: 2 /* ClosedParenthesis */,
            regex: /^(\))/
        },
        {
            token: 40 /* OpenCurlyBracket */,
            regex: /^(\{)/
        },
        {
            token: 41 /* ClosedCurlyBracket */,
            regex: /^(\})/
        },
        {
            token: 9 /* Colon */,
            regex: /^(:)/
        },
        {
            token: 10 /* SemiColon */,
            regex: /^(;)/
        },
        {
            token: 5 /* Comma */,
            regex: /^(,)/
        }
    ];
    function isKeyword(tokenType) {
        return (tokenType == 18 /* ClassKeyword */ || tokenType == 19 /* ElseKeyword */ || tokenType == 21 /* FalseKeyword */ || tokenType == 22 /* FiKeyword */ || tokenType == 23 /* IfKeyword */ || tokenType == 24 /* InKeyword */ || tokenType == 25 /* InheritsKeyword */ || tokenType == 27 /* IsvoidKeyword */ || tokenType == 28 /* LetKeyword */ || tokenType == 29 /* LoopKeyword */ || tokenType == 34 /* PoolKeyword */ || tokenType == 36 /* ThenKeyword */ || tokenType == 39 /* WhileKeyword */ || tokenType == 17 /* CaseKeyword */ || tokenType == 20 /* EsacKeyword */ || tokenType == 30 /* NewKeyword */ || tokenType == 33 /* OfKeyword */ || tokenType == 31 /* NotKeyword */ || tokenType == 37 /* TrueKeyword */);
    }
    CoolToJS.isKeyword = isKeyword;
    function stringContainsUnescapedQuotes(input, ignoreFinalQuote) {
        if (ignoreFinalQuote === void 0) { ignoreFinalQuote = false; }
        if (ignoreFinalQuote) {
            return /[^\\]".+/.test(input);
        }
        else {
            return /[^\\]"/.test(input);
        }
    }
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    // temporary
    var generatedJavaScriptExample = '\
// note that this generated code is currently hardcoded\n\
// while the transpiler is being built\n\
\n\
function _out_string(output) {\n\
    window.consoleController.report([{\n\
        msg: output,\n\
        className: "jquery-console-output"\n\
    }]);\n\
}\n\
\n\
function _in_string(callback) {\n\
    window.inputFunction = function(input) {\n\
        callback(input);\n\
    };\n\
}\n\
\n\
var hello = "Hello, ",\n\
	name = "",\n\
    ending = "!\\n";\n\
\n\
_out_string("Please enter your name:\\n");\n\
_in_string(function(input) {\n\
    name = input;\n\
    _out_string(hello + name + ending);\n\
});\n\
';
    function Transpile(transpilerOptions) {
        var startTime = Date.now();
        var coolProgramSources = transpilerOptions.coolProgramSources;
        if (typeof coolProgramSources === 'string') {
            var concatenatedCoolProgram = coolProgramSources;
        }
        else {
            var concatenatedCoolProgram = coolProgramSources.join('\n');
        }
        if (transpilerOptions.out_string) {
            var out_string = transpilerOptions.out_string;
        }
        else {
            var out_string = function (output) {
                console.log(output);
            };
        }
        if (transpilerOptions.out_int) {
            var out_int = transpilerOptions.out_int;
        }
        else {
            var out_int = function (output) {
                console.log(output);
            };
        }
        if (transpilerOptions.in_string) {
            var in_string = transpilerOptions.in_string;
        }
        else {
            var in_string = function (onInput) {
            };
        }
        if (transpilerOptions.in_int) {
            var in_int = transpilerOptions.in_int;
        }
        else {
            var in_int = function (onInput) {
            };
        }
        var lexicalAnalyzer = new CoolToJS.LexicalAnalyzer();
        var lexicalAnalyzerOutput = lexicalAnalyzer.Analyze(concatenatedCoolProgram);
        if (!lexicalAnalyzerOutput.success) {
            return {
                success: false,
                errorMessages: lexicalAnalyzerOutput.errorMessages,
                elapsedTime: Date.now() - startTime
            };
        }
        var parser = new CoolToJS.Parser();
        var parserOutput = parser.Parse(lexicalAnalyzerOutput);
        if (!parserOutput.success) {
            return {
                success: false,
                errorMessages: parserOutput.errorMessages,
                warningMessages: parserOutput.warningMessages,
                elapsedTime: Date.now() - startTime
            };
        }
        var astConverter = new CoolToJS.AbstractSyntaxTreeConverter();
        var astConvertOutput = astConverter.Convert(parserOutput);
        //console.log(Utility.stringify(ast));
        var semanticAnalyzer = new CoolToJS.SemanticAnalyzer();
        var semanticAnalyzerOutput = semanticAnalyzer.Analyze(astConvertOutput);
        return {
            success: semanticAnalyzerOutput.errorMessages.length === 0,
            errorMessages: semanticAnalyzerOutput.errorMessages,
            warningMessages: parserOutput.warningMessages,
            generatedJavaScript: generatedJavaScriptExample,
            elapsedTime: Date.now() - startTime
        };
    }
    CoolToJS.Transpile = Transpile;
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    var Utility;
    (function (Utility) {
        function PrintSyntaxTree(syntaxTree, indent, last) {
            if (indent === void 0) { indent = ''; }
            if (last === void 0) { last = true; }
            var stringToWrite = indent;
            if (last) {
                stringToWrite += '\\-';
                indent += '  ';
            }
            else {
                stringToWrite += '|-';
                indent += '| ';
            }
            console.log(stringToWrite + CoolToJS.SyntaxKind[syntaxTree.syntaxKind]);
            for (var i = 0; i < syntaxTree.children.length; i++) {
                Utility.PrintSyntaxTree(syntaxTree.children[i], indent, i === syntaxTree.children.length - 1);
            }
        }
        Utility.PrintSyntaxTree = PrintSyntaxTree;
        function ShallowCopySyntaxTree(syntaxTree, parentTree) {
            if (parentTree === void 0) { parentTree = null; }
            var newTree = {
                syntaxKind: syntaxTree.syntaxKind,
                syntaxKindName: CoolToJS.SyntaxKind[syntaxTree.syntaxKind],
                token: syntaxTree.token,
                children: [],
                parent: parentTree
            };
            for (var i = 0; i < syntaxTree.children.length; i++) {
                newTree.children.push(ShallowCopySyntaxTree(syntaxTree.children[i], newTree));
            }
            return newTree;
        }
        Utility.ShallowCopySyntaxTree = ShallowCopySyntaxTree;
        function isNullUndefinedOrWhitespace(s) {
            return typeof s === 'undefined' || s === null || !/\S/.test(s);
        }
        Utility.isNullUndefinedOrWhitespace = isNullUndefinedOrWhitespace;
        // from http://stackoverflow.com/a/11616993/1063392
        function stringify(ast) {
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
        Utility.stringify = stringify;
    })(Utility = CoolToJS.Utility || (CoolToJS.Utility = {}));
})(CoolToJS || (CoolToJS = {}));
//# sourceMappingURL=cooltojs-0.0.1.js.map