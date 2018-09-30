var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var CoolToJS;
(function (CoolToJS) {
    var NodeType;
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
        NodeType[NodeType["ParentheticalExpression"] = 17] = "ParentheticalExpression";
        NodeType[NodeType["SelfExpression"] = 18] = "SelfExpression";
        NodeType[NodeType["ObjectIdentifierExpression"] = 19] = "ObjectIdentifierExpression";
        NodeType[NodeType["IntegerLiteralExpression"] = 20] = "IntegerLiteralExpression";
        NodeType[NodeType["StringLiteralExpression"] = 21] = "StringLiteralExpression";
        NodeType[NodeType["TrueKeywordExpression"] = 22] = "TrueKeywordExpression";
        NodeType[NodeType["FalseKeywordExpression"] = 23] = "FalseKeywordExpression";
    })(NodeType = CoolToJS.NodeType || (CoolToJS.NodeType = {}));
    var BinaryOperationType;
    (function (BinaryOperationType) {
        BinaryOperationType[BinaryOperationType["Addition"] = 0] = "Addition";
        BinaryOperationType[BinaryOperationType["Subtraction"] = 1] = "Subtraction";
        BinaryOperationType[BinaryOperationType["Division"] = 2] = "Division";
        BinaryOperationType[BinaryOperationType["Multiplication"] = 3] = "Multiplication";
        BinaryOperationType[BinaryOperationType["LessThan"] = 4] = "LessThan";
        BinaryOperationType[BinaryOperationType["LessThanOrEqualTo"] = 5] = "LessThanOrEqualTo";
        BinaryOperationType[BinaryOperationType["Comparison"] = 6] = "Comparison";
    })(BinaryOperationType = CoolToJS.BinaryOperationType || (CoolToJS.BinaryOperationType = {}));
    var UnaryOperationType;
    (function (UnaryOperationType) {
        UnaryOperationType[UnaryOperationType["Complement"] = 0] = "Complement";
        UnaryOperationType[UnaryOperationType["Not"] = 1] = "Not";
    })(UnaryOperationType = CoolToJS.UnaryOperationType || (CoolToJS.UnaryOperationType = {}));
    var Node = /** @class */ (function () {
        function Node(type) {
            this.type = type;
            this.children = [];
            this.nodeTypeName = NodeType[this.type];
        }
        return Node;
    }());
    CoolToJS.Node = Node;
    var ProgramNode = /** @class */ (function (_super) {
        __extends(ProgramNode, _super);
        function ProgramNode() {
            return _super.call(this, NodeType.Program) || this;
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
    }(Node));
    CoolToJS.ProgramNode = ProgramNode;
    var ClassNode = /** @class */ (function (_super) {
        __extends(ClassNode, _super);
        function ClassNode(className) {
            var _this = _super.call(this, NodeType.Class) || this;
            _this.isAsync = false;
            _this.calls = [];
            _this.calledBy = [];
            _this.className = className;
            return _this;
        }
        Object.defineProperty(ClassNode.prototype, "propertyList", {
            get: function () {
                var propertyList = [];
                for (var i = 0; i < this.children.length; i++) {
                    if (this.children[i].type === NodeType.Property) {
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
                    if (this.children[i].type === NodeType.Method) {
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
                return !CoolToJS.Utility.isNullUndefinedOrWhitespace(this.superClassName);
            },
            enumerable: true,
            configurable: true
        });
        return ClassNode;
    }(Node));
    CoolToJS.ClassNode = ClassNode;
    var MethodNode = /** @class */ (function (_super) {
        __extends(MethodNode, _super);
        function MethodNode() {
            var _this = _super.call(this, NodeType.Method) || this;
            _this.parameters = [];
            _this.isAsync = false;
            _this.isInStringOrInInt = false;
            _this.isUsed = false;
            _this.calls = [];
            _this.calledBy = [];
            return _this;
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
    }(Node));
    CoolToJS.MethodNode = MethodNode;
    var PropertyNode = /** @class */ (function (_super) {
        __extends(PropertyNode, _super);
        function PropertyNode() {
            var _this = _super.call(this, NodeType.Property) || this;
            _this.isUsed = false;
            _this.isAsync = false;
            _this.calls = [];
            _this.calledBy = [];
            return _this;
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
    }(Node));
    CoolToJS.PropertyNode = PropertyNode;
    var ExpressionNode = /** @class */ (function (_super) {
        __extends(ExpressionNode, _super);
        function ExpressionNode(expressionType) {
            return _super.call(this, expressionType) || this;
        }
        return ExpressionNode;
    }(Node));
    CoolToJS.ExpressionNode = ExpressionNode;
    var AssignmentExpressionNode = /** @class */ (function (_super) {
        __extends(AssignmentExpressionNode, _super);
        function AssignmentExpressionNode() {
            var _this = _super.call(this, NodeType.AssignmentExpression) || this;
            _this.isAssignmentToSelfVariable = false;
            return _this;
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
    }(ExpressionNode));
    CoolToJS.AssignmentExpressionNode = AssignmentExpressionNode;
    var MethodCallExpressionNode = /** @class */ (function (_super) {
        __extends(MethodCallExpressionNode, _super);
        function MethodCallExpressionNode() {
            var _this = _super.call(this, NodeType.MethodCallExpression) || this;
            _this.isCallToParent = false;
            _this.isCallToSelf = false;
            _this.isInStringOrInInt = false;
            return _this;
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
    }(ExpressionNode));
    CoolToJS.MethodCallExpressionNode = MethodCallExpressionNode;
    var IfThenElseExpressionNode = /** @class */ (function (_super) {
        __extends(IfThenElseExpressionNode, _super);
        function IfThenElseExpressionNode() {
            return _super.call(this, NodeType.IfThenElseExpression) || this;
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
                return this.children[1];
            },
            set: function (consequent) {
                this.children[1] = consequent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IfThenElseExpressionNode.prototype, "alternative", {
            get: function () {
                return this.children[2];
            },
            set: function (alternative) {
                this.children[2] = alternative;
            },
            enumerable: true,
            configurable: true
        });
        return IfThenElseExpressionNode;
    }(ExpressionNode));
    CoolToJS.IfThenElseExpressionNode = IfThenElseExpressionNode;
    var WhileExpressionNode = /** @class */ (function (_super) {
        __extends(WhileExpressionNode, _super);
        function WhileExpressionNode() {
            return _super.call(this, NodeType.WhileExpression) || this;
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
    }(ExpressionNode));
    CoolToJS.WhileExpressionNode = WhileExpressionNode;
    var BlockExpressionNode = /** @class */ (function (_super) {
        __extends(BlockExpressionNode, _super);
        function BlockExpressionNode() {
            return _super.call(this, NodeType.BlockExpression) || this;
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
    }(ExpressionNode));
    CoolToJS.BlockExpressionNode = BlockExpressionNode;
    var LetExpressionNode = /** @class */ (function (_super) {
        __extends(LetExpressionNode, _super);
        function LetExpressionNode() {
            var _this = _super.call(this, NodeType.LetExpression) || this;
            _this.localVariableDeclarations = [];
            return _this;
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
    }(ExpressionNode));
    CoolToJS.LetExpressionNode = LetExpressionNode;
    var LocalVariableDeclarationNode = /** @class */ (function (_super) {
        __extends(LocalVariableDeclarationNode, _super);
        function LocalVariableDeclarationNode() {
            return _super.call(this, NodeType.LocalVariableDeclaration) || this;
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
    }(Node));
    CoolToJS.LocalVariableDeclarationNode = LocalVariableDeclarationNode;
    var CaseExpressionNode = /** @class */ (function (_super) {
        __extends(CaseExpressionNode, _super);
        function CaseExpressionNode() {
            return _super.call(this, NodeType.CaseExpression) || this;
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
    }(ExpressionNode));
    CoolToJS.CaseExpressionNode = CaseExpressionNode;
    var CaseOptionNode = /** @class */ (function (_super) {
        __extends(CaseOptionNode, _super);
        function CaseOptionNode() {
            return _super.call(this, NodeType.CaseOption) || this;
        }
        Object.defineProperty(CaseOptionNode.prototype, "caseOptionExpression", {
            get: function () {
                return this.children[0];
            },
            set: function (expression) {
                this.children[0] = expression;
            },
            enumerable: true,
            configurable: true
        });
        return CaseOptionNode;
    }(Node));
    CoolToJS.CaseOptionNode = CaseOptionNode;
    var NewExpressionNode = /** @class */ (function (_super) {
        __extends(NewExpressionNode, _super);
        function NewExpressionNode() {
            return _super.call(this, NodeType.NewExpression) || this;
        }
        return NewExpressionNode;
    }(ExpressionNode));
    CoolToJS.NewExpressionNode = NewExpressionNode;
    var IsVoidExpressionNode = /** @class */ (function (_super) {
        __extends(IsVoidExpressionNode, _super);
        function IsVoidExpressionNode() {
            return _super.call(this, NodeType.IsvoidExpression) || this;
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
    }(ExpressionNode));
    CoolToJS.IsVoidExpressionNode = IsVoidExpressionNode;
    var BinaryOperationExpressionNode = /** @class */ (function (_super) {
        __extends(BinaryOperationExpressionNode, _super);
        function BinaryOperationExpressionNode() {
            return _super.call(this, NodeType.BinaryOperationExpression) || this;
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
    }(ExpressionNode));
    CoolToJS.BinaryOperationExpressionNode = BinaryOperationExpressionNode;
    var UnaryOperationExpressionNode = /** @class */ (function (_super) {
        __extends(UnaryOperationExpressionNode, _super);
        function UnaryOperationExpressionNode() {
            return _super.call(this, NodeType.UnaryOperationExpression) || this;
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
    }(ExpressionNode));
    CoolToJS.UnaryOperationExpressionNode = UnaryOperationExpressionNode;
    var ParentheticalExpressionNode = /** @class */ (function (_super) {
        __extends(ParentheticalExpressionNode, _super);
        function ParentheticalExpressionNode() {
            return _super.call(this, NodeType.ParentheticalExpression) || this;
        }
        Object.defineProperty(ParentheticalExpressionNode.prototype, "innerExpression", {
            get: function () {
                return this.children[0];
            },
            set: function (inner) {
                this.children[0] = inner;
            },
            enumerable: true,
            configurable: true
        });
        return ParentheticalExpressionNode;
    }(ExpressionNode));
    CoolToJS.ParentheticalExpressionNode = ParentheticalExpressionNode;
    var SelfExpressionNode = /** @class */ (function (_super) {
        __extends(SelfExpressionNode, _super);
        function SelfExpressionNode() {
            return _super.call(this, NodeType.SelfExpression) || this;
        }
        return SelfExpressionNode;
    }(ExpressionNode));
    CoolToJS.SelfExpressionNode = SelfExpressionNode;
    var ObjectIdentifierExpressionNode = /** @class */ (function (_super) {
        __extends(ObjectIdentifierExpressionNode, _super);
        function ObjectIdentifierExpressionNode() {
            var _this = _super.call(this, NodeType.ObjectIdentifierExpression) || this;
            _this.isCallToSelf = false;
            return _this;
        }
        return ObjectIdentifierExpressionNode;
    }(ExpressionNode));
    CoolToJS.ObjectIdentifierExpressionNode = ObjectIdentifierExpressionNode;
    var IntegerLiteralExpressionNode = /** @class */ (function (_super) {
        __extends(IntegerLiteralExpressionNode, _super);
        function IntegerLiteralExpressionNode() {
            return _super.call(this, NodeType.IntegerLiteralExpression) || this;
        }
        return IntegerLiteralExpressionNode;
    }(ExpressionNode));
    CoolToJS.IntegerLiteralExpressionNode = IntegerLiteralExpressionNode;
    var StringLiteralExpressionNode = /** @class */ (function (_super) {
        __extends(StringLiteralExpressionNode, _super);
        function StringLiteralExpressionNode() {
            return _super.call(this, NodeType.StringLiteralExpression) || this;
        }
        return StringLiteralExpressionNode;
    }(ExpressionNode));
    CoolToJS.StringLiteralExpressionNode = StringLiteralExpressionNode;
    var TrueKeywordExpressionNode = /** @class */ (function (_super) {
        __extends(TrueKeywordExpressionNode, _super);
        function TrueKeywordExpressionNode() {
            return _super.call(this, NodeType.TrueKeywordExpression) || this;
        }
        return TrueKeywordExpressionNode;
    }(ExpressionNode));
    CoolToJS.TrueKeywordExpressionNode = TrueKeywordExpressionNode;
    var FalseKeywordExpressionNode = /** @class */ (function (_super) {
        __extends(FalseKeywordExpressionNode, _super);
        function FalseKeywordExpressionNode() {
            return _super.call(this, NodeType.FalseKeywordExpression) || this;
        }
        return FalseKeywordExpressionNode;
    }(ExpressionNode));
    CoolToJS.FalseKeywordExpressionNode = FalseKeywordExpressionNode;
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    var AbstractSyntaxTreeConverter = /** @class */ (function () {
        function AbstractSyntaxTreeConverter() {
            var _this = this;
            this.Convert = function (parserOutput) {
                return {
                    success: true,
                    abstractSyntaxTree: _this.convert(CoolToJS.Utility.ShallowCopySyntaxTree(parserOutput.syntaxTree)),
                    errorMessages: parserOutput.errorMessages,
                    warningMessages: parserOutput.warningMessages
                };
            };
            this.convert = function (syntaxTree) {
                var convertedNode;
                /* PROGRAM */
                if (syntaxTree.syntaxKind === CoolToJS.SyntaxKind.Program) {
                    _this.flattenRecursion(syntaxTree);
                    convertedNode = new CoolToJS.ProgramNode();
                    // create Class nodes for each class in this program
                    for (var i = 0; i < syntaxTree.children.length; i++) {
                        if (syntaxTree.children[i].syntaxKind === CoolToJS.SyntaxKind.Class) {
                            var childClassNode = _this.convert(syntaxTree.children[i]);
                            childClassNode.parent = convertedNode;
                            convertedNode.children.push(childClassNode);
                        }
                    }
                }
                /* CLASS */
                else if (syntaxTree.syntaxKind === CoolToJS.SyntaxKind.Class) {
                    var classNode = new CoolToJS.ClassNode(syntaxTree.children[1].token.match);
                    classNode.token = syntaxTree.children[1].token;
                    if (syntaxTree.children[2].syntaxKind === CoolToJS.SyntaxKind.InheritsKeyword) {
                        // if this class is a subclass
                        classNode.superClassName = syntaxTree.children[3].token.match;
                    }
                    // find the FeatureList child, and use its children to construct
                    // this class's methods and properties
                    for (var i = 0; i < syntaxTree.children.length; i++) {
                        if (syntaxTree.children[i].syntaxKind === CoolToJS.SyntaxKind.FeatureList) {
                            _this.flattenRecursion(syntaxTree.children[i]);
                            for (var j = 0; j < syntaxTree.children[i].children.length; j++) {
                                if (syntaxTree.children[i].children[j].syntaxKind === CoolToJS.SyntaxKind.Feature) {
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
                /* CLASS METHOD/PROPERTY */
                else if (syntaxTree.syntaxKind === CoolToJS.SyntaxKind.Feature) {
                    if (syntaxTree.children[1].syntaxKind === CoolToJS.SyntaxKind.OpenParenthesis) {
                        // we should convert into a method
                        var methodNode = new CoolToJS.MethodNode();
                        methodNode.methodName = syntaxTree.children[0].token.match;
                        methodNode.token = syntaxTree.children[0].token;
                        if (syntaxTree.children[2].syntaxKind === CoolToJS.SyntaxKind.FormalList) {
                            // this method has at least one parameter
                            methodNode.returnTypeName = syntaxTree.children[5].token.match;
                            _this.flattenRecursion(syntaxTree.children[2]);
                            for (var i = 0; i < syntaxTree.children[2].children.length; i++) {
                                if (syntaxTree.children[2].children[i].syntaxKind === CoolToJS.SyntaxKind.Formal) {
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
                    else if (syntaxTree.children[1].syntaxKind === CoolToJS.SyntaxKind.Colon) {
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
                /* EXPRESSION */
                else if (syntaxTree.syntaxKind === CoolToJS.SyntaxKind.Expression) {
                    /* ASSIGNMENT EXPRESSION */
                    if (syntaxTree.children[1] && syntaxTree.children[1].syntaxKind === CoolToJS.SyntaxKind.AssignmentOperator) {
                        var assignmentExprNode = new CoolToJS.AssignmentExpressionNode();
                        assignmentExprNode.identifierName = syntaxTree.children[0].token.match;
                        assignmentExprNode.token = syntaxTree.children[0].token;
                        var assignmentExpression = _this.convert(syntaxTree.children[2]);
                        assignmentExpression.parent = assignmentExprNode;
                        assignmentExprNode.children.push(assignmentExpression);
                        convertedNode = assignmentExprNode;
                    }
                    /* METHOD CALL EXPRESSION */
                    else if (syntaxTree.children[1]
                        && (syntaxTree.children[1].syntaxKind === CoolToJS.SyntaxKind.DotOperator
                            || syntaxTree.children[1].syntaxKind === CoolToJS.SyntaxKind.AtSignOperator
                            || (syntaxTree.children[0].syntaxKind === CoolToJS.SyntaxKind.ObjectIdentifier
                                && syntaxTree.children[1].syntaxKind === CoolToJS.SyntaxKind.OpenParenthesis))) {
                        var methodCallExprNode = new CoolToJS.MethodCallExpressionNode(), expressionListIndex;
                        if (syntaxTree.children[1].syntaxKind === CoolToJS.SyntaxKind.DotOperator) {
                            // standard method call on an expression
                            methodCallExprNode.methodName = syntaxTree.children[2].token.match;
                            methodCallExprNode.token = syntaxTree.children[2].token;
                            methodCallExprNode.targetExpression = _this.convert(syntaxTree.children[0]);
                            methodCallExprNode.targetExpression.parent = methodCallExprNode;
                            expressionListIndex = 4;
                        }
                        else if (syntaxTree.children[1].syntaxKind === CoolToJS.SyntaxKind.AtSignOperator) {
                            // method call to parent class
                            methodCallExprNode.methodName = syntaxTree.children[4].token.match;
                            methodCallExprNode.token = syntaxTree.children[4].token;
                            methodCallExprNode.targetExpression = _this.convert(syntaxTree.children[0]);
                            methodCallExprNode.isCallToParent = true;
                            methodCallExprNode.explicitParentCallTypeName = syntaxTree.children[2].token.match;
                            expressionListIndex = 6;
                        }
                        else if (syntaxTree.children[1].syntaxKind === CoolToJS.SyntaxKind.OpenParenthesis) {
                            // method call to implied "self"
                            methodCallExprNode.methodName = syntaxTree.children[0].token.match;
                            methodCallExprNode.token = syntaxTree.children[0].token;
                            methodCallExprNode.isCallToSelf = true;
                            expressionListIndex = 2;
                        }
                        else {
                            throw 'Unknown method call expression type';
                        }
                        if (syntaxTree.children[expressionListIndex].syntaxKind === CoolToJS.SyntaxKind.ExpressionList) {
                            _this.flattenRecursion(syntaxTree.children[expressionListIndex]);
                            for (var i = 0; i < syntaxTree.children[expressionListIndex].children.length; i++) {
                                if (syntaxTree.children[expressionListIndex].children[i].syntaxKind === CoolToJS.SyntaxKind.Expression) {
                                    var parameterExprNode = _this.convert(syntaxTree.children[expressionListIndex].children[i]);
                                    parameterExprNode.parent = methodCallExprNode;
                                    methodCallExprNode.children.push(parameterExprNode);
                                }
                            }
                        }
                        convertedNode = methodCallExprNode;
                    }
                    /* IF/THEN/ELSE EXPRESSION */
                    else if (syntaxTree.children[0].syntaxKind === CoolToJS.SyntaxKind.IfKeyword) {
                        var ifThenElseExprNode = new CoolToJS.IfThenElseExpressionNode();
                        ifThenElseExprNode.token = syntaxTree.children[0].token;
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
                    /* WHILE EXPRESSION */
                    else if (syntaxTree.children[0].syntaxKind === CoolToJS.SyntaxKind.WhileKeyword) {
                        var whileExprNode = new CoolToJS.WhileExpressionNode();
                        whileExprNode.token = syntaxTree.children[0].token;
                        var conditionNode = _this.convert(syntaxTree.children[1]);
                        whileExprNode.children[0] = conditionNode;
                        var bodyExpressionNode = _this.convert(syntaxTree.children[3]);
                        whileExprNode.children[1] = bodyExpressionNode;
                        conditionNode.parent = whileExprNode;
                        bodyExpressionNode.parent = whileExprNode;
                        convertedNode = whileExprNode;
                    }
                    /* BLOCK EXPRESSION */
                    else if (syntaxTree.children[0].syntaxKind === CoolToJS.SyntaxKind.OpenCurlyBracket) {
                        var blockExpressionNode = new CoolToJS.BlockExpressionNode();
                        _this.flattenRecursion(syntaxTree.children[1]);
                        for (var i = 0; i < syntaxTree.children[1].children.length; i++) {
                            if (syntaxTree.children[1].children[i].syntaxKind === CoolToJS.SyntaxKind.Expression) {
                                var childExpressionNode = _this.convert(syntaxTree.children[1].children[i]);
                                childExpressionNode.parent = blockExpressionNode;
                                blockExpressionNode.children.push(childExpressionNode);
                            }
                        }
                        convertedNode = blockExpressionNode;
                    }
                    /* LET EXPRESSION */
                    else if (syntaxTree.children[0].syntaxKind === CoolToJS.SyntaxKind.LetKeyword) {
                        var letExpressionNode = new CoolToJS.LetExpressionNode();
                        _this.flattenRecursion(syntaxTree.children[1]);
                        for (var i = 0; i < syntaxTree.children[1].children.length; i++) {
                            if (syntaxTree.children[1].children[i].syntaxKind === CoolToJS.SyntaxKind.ObjectIdentifier) {
                                var localVarDeclaration = new CoolToJS.LocalVariableDeclarationNode();
                                localVarDeclaration.identifierName = syntaxTree.children[1].children[i].token.match;
                                localVarDeclaration.token = syntaxTree.children[1].children[i].token;
                                localVarDeclaration.typeName = syntaxTree.children[1].children[i + 2].token.match;
                                if (syntaxTree.children[1].children[i + 3]
                                    && syntaxTree.children[1].children[i + 3].syntaxKind == CoolToJS.SyntaxKind.AssignmentOperator) {
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
                    /* CASE EXPRESSION */
                    else if (syntaxTree.children[0].syntaxKind === CoolToJS.SyntaxKind.CaseKeyword) {
                        var caseExpressionNode = new CoolToJS.CaseExpressionNode();
                        _this.flattenRecursion(syntaxTree.children[3]);
                        for (var i = 0; i < syntaxTree.children[3].children.length; i++) {
                            if (syntaxTree.children[3].children[i].syntaxKind === CoolToJS.SyntaxKind.ObjectIdentifier) {
                                var caseOptionNode = new CoolToJS.CaseOptionNode();
                                caseOptionNode.identiferName = syntaxTree.children[3].children[i].token.match;
                                caseOptionNode.token = syntaxTree.children[3].children[i].token;
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
                    /* NEW EXPRESSION */
                    else if (syntaxTree.children[0].syntaxKind === CoolToJS.SyntaxKind.NewKeyword) {
                        var newExpressionNode = new CoolToJS.NewExpressionNode();
                        newExpressionNode.typeName = syntaxTree.children[1].token.match;
                        convertedNode = newExpressionNode;
                    }
                    /* ISVOID EXPRESSION */
                    else if (syntaxTree.children[0].syntaxKind === CoolToJS.SyntaxKind.IsvoidKeyword) {
                        var isVoidExpressionNode = new CoolToJS.IsVoidExpressionNode();
                        var isVoidConditionNode = _this.convert(syntaxTree.children[1]);
                        isVoidExpressionNode.parent = isVoidExpressionNode;
                        isVoidExpressionNode.children[0] = isVoidConditionNode;
                        convertedNode = isVoidExpressionNode;
                    }
                    /* BINARY OPERATION EXPRESSION */
                    else if (syntaxTree.children[1] && _this.isBinaryOperator(syntaxTree.children[1])) {
                        var binaryOperationExprNode = new CoolToJS.BinaryOperationExpressionNode();
                        binaryOperationExprNode.token = syntaxTree.children[1].token;
                        switch (syntaxTree.children[1].syntaxKind) {
                            case CoolToJS.SyntaxKind.AdditionOperator:
                                binaryOperationExprNode.operationType = CoolToJS.BinaryOperationType.Addition;
                                break;
                            case CoolToJS.SyntaxKind.SubtractionOperator:
                                binaryOperationExprNode.operationType = CoolToJS.BinaryOperationType.Subtraction;
                                break;
                            case CoolToJS.SyntaxKind.MultiplationOperator:
                                binaryOperationExprNode.operationType = CoolToJS.BinaryOperationType.Multiplication;
                                break;
                            case CoolToJS.SyntaxKind.DivisionOperator:
                                binaryOperationExprNode.operationType = CoolToJS.BinaryOperationType.Division;
                                break;
                            case CoolToJS.SyntaxKind.LessThanOperator:
                                binaryOperationExprNode.operationType = CoolToJS.BinaryOperationType.LessThan;
                                break;
                            case CoolToJS.SyntaxKind.LessThanOrEqualsOperator:
                                binaryOperationExprNode.operationType = CoolToJS.BinaryOperationType.LessThanOrEqualTo;
                                break;
                            case CoolToJS.SyntaxKind.EqualsOperator:
                                binaryOperationExprNode.operationType = CoolToJS.BinaryOperationType.Comparison;
                                break;
                            default:
                                throw 'Unknown BinaryOperationType';
                        }
                        var operand1Node = _this.convert(syntaxTree.children[0]);
                        operand1Node.parent = binaryOperationExprNode;
                        var operand2Node = _this.convert(syntaxTree.children[2]);
                        operand2Node.parent = binaryOperationExprNode;
                        binaryOperationExprNode.children[0] = operand1Node;
                        binaryOperationExprNode.children[1] = operand2Node;
                        convertedNode = binaryOperationExprNode;
                    }
                    /* UNARY OPERATION EXPRESSION */
                    else if (syntaxTree.children[0].syntaxKind === CoolToJS.SyntaxKind.TildeOperator
                        || syntaxTree.children[0].syntaxKind === CoolToJS.SyntaxKind.NotKeyword) {
                        var unaryOperationExprNode = new CoolToJS.UnaryOperationExpressionNode();
                        if (syntaxTree.children[0].syntaxKind === CoolToJS.SyntaxKind.TildeOperator) {
                            unaryOperationExprNode.operationType = CoolToJS.UnaryOperationType.Complement;
                        }
                        else if (syntaxTree.children[0].syntaxKind === CoolToJS.SyntaxKind.NotKeyword) {
                            unaryOperationExprNode.operationType = CoolToJS.UnaryOperationType.Not;
                        }
                        else {
                            throw 'Unknown UnaryOperationType';
                        }
                        var operandNode = _this.convert(syntaxTree.children[1]);
                        operandNode.parent = unaryOperationExprNode;
                        unaryOperationExprNode.children[0] = operandNode;
                        unaryOperationExprNode.token = syntaxTree.children[0].token;
                        convertedNode = unaryOperationExprNode;
                    }
                    /* UNARY OPERATION EXPRESSION */
                    else if (syntaxTree.children[0].syntaxKind === CoolToJS.SyntaxKind.OpenParenthesis) {
                        var parExprNod = new CoolToJS.ParentheticalExpressionNode();
                        var innerExprNode = _this.convert(syntaxTree.children[1]);
                        innerExprNode.parent = parExprNod;
                        parExprNod.children[0] = innerExprNode;
                        convertedNode = parExprNod;
                    }
                    /* SELF EXPRESSION */
                    else if (syntaxTree.children[0].syntaxKind === CoolToJS.SyntaxKind.ObjectIdentifier
                        && syntaxTree.children.length === 1
                        && syntaxTree.children[0].token.match === 'self') {
                        var selfExpressionNode = new CoolToJS.SelfExpressionNode();
                        selfExpressionNode.token = syntaxTree.children[0].token;
                        convertedNode = selfExpressionNode;
                    }
                    /* OBJECT IDENTIFIER EXPRESSION */
                    else if (syntaxTree.children[0].syntaxKind === CoolToJS.SyntaxKind.ObjectIdentifier && syntaxTree.children.length === 1) {
                        var objIdentExprNode = new CoolToJS.ObjectIdentifierExpressionNode();
                        objIdentExprNode.objectIdentifierName = syntaxTree.children[0].token.match;
                        objIdentExprNode.token = syntaxTree.children[0].token;
                        convertedNode = objIdentExprNode;
                    }
                    /* INTEGER LITERAL EXPRESSION */
                    else if (syntaxTree.children[0].syntaxKind === CoolToJS.SyntaxKind.Integer) {
                        var intLiteralExprNode = new CoolToJS.IntegerLiteralExpressionNode();
                        intLiteralExprNode.value = parseInt(syntaxTree.children[0].token.match, 10);
                        convertedNode = intLiteralExprNode;
                    }
                    /* STRING LITERAL EXPRESSION */
                    else if (syntaxTree.children[0].syntaxKind === CoolToJS.SyntaxKind.String) {
                        var stringLiteralExprNode = new CoolToJS.StringLiteralExpressionNode();
                        var value = syntaxTree.children[0].token.match;
                        // remove beginning and end quotes
                        stringLiteralExprNode.value = value.substr(1, value.length - 2);
                        convertedNode = stringLiteralExprNode;
                    }
                    /* TRUE KEYWORD EXPRESSION */
                    else if (syntaxTree.children[0].syntaxKind === CoolToJS.SyntaxKind.TrueKeyword) {
                        var trueKeywordExprNode = new CoolToJS.TrueKeywordExpressionNode();
                        convertedNode = trueKeywordExprNode;
                    }
                    /* FALSE KEYWORD EXPRESSION */
                    else if (syntaxTree.children[0].syntaxKind === CoolToJS.SyntaxKind.FalseKeyword) {
                        var falseKeywordExprNode = new CoolToJS.FalseKeywordExpressionNode();
                        convertedNode = falseKeywordExprNode;
                    }
                }
                /* ERROR */
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
            return (syntaxTree.syntaxKind === CoolToJS.SyntaxKind.AdditionOperator
                || syntaxTree.syntaxKind === CoolToJS.SyntaxKind.SubtractionOperator
                || syntaxTree.syntaxKind === CoolToJS.SyntaxKind.MultiplationOperator
                || syntaxTree.syntaxKind === CoolToJS.SyntaxKind.DivisionOperator
                || syntaxTree.syntaxKind === CoolToJS.SyntaxKind.LessThanOperator
                || syntaxTree.syntaxKind === CoolToJS.SyntaxKind.LessThanOrEqualsOperator
                || syntaxTree.syntaxKind === CoolToJS.SyntaxKind.EqualsOperator);
        };
        return AbstractSyntaxTreeConverter;
    }());
    CoolToJS.AbstractSyntaxTreeConverter = AbstractSyntaxTreeConverter;
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    var JavaScriptGenerator = /** @class */ (function () {
        function JavaScriptGenerator() {
            var _this = this;
            this.errorMessages = [];
            this.warningMessages = [];
            this.Generate = function (semanticAnalysisOutput, ioFunctions) {
                _this.errorMessages = semanticAnalysisOutput.errorMessages || [];
                _this.warningMessages = semanticAnalysisOutput.warningMessages || [];
                _this.usageRecord = semanticAnalysisOutput.usageRecord;
                var output = _this.generate(semanticAnalysisOutput.abstractSyntaxTree, ioFunctions, _this.errorMessages, _this.warningMessages);
                return {
                    success: _this.errorMessages.length === 0,
                    errorMessages: _this.errorMessages,
                    warningMessages: _this.warningMessages,
                    generatedJavaScript: output
                };
            };
            this.isInAsyncContext = false;
            this.indentCache = [];
            this.singleIndent = '    ';
        }
        JavaScriptGenerator.prototype.generate = function (ast, ioFunctions, errorMessages, warningMessages) {
            var _this = this;
            var output = [];
            output.push('let _inputGenerator');
            CoolToJS.Utility.binaryOperationFunctions.forEach(function (binOp) {
                if (_this.usageRecord.binaryOperations.indexOf(binOp.operation) !== -1) {
                    output.push(',\n');
                    output.push(_this.indent(1) + binOp.func);
                }
            });
            CoolToJS.Utility.unaryOperationFunctions.forEach(function (unaryOp) {
                if (_this.usageRecord.unaryOperations.indexOf(unaryOp.operation) !== -1) {
                    output.push(',\n');
                    output.push(_this.indent(1) + unaryOp.func);
                }
            });
            if (this.usageRecord.caseExpression) {
                output.push(',\n');
                output.push(this.indent(1) + CoolToJS.Utility.getCaseFunction(false));
                if (ast.classList
                    .filter(function (c) { return c.className === 'Main'; })[0]
                    .methodList.filter(function (m) { return m.methodName === 'main'; })[0].isAsync) {
                    output.push(',\n');
                    output.push(this.indent(1) + CoolToJS.Utility.getCaseFunction(true));
                }
            }
            output.push(';\n\n');
            CoolToJS.Utility.baseObjectClasses.forEach(function (c) { output.push(c); });
            output.push(this.generateIOClass(ioFunctions, 0));
            output.push('\n');
            var isMainMethodAsync = false, mainClass, generatingClassIndex = 0, classesToGenerate = ast.classList.filter(function (classNode) {
                return ['Object', 'IO', 'Int', 'String', 'Bool'].indexOf(classNode.className) === -1;
            });
            // generate classes in the order of their inheritance
            // i.e. base classes first, sub classes next
            while (classesToGenerate.length > 0) {
                var classNode = classesToGenerate[generatingClassIndex];
                if (classesToGenerate.some(function (c) { return c.className === classNode.superClassName; })) {
                    generatingClassIndex++;
                }
                else {
                    output.push(this.generateClass(classNode, 0));
                    output.push('\n');
                    if (classNode.className === 'Main') {
                        mainClass = classNode;
                        var mainMethod = classNode.methodList.filter(function (m) { return m.methodName === 'main'; });
                        if (mainMethod.length !== 1) {
                            throw 'More than one "main" method found on class Main';
                        }
                        isMainMethodAsync = mainMethod[0].isAsync;
                    }
                    classesToGenerate.splice(generatingClassIndex, 1);
                    generatingClassIndex = 0;
                }
            }
            if (mainClass.isAsync) {
                output.push('_inputGenerator = (function* () { return (yield* new Main("Main")._initialize()).main(); })();\n');
                output.push('_inputGenerator.next()\n');
            }
            else if (isMainMethodAsync) {
                output.push('_inputGenerator = new Main("Main").main();\n');
                output.push('_inputGenerator.next()\n');
            }
            else {
                output.push('new Main("Main").main();\n');
            }
            return output.join('');
        };
        JavaScriptGenerator.prototype.generateIOClass = function (ioFunctions, indentLevel) {
            var _this = this;
            var output = [];
            output.push(this.indent(indentLevel) + 'class IO extends _Object {\n');
            output.push(this.indent(indentLevel + 1) + 'constructor(typeName) {\n');
            output.push(this.indent(indentLevel + 2) + 'super(typeName);\n');
            output.push(this.indent(indentLevel + 1) + '}\n\n');
            ['out_string', 'out_int', 'in_string', 'in_int'].forEach(function (methodName) {
                var methodDetails = CoolToJS.Utility.getFunctionDetails(ioFunctions[methodName]);
                output.push(_this.indent(indentLevel + 1) + (methodName === 'in_string' || methodName === 'in_int' ? '*' : ''));
                output.push(methodName + '(');
                var firstParamName;
                methodDetails.parameters.forEach(function (p, index) {
                    var isLast = methodDetails.parameters.length - 1 === index;
                    if (index === 0) {
                        firstParamName = p;
                    }
                    output.push(p + (isLast ? '' : ', '));
                });
                if (methodName === 'out_string' || methodName === 'out_int') {
                    output.push(') {\n');
                    output.push(_this.indent(indentLevel + 2) + firstParamName + ' = ' + firstParamName + '._value;');
                    output.push(methodDetails.body);
                    output.push('\n' + _this.indent(indentLevel + 2) + 'return this;\n');
                    output.push(_this.indent(indentLevel + 1) + '};\n');
                }
                else {
                    output.push(') {');
                    output.push(methodDetails.body);
                    output.push('\n' + _this.indent(indentLevel + 2) + 'return new ');
                    if (methodName === 'in_string') {
                        output.push('_String(yield);\n');
                    }
                    else {
                        output.push('_Int(parseInt(yield, 10));\n');
                    }
                    output.push(_this.indent(indentLevel + 1) + '};\n');
                }
            });
            output.push(this.indent(indentLevel) + '}\n');
            return output.join('');
        };
        JavaScriptGenerator.prototype.generateClass = function (classNode, indentLevel) {
            var _this = this;
            var output = [];
            var extendsPhrase = ' extends ' + (classNode.isSubClass ? classNode.superClassName : '_Object');
            output.push(this.indent(indentLevel) + 'class ' + classNode.className + extendsPhrase + ' {\n');
            output.push(this.indent(indentLevel + 1) + 'constructor(typeName) {\n');
            output.push(this.indent(indentLevel + 2) + 'super(typeName);\n');
            output.push(this.indent(indentLevel + 1) + '}\n\n');
            classNode.propertyList.forEach(function (propertyNode) {
                output.push(_this.generateClassProperty(propertyNode, indentLevel + 1));
            });
            classNode.methodList.forEach(function (methodNode) {
                output.push(_this.generateClassMethod(methodNode, indentLevel + 1));
            });
            if (classNode.isAsync) {
                this.isInAsyncContext = true;
                output.push(this.indent(indentLevel + 1) + '*_initialize() {\n');
                classNode.propertyList.filter(function (p) { return p.isAsync; }).forEach(function (propertyNode) {
                    output.push(_this.indent(indentLevel + 2) + 'this.' + CoolToJS.Utility.escapeIfReserved(propertyNode.propertyName) + ' = ');
                    if (_this.expressionReturnsItself(propertyNode.propertyInitializerExpression)) {
                        output.push(_this.generateExpression(propertyNode.propertyInitializerExpression, false, indentLevel + 2));
                    }
                    else {
                        output.push(_this.wrapInSelfExecutingFunction(propertyNode.propertyInitializerExpression, _this.isInAsyncContext, indentLevel + 1));
                    }
                    output.push(';\n');
                });
                output.push(this.indent(indentLevel + 2) + 'return this;\n');
                output.push(this.indent(indentLevel + 1) + '};\n');
            }
            output.push(this.indent(indentLevel) + '}\n');
            return output.join('');
        };
        JavaScriptGenerator.prototype.generateClassProperty = function (propertyNode, indentLevel) {
            var output = [];
            // if this property has an asynchronous initializer, we'll 
            // generate it's initializer in the class's _initialize() generator method
            if (propertyNode.isAsync) {
                return this.indent(indentLevel) + CoolToJS.Utility.escapeIfReserved(propertyNode.propertyName) + ';\n';
            }
            if (propertyNode.hasInitializer) {
                output.push(this.indent(indentLevel) + CoolToJS.Utility.escapeIfReserved(propertyNode.propertyName) + ' = ');
                if (this.expressionReturnsItself(propertyNode.propertyInitializerExpression)) {
                    output.push(this.generateExpression(propertyNode.propertyInitializerExpression, false, indentLevel + 1));
                }
                else {
                    output.push(this.wrapInSelfExecutingFunction(propertyNode.propertyInitializerExpression, this.isInAsyncContext, indentLevel));
                }
                output.push(';\n');
            }
            else if (propertyNode.typeName === 'Bool') {
                output.push(this.indent(indentLevel) + propertyNode.propertyName + ' = new _Bool(false);\n');
            }
            else if (propertyNode.typeName === 'String') {
                output.push(this.indent(indentLevel) + propertyNode.propertyName + ' = new _String("");\n');
            }
            else if (propertyNode.typeName === 'Int') {
                output.push(this.indent(indentLevel) + propertyNode.propertyName + ' = new _Int(0);\n');
            }
            else {
                output.push(this.indent(indentLevel) + propertyNode.propertyName + ';\n');
            }
            return output.join('');
        };
        JavaScriptGenerator.prototype.generateClassMethod = function (methodNode, indentLevel) {
            var output = [];
            this.isInAsyncContext = methodNode.isAsync;
            output.push(this.indent(indentLevel) + (methodNode.isAsync ? '*' : '') + CoolToJS.Utility.escapeIfReserved(methodNode.methodName) + '(');
            methodNode.parameters.forEach(function (p, index) {
                var isLast = index === methodNode.parameters.length - 1;
                output.push(CoolToJS.Utility.escapeIfReserved(p.parameterName) + (isLast ? '' : ', '));
            });
            output.push(') {\n');
            output.push(this.indent(indentLevel + 1) + 'let _returnValue;\n');
            output.push(this.generateExpression(methodNode.methodBodyExpression, true, indentLevel + 1) + '\n');
            // print a success message to the screen at the end of program execution
            if (methodNode.methodName === 'main' && methodNode.parent.className === 'Main') {
                output.push(this.indent(indentLevel + 1) + 'new IO("IO").out_string(new _String("COOL program successfully executed\\n"));\n');
            }
            output.push(this.indent(indentLevel + 1) + 'return _returnValue;\n');
            output.push(this.indent(indentLevel) + '};\n');
            return output.join('');
        };
        JavaScriptGenerator.prototype.generateExpression = function (expressionNode, returnResult, indentLevel) {
            switch (expressionNode.type) {
                case CoolToJS.NodeType.LetExpression:
                    return this.generateLetExpression(expressionNode, returnResult, indentLevel);
                case CoolToJS.NodeType.StringLiteralExpression:
                    return this.generateStringLiteralExpression(expressionNode, returnResult, indentLevel);
                case CoolToJS.NodeType.IntegerLiteralExpression:
                    return this.generateIntegerLiteralExpression(expressionNode, returnResult, indentLevel);
                case CoolToJS.NodeType.MethodCallExpression:
                    return this.generateMethodCallExpression(expressionNode, returnResult, indentLevel);
                case CoolToJS.NodeType.BlockExpression:
                    return this.generateBlockExpression(expressionNode, returnResult, indentLevel);
                case CoolToJS.NodeType.AssignmentExpression:
                    return this.generateAssignmentExpression(expressionNode, returnResult, indentLevel);
                case CoolToJS.NodeType.ObjectIdentifierExpression:
                    return this.generateObjectIdentifierExpression(expressionNode, returnResult, indentLevel);
                case CoolToJS.NodeType.SelfExpression:
                    return this.generateSelfExpression(expressionNode, returnResult, indentLevel);
                case CoolToJS.NodeType.NewExpression:
                    return this.generateNewExpression(expressionNode, returnResult, indentLevel);
                case CoolToJS.NodeType.BinaryOperationExpression:
                    return this.generateBinaryOperationExpression(expressionNode, returnResult, indentLevel);
                case CoolToJS.NodeType.UnaryOperationExpression:
                    return this.generateUnaryOperationExpression(expressionNode, returnResult, indentLevel);
                case CoolToJS.NodeType.ParentheticalExpression:
                    return this.generateParentheticalExpressionNode(expressionNode, returnResult, indentLevel);
                case CoolToJS.NodeType.TrueKeywordExpression:
                    return this.generateTrueKeywordExpression(expressionNode, returnResult, indentLevel);
                case CoolToJS.NodeType.FalseKeywordExpression:
                    return this.generateFalseKeywordExpression(expressionNode, returnResult, indentLevel);
                case CoolToJS.NodeType.IfThenElseExpression:
                    return this.generateIfThenElseExpression(expressionNode, returnResult, indentLevel);
                case CoolToJS.NodeType.WhileExpression:
                    return this.generateWhileExpression(expressionNode, returnResult, indentLevel);
                case CoolToJS.NodeType.CaseExpression:
                    return this.generateCaseExpression(expressionNode, returnResult, indentLevel);
                case CoolToJS.NodeType.IsvoidExpression:
                    return this.generateIsVoidExpression(expressionNode, returnResult, indentLevel);
                default:
                    this.errorMessages.push({
                        location: null,
                        message: 'Node type "' + expressionNode.nodeTypeName + '" not yet implemented!'
                    });
            }
        };
        JavaScriptGenerator.prototype.generateLetExpression = function (letExpressionNode, returnResult, indentLevel) {
            var _this = this;
            var output = [];
            if (letExpressionNode.parent.type !== CoolToJS.NodeType.Method) {
                output.push(this.indent(indentLevel) + '{\n');
                indentLevel++;
            }
            letExpressionNode.localVariableDeclarations.forEach(function (lvdn, index) {
                var isFirst = index === 0, isLast = index === letExpressionNode.localVariableDeclarations.length - 1;
                output.push(_this.indent(indentLevel) + (isFirst ? 'let ' : _this.indent(1)) + CoolToJS.Utility.escapeIfReserved(lvdn.identifierName));
                if (lvdn.initializerExpression) {
                    if (_this.expressionReturnsItself(lvdn.initializerExpression)) {
                        output.push(' = ' + _this.generateExpression(_this.unwrapSelfReturningExpression(lvdn.initializerExpression), false, 0));
                    }
                    else {
                        output.push(' = ' + _this.wrapInSelfExecutingFunction(lvdn.initializerExpression, _this.isInAsyncContext, indentLevel));
                    }
                }
                else if (lvdn.typeName === 'Bool') {
                    output.push(' = new _Bool(false)');
                }
                else if (lvdn.typeName === 'String') {
                    output.push(' = new _String("")');
                }
                else if (lvdn.typeName === 'Int') {
                    output.push(' = new _Int(0)');
                }
                output.push((isLast ? ';' : ',') + '\n');
            });
            output.push(this.generateExpression(letExpressionNode.letBodyExpression, returnResult, indentLevel));
            if (letExpressionNode.parent.type !== CoolToJS.NodeType.Method) {
                indentLevel--;
                output.push(this.indent(indentLevel) + '}\n');
            }
            return output.join('');
        };
        JavaScriptGenerator.prototype.generateMethodCallExpression = function (methodCallExpression, returnResult, indentLevel) {
            var _this = this;
            var output = [];
            output.push(this.indent(indentLevel));
            if (returnResult) {
                output.push('_returnValue = ');
            }
            if (methodCallExpression.method.isAsync) {
                output.push('(yield* ');
            }
            if (methodCallExpression.targetExpression && !methodCallExpression.isCallToParent) {
                output.push(this.generateExpression(methodCallExpression.targetExpression, returnResult, 0));
            }
            if (methodCallExpression.isCallToParent) {
                output.push(methodCallExpression.explicitParentCallTypeName + '.prototype.' + CoolToJS.Utility.escapeIfReserved(methodCallExpression.methodName) + '.call(this, ');
            }
            else {
                output.push(methodCallExpression.isCallToSelf ? 'this.' : '.');
                output.push(CoolToJS.Utility.escapeIfReserved(methodCallExpression.methodName) + '(');
            }
            methodCallExpression.parameterExpressionList.forEach(function (p, index) {
                if (_this.expressionReturnsItself(p)) {
                    output.push(_this.generateExpression(_this.unwrapSelfReturningExpression(p), false, 0));
                }
                else {
                    output.push(_this.wrapInSelfExecutingFunction(p, _this.isInAsyncContext, indentLevel));
                }
                if (index !== methodCallExpression.parameterExpressionList.length - 1) {
                    output.push(',');
                }
            });
            if (methodCallExpression.isInStringOrInInt) {
                output.push('_inputGenerator');
            }
            // async methods get an extra layer of parathesis
            if (methodCallExpression.method.isAsync) {
                output.push(')');
            }
            output.push(')');
            return output.join('');
        };
        JavaScriptGenerator.prototype.generateBlockExpression = function (blockExpressionNode, returnResult, indentLevel) {
            var _this = this;
            var output = [];
            blockExpressionNode.expressionList.forEach(function (en, index) {
                var isLast = index === blockExpressionNode.expressionList.length - 1;
                output.push(_this.generateExpression(en, isLast && returnResult, indentLevel));
                if (blockExpressionNode.expressionList.length !== 1 && !_this.doesEndInSemiColon(output[output.length - 1])) {
                    output.push(';\n');
                }
            });
            return output.join('');
        };
        JavaScriptGenerator.prototype.generateAssignmentExpression = function (assignmentExpressionNode, returnResult, indentLevel) {
            var output = [];
            output.push(this.indent(indentLevel) + (assignmentExpressionNode.isAssignmentToSelfVariable ? 'this.' : '') + CoolToJS.Utility.escapeIfReserved(assignmentExpressionNode.identifierName) + ' = ');
            output.push(this.generateExpression(assignmentExpressionNode.assignmentExpression, returnResult, 0));
            return output.join('');
        };
        JavaScriptGenerator.prototype.generateObjectIdentifierExpression = function (objectIdentifierExpressionNode, returnResult, indentLevel) {
            return (this.indent(indentLevel) +
                (returnResult ? '_returnValue = ' : '') +
                (objectIdentifierExpressionNode.isCallToSelf ? 'this.' : '') +
                CoolToJS.Utility.escapeIfReserved(objectIdentifierExpressionNode.objectIdentifierName));
        };
        JavaScriptGenerator.prototype.generateSelfExpression = function (selfExpressionNode, returnResult, indentLevel) {
            return this.indent(indentLevel) + (returnResult ? '_returnValue = ' : '') + 'this';
        };
        JavaScriptGenerator.prototype.generateNewExpression = function (newExpressionNode, returnResult, indentLevel) {
            if (newExpressionNode.classNode.isAsync) {
                return this.indent(indentLevel) + '(yield* new ' + this.translateTypeNameIfPrimitiveType(newExpressionNode.typeName) + '("' + newExpressionNode.typeName + '")._initialize())';
            }
            else {
                return this.indent(indentLevel) + 'new ' + this.translateTypeNameIfPrimitiveType(newExpressionNode.typeName) + '("' + newExpressionNode.typeName + '")';
            }
        };
        JavaScriptGenerator.prototype.generateStringLiteralExpression = function (stringLiteralExpressionNode, returnResult, indentLevel) {
            return this.indent(indentLevel) + (returnResult ? '_returnValue = ' : '') + 'new _String("' + stringLiteralExpressionNode.value + '")';
        };
        JavaScriptGenerator.prototype.generateIntegerLiteralExpression = function (integerLiteralExpressionNode, returnResult, indentLevel) {
            return this.indent(indentLevel) + (returnResult ? '_returnValue = ' : '') + 'new _Int(' + integerLiteralExpressionNode.value + ')';
        };
        JavaScriptGenerator.prototype.generateParentheticalExpressionNode = function (parentheticalExpressionNode, returnResult, indentLevel) {
            // parenthetical expressions aren't necessary - just generate its child expression
            return this.generateExpression(parentheticalExpressionNode.innerExpression, returnResult, indentLevel);
        };
        JavaScriptGenerator.prototype.generateTrueKeywordExpression = function (trueKeywordExpressionNode, returnResult, indentLevel) {
            return this.indent(indentLevel) + (returnResult ? '_returnValue = ' : '') + 'new _Bool(true)';
        };
        JavaScriptGenerator.prototype.generateFalseKeywordExpression = function (falseKeywordExpressionNode, returnResult, indentLevel) {
            return this.indent(indentLevel) + (returnResult ? '_returnValue = ' : '') + 'new _Bool(false)';
        };
        JavaScriptGenerator.prototype.generateBinaryOperationExpression = function (binOpExpressionNode, returnResult, indentLevel) {
            var output = [], operand1, operand2;
            if (this.expressionReturnsItself(binOpExpressionNode.operand1)) {
                operand1 = this.generateExpression(this.unwrapSelfReturningExpression(binOpExpressionNode.operand1), false, 0);
            }
            else {
                operand1 = this.wrapInSelfExecutingFunction(binOpExpressionNode.operand1, this.isInAsyncContext, indentLevel);
            }
            if (this.expressionReturnsItself(binOpExpressionNode.operand2)) {
                operand2 = this.generateExpression(this.unwrapSelfReturningExpression(binOpExpressionNode.operand2), false, 0);
            }
            else {
                operand2 = this.wrapInSelfExecutingFunction(binOpExpressionNode.operand2, this.isInAsyncContext, indentLevel);
            }
            output.push(this.indent(indentLevel) + (returnResult ? '_returnValue = ' : ''));
            switch (binOpExpressionNode.operationType) {
                case CoolToJS.BinaryOperationType.Addition:
                    output.push('_add');
                    break;
                case CoolToJS.BinaryOperationType.Subtraction:
                    output.push('_subtract');
                    break;
                case CoolToJS.BinaryOperationType.Multiplication:
                    output.push('_multiply');
                    break;
                case CoolToJS.BinaryOperationType.Division:
                    output.push('_divide');
                    break;
                case CoolToJS.BinaryOperationType.Comparison:
                    output.push('_equals');
                    break;
                case CoolToJS.BinaryOperationType.LessThan:
                    output.push('_lessThan');
                    break;
                case CoolToJS.BinaryOperationType.LessThanOrEqualTo:
                    output.push('_lessThanOrEqualTo');
                    break;
                default:
                    throw 'Unrecognized BinaryOperationType: ' + binOpExpressionNode[binOpExpressionNode.operationType];
            }
            output.push('(' + operand1 + ', ' + operand2 + ')');
            return output.join('');
        };
        JavaScriptGenerator.prototype.generateUnaryOperationExpression = function (unOpExpressionNode, returnResult, indentLevel) {
            var output = [];
            output.push(this.indent(indentLevel) + (returnResult ? '_returnValue = ' : ''));
            switch (unOpExpressionNode.operationType) {
                case CoolToJS.UnaryOperationType.Complement:
                    output.push('_complement');
                    break;
                case CoolToJS.UnaryOperationType.Not:
                    output.push('_not');
                    break;
                default:
                    throw 'Unrecognized UnaryOperationType: ' + unOpExpressionNode[unOpExpressionNode.operationType];
            }
            output.push('(');
            if (this.expressionReturnsItself(unOpExpressionNode)) {
                output.push(this.generateExpression(this.unwrapSelfReturningExpression(unOpExpressionNode.operand), false, 0));
            }
            else {
                output.push(this.wrapInSelfExecutingFunction(unOpExpressionNode.operand, this.isInAsyncContext, indentLevel));
            }
            output.push(')');
            return output.join('');
        };
        JavaScriptGenerator.prototype.generateIfThenElseExpression = function (ifExpressionNode, returnResult, indentLevel) {
            var output = [];
            output.push(this.indent(indentLevel) + 'if ((');
            if (this.expressionReturnsItself(ifExpressionNode.predicate)) {
                output.push(this.generateExpression(this.unwrapSelfReturningExpression(ifExpressionNode.predicate), false, 0));
            }
            else {
                output.push(this.wrapInSelfExecutingFunction(ifExpressionNode.predicate, this.isInAsyncContext, indentLevel));
            }
            output.push(')._value) {\n');
            output.push(this.generateExpression(ifExpressionNode.consequent, returnResult, indentLevel + 1) + '\n');
            output.push(this.indent(indentLevel) + '} else {\n');
            output.push(this.generateExpression(ifExpressionNode.alternative, returnResult, indentLevel + 1) + '\n');
            output.push(this.indent(indentLevel) + '}\n');
            return output.join('');
        };
        JavaScriptGenerator.prototype.generateWhileExpression = function (whileExpressionNode, returnResult, indentLevel) {
            var output = [];
            output.push(this.indent(indentLevel) + 'while ((');
            if (this.expressionReturnsItself(whileExpressionNode.whileConditionExpression)) {
                output.push(this.generateExpression(this.unwrapSelfReturningExpression(whileExpressionNode.whileConditionExpression), false, 0));
            }
            else {
                output.push(this.wrapInSelfExecutingFunction(whileExpressionNode.whileConditionExpression, this.isInAsyncContext, indentLevel));
            }
            output.push(')._value) {\n');
            output.push(this.generateExpression(whileExpressionNode.whileBodyExpression, returnResult, indentLevel + 1) + '\n');
            output.push(this.indent(indentLevel) + '}\n');
            return output.join('');
        };
        JavaScriptGenerator.prototype.generateCaseExpression = function (caseExpressionNode, returnResult, indentLevel) {
            var _this = this;
            var output = [];
            output.push(this.indent(indentLevel) + (returnResult ? '_returnValue = ' : '') + (this.isInAsyncContext ? 'yield* _asyncCase' : '_case') + '(');
            if (this.expressionReturnsItself(caseExpressionNode.condition)) {
                output.push(this.generateExpression(this.unwrapSelfReturningExpression(caseExpressionNode.condition), false, 0));
            }
            else {
                output.push(this.wrapInSelfExecutingFunction(caseExpressionNode.condition, this.isInAsyncContext, indentLevel));
            }
            output.push(', [\n');
            caseExpressionNode.caseOptionList.forEach(function (option, index) {
                var isLast = index === caseExpressionNode.caseOptionList.length - 1;
                output.push(_this.indent(indentLevel + 1) + '[' + _this.translateTypeNameIfPrimitiveType(option.typeName) + ', ');
                output.push(_this.isInAsyncContext ? 'function * ' : '');
                output.push('(' + CoolToJS.Utility.escapeIfReserved(option.identiferName) + ')');
                output.push((_this.isInAsyncContext ? '' : ' =>') + ' { return (');
                if (_this.expressionReturnsItself(option.caseOptionExpression)) {
                    output.push(_this.generateExpression(_this.unwrapSelfReturningExpression(option.caseOptionExpression), false, 0));
                }
                else {
                    output.push(_this.wrapInSelfExecutingFunction(option.caseOptionExpression, _this.isInAsyncContext, indentLevel));
                }
                output.push('); }');
                output.push(']' + (isLast ? '' : ',') + '\n');
            });
            output.push(this.indent(indentLevel) + '], this, this.type_name()._value)');
            return output.join('');
        };
        JavaScriptGenerator.prototype.generateIsVoidExpression = function (isVoidExpressionNode, returnResult, indentLevel) {
            var output = [];
            output.push(this.indent(indentLevel) + '(');
            output.push(this.generateExpression(isVoidExpressionNode.isVoidCondition, returnResult, indentLevel));
            output.push(' ? new _Bool(false) : new _Bool(true))');
            return output.join('');
        };
        JavaScriptGenerator.prototype.indent = function (indentCount) {
            if (typeof this.indentCache[indentCount] === 'undefined') {
                var returnIndent = '';
                for (var i = 0; i < indentCount; i++) {
                    returnIndent += this.singleIndent;
                }
                this.indentCache[indentCount] = returnIndent;
            }
            return this.indentCache[indentCount];
        };
        JavaScriptGenerator.prototype.expressionReturnsItself = function (node) {
            return (node.type === CoolToJS.NodeType.StringLiteralExpression
                || node.type === CoolToJS.NodeType.IntegerLiteralExpression
                || node.type === CoolToJS.NodeType.ObjectIdentifierExpression
                || node.type === CoolToJS.NodeType.TrueKeywordExpression
                || node.type === CoolToJS.NodeType.FalseKeywordExpression
                || node.type === CoolToJS.NodeType.NewExpression
                || node.type === CoolToJS.NodeType.IsvoidExpression
                || node.type === CoolToJS.NodeType.BinaryOperationExpression
                || node.type === CoolToJS.NodeType.UnaryOperationExpression
                || node.type === CoolToJS.NodeType.MethodCallExpression
                || (node.type === CoolToJS.NodeType.BlockExpression
                    && node.expressionList.length === 1
                    && this.expressionReturnsItself(node.expressionList[0]))
                || (node.type === CoolToJS.NodeType.ParentheticalExpression
                    && this.expressionReturnsItself(node.innerExpression)));
        };
        JavaScriptGenerator.prototype.unwrapSelfReturningExpression = function (node) {
            if (node.type === CoolToJS.NodeType.StringLiteralExpression
                || node.type === CoolToJS.NodeType.IntegerLiteralExpression
                || node.type === CoolToJS.NodeType.ObjectIdentifierExpression
                || node.type === CoolToJS.NodeType.ParentheticalExpression
                || node.type === CoolToJS.NodeType.TrueKeywordExpression
                || node.type === CoolToJS.NodeType.FalseKeywordExpression
                || node.type === CoolToJS.NodeType.NewExpression
                || node.type === CoolToJS.NodeType.BinaryOperationExpression
                || node.type === CoolToJS.NodeType.UnaryOperationExpression
                || node.type === CoolToJS.NodeType.MethodCallExpression
                || node.type === CoolToJS.NodeType.IsvoidExpression) {
                return node;
            }
            else if (node.type === CoolToJS.NodeType.BlockExpression) {
                return this.unwrapSelfReturningExpression(node.expressionList[0]);
            }
            else {
                throw 'unwrapSelfReturningExpression() should not be called without testing whether the expression is self returning using expressionReturnsItself()';
            }
        };
        JavaScriptGenerator.prototype.wrapInSelfExecutingFunction = function (node, isAsync, indentLevel) {
            var output = [];
            if (isAsync) {
                output.push('(yield* (function *() {\n');
            }
            else {
                output.push('(() => {\n');
            }
            output.push(this.indent(indentLevel + 2) + 'let _returnValue;\n');
            output.push(this.generateExpression(node, true, indentLevel + 2) + '\n');
            output.push(this.indent(indentLevel + 2) + 'return _returnValue;\n');
            if (isAsync) {
                output.push(this.indent(indentLevel + 1) + '}).apply(this))');
            }
            else {
                output.push(this.indent(indentLevel + 1) + '})()');
            }
            return output.join('');
        };
        JavaScriptGenerator.prototype.translateTypeNameIfPrimitiveType = function (typeName) {
            switch (typeName) {
                case 'String':
                    return '_String';
                case 'Int':
                    return '_Int';
                case 'Bool':
                    return '_Bool';
                case 'Object':
                    return '_Object';
                default:
                    return typeName;
            }
        };
        JavaScriptGenerator.prototype.doesEndInSemiColon = function (codeToTest) {
            return /;\s*$/.test(codeToTest);
        };
        return JavaScriptGenerator;
    }());
    CoolToJS.JavaScriptGenerator = JavaScriptGenerator;
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    var LexicalAnalyzer = /** @class */ (function () {
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
                        if (longestMatch.token === CoolToJS.SyntaxKind.NewLine) {
                            currentLineNumber++;
                            currentColumnNumber = 1;
                        }
                        else if (longestMatch.token === CoolToJS.SyntaxKind.String || longestMatch.token === CoolToJS.SyntaxKind.Comment) {
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
                        else if (longestMatch.token === CoolToJS.SyntaxKind.Tab) {
                            currentColumnNumber += _this.tabLength;
                        }
                        else if (longestMatch.token !== CoolToJS.SyntaxKind.CarriageReturn) {
                            // update the column counter
                            currentColumnNumber += longestMatch.match.length;
                        }
                        tokens.push(longestMatch);
                        coolProgramSource = coolProgramSource.slice(longestMatch.match.length);
                    }
                    else {
                        // we weren't able to find a match
                        var errorMessage = 'Syntax error: Unexpected character sequence near "'
                            + coolProgramSource.slice(0, 20).replace(/\r\n|\r|\n|\t|[\s]+/g, ' ')
                            + '..."';
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
                    token: CoolToJS.SyntaxKind.EndOfInput,
                    tokenName: CoolToJS.SyntaxKind[CoolToJS.SyntaxKind.EndOfInput],
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
    }());
    CoolToJS.LexicalAnalyzer = LexicalAnalyzer;
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    // the number values of these enums are the values used in the
    // slr(1) parse table.  Use caution when changing these values.
    var SyntaxKind;
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
    })(SyntaxKind = CoolToJS.SyntaxKind || (CoolToJS.SyntaxKind = {}));
    CoolToJS.StartSyntaxKind = SyntaxKind.Program;
    // order signifies priority (keywords are listed first)
    CoolToJS.TokenLookup = [
        {
            token: SyntaxKind.ClassKeyword,
            regex: /^(class)\b/i,
        },
        {
            token: SyntaxKind.ElseKeyword,
            regex: /^(else)\b/i,
        },
        {
            token: SyntaxKind.FalseKeyword,
            regex: /^(f[aA][lL][sS][eE])\b/,
        },
        {
            token: SyntaxKind.TrueKeyword,
            regex: /^(t[rR][uU][eE])\b/,
        },
        {
            token: SyntaxKind.FiKeyword,
            regex: /^(fi)\b/i,
        },
        {
            token: SyntaxKind.IfKeyword,
            regex: /^(if)\b/i,
        },
        {
            token: SyntaxKind.InheritsKeyword,
            regex: /^(inherits)\b/i,
        },
        {
            token: SyntaxKind.IsvoidKeyword,
            regex: /^(isvoid)\b/i,
        },
        {
            token: SyntaxKind.LetKeyword,
            regex: /^(let)\b/i,
        },
        {
            token: SyntaxKind.InKeyword,
            regex: /^(in)\b/i,
        },
        {
            token: SyntaxKind.LoopKeyword,
            regex: /^(loop)\b/i,
        },
        {
            token: SyntaxKind.PoolKeyword,
            regex: /^(pool)\b/i,
        },
        {
            token: SyntaxKind.ThenKeyword,
            regex: /^(then)\b/i,
        },
        {
            token: SyntaxKind.WhileKeyword,
            regex: /^(while)\b/i,
        },
        {
            token: SyntaxKind.CaseKeyword,
            regex: /^(case)\b/i,
        },
        {
            token: SyntaxKind.EsacKeyword,
            regex: /^(esac)\b/i,
        },
        {
            token: SyntaxKind.NewKeyword,
            regex: /^(new)\b/i,
        },
        {
            token: SyntaxKind.OfKeyword,
            regex: /^(of)\b/i,
        },
        {
            token: SyntaxKind.NotKeyword,
            regex: /^(not)\b/i,
        },
        {
            token: SyntaxKind.Integer,
            regex: /^([0-9]+)\b/,
        },
        {
            token: SyntaxKind.String,
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
            token: SyntaxKind.ObjectIdentifier,
            regex: /^([a-z][a-zA-Z0-9_]*)\b/,
        },
        {
            token: SyntaxKind.TypeIdentifier,
            regex: /^([A-Z][a-zA-Z0-9_]*)\b/,
        },
        {
            token: SyntaxKind.WhiteSpace,
            regex: /^( +)/,
        },
        {
            token: SyntaxKind.CarriageReturn,
            regex: /^(\r)/,
        },
        {
            token: SyntaxKind.NewLine,
            regex: /^(\n)/,
        },
        {
            token: SyntaxKind.Tab,
            regex: /^(\t)/,
        },
        {
            token: SyntaxKind.Comment,
            matchFunction: function (input) {
                var simpleCommentRegex = /^(--.*)/;
                if (simpleCommentRegex.test(input)) {
                    return simpleCommentRegex.exec(input)[1];
                }
                else {
                    if (input.indexOf('(*') === 0) {
                        var workingInput = input.substring(2), unmatchedOpenCommentCount = 1, commentLength = 2;
                        while (unmatchedOpenCommentCount !== 0) {
                            var nextOpen = workingInput.indexOf('(*');
                            var nextClosed = workingInput.indexOf('*)');
                            if (nextClosed === -1) {
                                return null;
                            }
                            if (nextOpen !== -1 && nextOpen < nextClosed) {
                                unmatchedOpenCommentCount++;
                                workingInput = workingInput.substring(nextOpen + 2);
                                commentLength += nextOpen + 2;
                            }
                            else {
                                unmatchedOpenCommentCount--;
                                commentLength += nextClosed + 2;
                                workingInput = workingInput.substring(nextClosed + 2);
                            }
                        }
                        var returnVal = input.substr(0, commentLength);
                        return input.substr(0, commentLength);
                    }
                    else {
                        return null;
                    }
                }
            }
        },
        {
            token: SyntaxKind.DotOperator,
            regex: /^(\.)/
        },
        {
            token: SyntaxKind.AtSignOperator,
            regex: /^(\@)/
        },
        {
            token: SyntaxKind.TildeOperator,
            regex: /^(~)/
        },
        {
            token: SyntaxKind.MultiplationOperator,
            regex: /^(\*)/
        },
        {
            token: SyntaxKind.DivisionOperator,
            regex: /^(\/)/
        },
        {
            token: SyntaxKind.AdditionOperator,
            regex: /^(\+)/
        },
        {
            token: SyntaxKind.SubtractionOperator,
            regex: /^(-)/
        },
        {
            token: SyntaxKind.LessThanOrEqualsOperator,
            regex: /^(<=)/
        },
        {
            token: SyntaxKind.LessThanOperator,
            regex: /^(<)/
        },
        {
            token: SyntaxKind.EqualsOperator,
            regex: /^(=)/
        },
        {
            token: SyntaxKind.AssignmentOperator,
            regex: /^(<-)/
        },
        {
            token: SyntaxKind.FatArrowOperator,
            regex: /^(=>)/
        },
        {
            token: SyntaxKind.OpenParenthesis,
            regex: /^(\()/
        },
        {
            token: SyntaxKind.ClosedParenthesis,
            regex: /^(\))/
        },
        {
            token: SyntaxKind.OpenCurlyBracket,
            regex: /^(\{)/
        },
        {
            token: SyntaxKind.ClosedCurlyBracket,
            regex: /^(\})/
        },
        {
            token: SyntaxKind.Colon,
            regex: /^(:)/
        },
        {
            token: SyntaxKind.SemiColon,
            regex: /^(;)/
        },
        {
            token: SyntaxKind.Comma,
            regex: /^(,)/
        }
    ];
    function isKeyword(tokenType) {
        return (tokenType == SyntaxKind.ClassKeyword
            || tokenType == SyntaxKind.ElseKeyword
            || tokenType == SyntaxKind.FalseKeyword
            || tokenType == SyntaxKind.FiKeyword
            || tokenType == SyntaxKind.IfKeyword
            || tokenType == SyntaxKind.InKeyword
            || tokenType == SyntaxKind.InheritsKeyword
            || tokenType == SyntaxKind.IsvoidKeyword
            || tokenType == SyntaxKind.LetKeyword
            || tokenType == SyntaxKind.LoopKeyword
            || tokenType == SyntaxKind.PoolKeyword
            || tokenType == SyntaxKind.ThenKeyword
            || tokenType == SyntaxKind.WhileKeyword
            || tokenType == SyntaxKind.CaseKeyword
            || tokenType == SyntaxKind.EsacKeyword
            || tokenType == SyntaxKind.NewKeyword
            || tokenType == SyntaxKind.OfKeyword
            || tokenType == SyntaxKind.NotKeyword
            || tokenType == SyntaxKind.TrueKeyword);
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
/// <reference path="./SyntaxKind.ts" />
var CoolToJS;
(function (CoolToJS) {
    var Action;
    (function (Action) {
        Action[Action["Shift"] = 0] = "Shift";
        Action[Action["Reduce"] = 1] = "Reduce";
        Action[Action["Accept"] = 2] = "Accept";
        Action[Action["None"] = 3] = "None";
    })(Action = CoolToJS.Action || (CoolToJS.Action = {}));
    CoolToJS.slr1ParseTable = [
        /* state 0 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 3 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.None, nextState: 2 }, null, null, null, null, null, null, null, null, { action: Action.None, nextState: 1 }],
        /* state 1 */ [{ action: Action.Accept }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 2 */ [null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 4 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 3 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 5 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 4 */ [{ action: Action.Reduce, productionIndex: 1 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 3 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.None, nextState: 2 }, null, null, null, null, null, null, null, null, { action: Action.None, nextState: 6 }],
        /* state 5 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 7 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 8 }, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 6 */ [{ action: Action.Reduce, productionIndex: 2 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 7 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 9 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 8 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 13 }, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 11 }, null, null, null, null, null, null, { action: Action.None, nextState: 12 }, { action: Action.None, nextState: 10 }, null, null, null, null],
        /* state 9 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 14 }, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 10 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 15 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 11 */ [null, null, null, null, null, null, null, null, null, null, { action: Action.Reduce, productionIndex: 8 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 12 */ [null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 16 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 13 */ [null, { action: Action.Shift, nextState: 17 }, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 18 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 14 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 13 }, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 20 }, null, null, null, null, null, null, { action: Action.None, nextState: 12 }, { action: Action.None, nextState: 19 }, null, null, null, null],
        /* state 15 */ [null, null, null, null, null, null, null, null, null, null, { action: Action.Reduce, productionIndex: 7 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 16 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 13 }, null, null, null, null, null, null, null, null, { action: Action.Reduce, productionIndex: 3 }, null, null, null, null, null, null, { action: Action.None, nextState: 12 }, { action: Action.None, nextState: 21 }, null, null, null, null],
        /* state 17 */ [null, null, { action: Action.Shift, nextState: 23 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 25 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.None, nextState: 24 }, { action: Action.None, nextState: 22 }, null, null],
        /* state 18 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 26 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 19 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 27 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 20 */ [null, null, null, null, null, null, null, null, null, null, { action: Action.Reduce, productionIndex: 6 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 21 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Reduce, productionIndex: 4 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 22 */ [null, null, { action: Action.Shift, nextState: 28 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 23 */ [null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 29 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 24 */ [null, null, { action: Action.Reduce, productionIndex: 9 }, null, null, { action: Action.Shift, nextState: 30 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 25 */ [null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 31 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 26 */ [null, null, null, null, null, null, null, null, null, null, { action: Action.Reduce, productionIndex: 14 }, null, { action: Action.Shift, nextState: 32 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 27 */ [null, null, null, null, null, null, null, null, null, null, { action: Action.Reduce, productionIndex: 5 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 28 */ [null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 33 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 29 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 34 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 30 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 25 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.None, nextState: 24 }, { action: Action.None, nextState: 35 }, null, null],
        /* state 31 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 36 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 32 */ [null, { action: Action.Shift, nextState: 48 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 43 }, null, null, null, { action: Action.Shift, nextState: 52 }, null, { action: Action.Shift, nextState: 39 }, null, null, { action: Action.Shift, nextState: 49 }, { action: Action.Shift, nextState: 45 }, { action: Action.Shift, nextState: 42 }, null, { action: Action.Shift, nextState: 44 }, { action: Action.Shift, nextState: 47 }, { action: Action.Shift, nextState: 38 }, null, null, { action: Action.Shift, nextState: 50 }, null, { action: Action.Shift, nextState: 51 }, null, { action: Action.Shift, nextState: 40 }, { action: Action.Shift, nextState: 41 }, null, { action: Action.Shift, nextState: 46 }, null, null, { action: Action.None, nextState: 37 }, null, null, null, null, null, null, null, null],
        /* state 33 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 53 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 34 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 54 }, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 35 */ [null, null, { action: Action.Reduce, productionIndex: 10 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 36 */ [null, null, { action: Action.Reduce, productionIndex: 15 }, null, null, { action: Action.Reduce, productionIndex: 15 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 37 */ [null, null, null, { action: Action.Shift, nextState: 59 }, { action: Action.Shift, nextState: 57 }, null, { action: Action.Shift, nextState: 58 }, { action: Action.Shift, nextState: 55 }, { action: Action.Shift, nextState: 60 }, null, { action: Action.Reduce, productionIndex: 13 }, { action: Action.Shift, nextState: 61 }, null, { action: Action.Shift, nextState: 62 }, { action: Action.Shift, nextState: 63 }, null, { action: Action.Shift, nextState: 56 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 38 */ [null, { action: Action.Shift, nextState: 65 }, { action: Action.Reduce, productionIndex: 50 }, { action: Action.Reduce, productionIndex: 50 }, { action: Action.Reduce, productionIndex: 50 }, { action: Action.Reduce, productionIndex: 50 }, { action: Action.Reduce, productionIndex: 50 }, { action: Action.Reduce, productionIndex: 50 }, { action: Action.Reduce, productionIndex: 50 }, null, { action: Action.Reduce, productionIndex: 50 }, { action: Action.Reduce, productionIndex: 50 }, { action: Action.Shift, nextState: 64 }, { action: Action.Reduce, productionIndex: 50 }, { action: Action.Reduce, productionIndex: 50 }, null, { action: Action.Reduce, productionIndex: 50 }, null, null, { action: Action.Reduce, productionIndex: 50 }, null, null, { action: Action.Reduce, productionIndex: 50 }, null, { action: Action.Reduce, productionIndex: 50 }, null, null, null, null, { action: Action.Reduce, productionIndex: 50 }, null, null, null, { action: Action.Reduce, productionIndex: 50 }, { action: Action.Reduce, productionIndex: 50 }, null, { action: Action.Reduce, productionIndex: 50 }, null, null, null, null, { action: Action.Reduce, productionIndex: 50 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 39 */ [null, { action: Action.Shift, nextState: 48 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 43 }, null, null, null, { action: Action.Shift, nextState: 52 }, null, { action: Action.Shift, nextState: 39 }, null, null, { action: Action.Shift, nextState: 49 }, { action: Action.Shift, nextState: 45 }, { action: Action.Shift, nextState: 42 }, null, { action: Action.Shift, nextState: 44 }, { action: Action.Shift, nextState: 47 }, { action: Action.Shift, nextState: 38 }, null, null, { action: Action.Shift, nextState: 50 }, null, { action: Action.Shift, nextState: 51 }, null, { action: Action.Shift, nextState: 40 }, { action: Action.Shift, nextState: 41 }, null, { action: Action.Shift, nextState: 46 }, null, null, { action: Action.None, nextState: 66 }, null, null, null, null, null, null, null, null],
        /* state 40 */ [null, { action: Action.Shift, nextState: 48 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 43 }, null, null, null, { action: Action.Shift, nextState: 52 }, null, { action: Action.Shift, nextState: 39 }, null, null, { action: Action.Shift, nextState: 49 }, { action: Action.Shift, nextState: 45 }, { action: Action.Shift, nextState: 42 }, null, { action: Action.Shift, nextState: 44 }, { action: Action.Shift, nextState: 47 }, { action: Action.Shift, nextState: 38 }, null, null, { action: Action.Shift, nextState: 50 }, null, { action: Action.Shift, nextState: 51 }, null, { action: Action.Shift, nextState: 40 }, { action: Action.Shift, nextState: 41 }, null, { action: Action.Shift, nextState: 46 }, null, null, { action: Action.None, nextState: 67 }, null, null, null, null, null, null, null, null],
        /* state 41 */ [null, { action: Action.Shift, nextState: 48 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 43 }, null, null, null, { action: Action.Shift, nextState: 52 }, null, { action: Action.Shift, nextState: 39 }, null, null, { action: Action.Shift, nextState: 49 }, { action: Action.Shift, nextState: 45 }, { action: Action.Shift, nextState: 42 }, null, { action: Action.Shift, nextState: 44 }, { action: Action.Shift, nextState: 47 }, { action: Action.Shift, nextState: 38 }, null, null, { action: Action.Shift, nextState: 50 }, null, { action: Action.Shift, nextState: 51 }, null, { action: Action.Shift, nextState: 40 }, { action: Action.Shift, nextState: 41 }, null, { action: Action.Shift, nextState: 46 }, null, null, { action: Action.None, nextState: 69 }, null, { action: Action.None, nextState: 68 }, null, null, null, null, null, null],
        /* state 42 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 71 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.None, nextState: 70 }, null],
        /* state 43 */ [null, { action: Action.Shift, nextState: 48 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 43 }, null, null, null, { action: Action.Shift, nextState: 52 }, null, { action: Action.Shift, nextState: 39 }, null, null, { action: Action.Shift, nextState: 49 }, { action: Action.Shift, nextState: 45 }, { action: Action.Shift, nextState: 42 }, null, { action: Action.Shift, nextState: 44 }, { action: Action.Shift, nextState: 47 }, { action: Action.Shift, nextState: 38 }, null, null, { action: Action.Shift, nextState: 50 }, null, { action: Action.Shift, nextState: 51 }, null, { action: Action.Shift, nextState: 40 }, { action: Action.Shift, nextState: 41 }, null, { action: Action.Shift, nextState: 46 }, null, null, { action: Action.None, nextState: 72 }, null, null, null, null, null, null, null, null],
        /* state 44 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 73 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 45 */ [null, { action: Action.Shift, nextState: 48 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 43 }, null, null, null, { action: Action.Shift, nextState: 52 }, null, { action: Action.Shift, nextState: 39 }, null, null, { action: Action.Shift, nextState: 49 }, { action: Action.Shift, nextState: 45 }, { action: Action.Shift, nextState: 42 }, null, { action: Action.Shift, nextState: 44 }, { action: Action.Shift, nextState: 47 }, { action: Action.Shift, nextState: 38 }, null, null, { action: Action.Shift, nextState: 50 }, null, { action: Action.Shift, nextState: 51 }, null, { action: Action.Shift, nextState: 40 }, { action: Action.Shift, nextState: 41 }, null, { action: Action.Shift, nextState: 46 }, null, null, { action: Action.None, nextState: 74 }, null, null, null, null, null, null, null, null],
        /* state 46 */ [null, { action: Action.Shift, nextState: 48 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 43 }, null, null, null, { action: Action.Shift, nextState: 52 }, null, { action: Action.Shift, nextState: 39 }, null, null, { action: Action.Shift, nextState: 49 }, { action: Action.Shift, nextState: 45 }, { action: Action.Shift, nextState: 42 }, null, { action: Action.Shift, nextState: 44 }, { action: Action.Shift, nextState: 47 }, { action: Action.Shift, nextState: 38 }, null, null, { action: Action.Shift, nextState: 50 }, null, { action: Action.Shift, nextState: 51 }, null, { action: Action.Shift, nextState: 40 }, { action: Action.Shift, nextState: 41 }, null, { action: Action.Shift, nextState: 46 }, null, null, { action: Action.None, nextState: 75 }, null, null, null, null, null, null, null, null],
        /* state 47 */ [null, { action: Action.Shift, nextState: 48 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 43 }, null, null, null, { action: Action.Shift, nextState: 52 }, null, { action: Action.Shift, nextState: 39 }, null, null, { action: Action.Shift, nextState: 49 }, { action: Action.Shift, nextState: 45 }, { action: Action.Shift, nextState: 42 }, null, { action: Action.Shift, nextState: 44 }, { action: Action.Shift, nextState: 47 }, { action: Action.Shift, nextState: 38 }, null, null, { action: Action.Shift, nextState: 50 }, null, { action: Action.Shift, nextState: 51 }, null, { action: Action.Shift, nextState: 40 }, { action: Action.Shift, nextState: 41 }, null, { action: Action.Shift, nextState: 46 }, null, null, { action: Action.None, nextState: 76 }, null, null, null, null, null, null, null, null],
        /* state 48 */ [null, { action: Action.Shift, nextState: 48 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 43 }, null, null, null, { action: Action.Shift, nextState: 52 }, null, { action: Action.Shift, nextState: 39 }, null, null, { action: Action.Shift, nextState: 49 }, { action: Action.Shift, nextState: 45 }, { action: Action.Shift, nextState: 42 }, null, { action: Action.Shift, nextState: 44 }, { action: Action.Shift, nextState: 47 }, { action: Action.Shift, nextState: 38 }, null, null, { action: Action.Shift, nextState: 50 }, null, { action: Action.Shift, nextState: 51 }, null, { action: Action.Shift, nextState: 40 }, { action: Action.Shift, nextState: 41 }, null, { action: Action.Shift, nextState: 46 }, null, null, { action: Action.None, nextState: 77 }, null, null, null, null, null, null, null, null],
        /* state 49 */ [null, null, { action: Action.Reduce, productionIndex: 51 }, { action: Action.Reduce, productionIndex: 51 }, { action: Action.Reduce, productionIndex: 51 }, { action: Action.Reduce, productionIndex: 51 }, { action: Action.Reduce, productionIndex: 51 }, { action: Action.Reduce, productionIndex: 51 }, { action: Action.Reduce, productionIndex: 51 }, null, { action: Action.Reduce, productionIndex: 51 }, { action: Action.Reduce, productionIndex: 51 }, null, { action: Action.Reduce, productionIndex: 51 }, { action: Action.Reduce, productionIndex: 51 }, null, { action: Action.Reduce, productionIndex: 51 }, null, null, { action: Action.Reduce, productionIndex: 51 }, null, null, { action: Action.Reduce, productionIndex: 51 }, null, { action: Action.Reduce, productionIndex: 51 }, null, null, null, null, { action: Action.Reduce, productionIndex: 51 }, null, null, null, { action: Action.Reduce, productionIndex: 51 }, { action: Action.Reduce, productionIndex: 51 }, null, { action: Action.Reduce, productionIndex: 51 }, null, null, null, null, { action: Action.Reduce, productionIndex: 51 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 50 */ [null, null, { action: Action.Reduce, productionIndex: 52 }, { action: Action.Reduce, productionIndex: 52 }, { action: Action.Reduce, productionIndex: 52 }, { action: Action.Reduce, productionIndex: 52 }, { action: Action.Reduce, productionIndex: 52 }, { action: Action.Reduce, productionIndex: 52 }, { action: Action.Reduce, productionIndex: 52 }, null, { action: Action.Reduce, productionIndex: 52 }, { action: Action.Reduce, productionIndex: 52 }, null, { action: Action.Reduce, productionIndex: 52 }, { action: Action.Reduce, productionIndex: 52 }, null, { action: Action.Reduce, productionIndex: 52 }, null, null, { action: Action.Reduce, productionIndex: 52 }, null, null, { action: Action.Reduce, productionIndex: 52 }, null, { action: Action.Reduce, productionIndex: 52 }, null, null, null, null, { action: Action.Reduce, productionIndex: 52 }, null, null, null, { action: Action.Reduce, productionIndex: 52 }, { action: Action.Reduce, productionIndex: 52 }, null, { action: Action.Reduce, productionIndex: 52 }, null, null, null, null, { action: Action.Reduce, productionIndex: 52 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 51 */ [null, null, { action: Action.Reduce, productionIndex: 53 }, { action: Action.Reduce, productionIndex: 53 }, { action: Action.Reduce, productionIndex: 53 }, { action: Action.Reduce, productionIndex: 53 }, { action: Action.Reduce, productionIndex: 53 }, { action: Action.Reduce, productionIndex: 53 }, { action: Action.Reduce, productionIndex: 53 }, null, { action: Action.Reduce, productionIndex: 53 }, { action: Action.Reduce, productionIndex: 53 }, null, { action: Action.Reduce, productionIndex: 53 }, { action: Action.Reduce, productionIndex: 53 }, null, { action: Action.Reduce, productionIndex: 53 }, null, null, { action: Action.Reduce, productionIndex: 53 }, null, null, { action: Action.Reduce, productionIndex: 53 }, null, { action: Action.Reduce, productionIndex: 53 }, null, null, null, null, { action: Action.Reduce, productionIndex: 53 }, null, null, null, { action: Action.Reduce, productionIndex: 53 }, { action: Action.Reduce, productionIndex: 53 }, null, { action: Action.Reduce, productionIndex: 53 }, null, null, null, null, { action: Action.Reduce, productionIndex: 53 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 52 */ [null, null, { action: Action.Reduce, productionIndex: 54 }, { action: Action.Reduce, productionIndex: 54 }, { action: Action.Reduce, productionIndex: 54 }, { action: Action.Reduce, productionIndex: 54 }, { action: Action.Reduce, productionIndex: 54 }, { action: Action.Reduce, productionIndex: 54 }, { action: Action.Reduce, productionIndex: 54 }, null, { action: Action.Reduce, productionIndex: 54 }, { action: Action.Reduce, productionIndex: 54 }, null, { action: Action.Reduce, productionIndex: 54 }, { action: Action.Reduce, productionIndex: 54 }, null, { action: Action.Reduce, productionIndex: 54 }, null, null, { action: Action.Reduce, productionIndex: 54 }, null, null, { action: Action.Reduce, productionIndex: 54 }, null, { action: Action.Reduce, productionIndex: 54 }, null, null, null, null, { action: Action.Reduce, productionIndex: 54 }, null, null, null, { action: Action.Reduce, productionIndex: 54 }, { action: Action.Reduce, productionIndex: 54 }, null, { action: Action.Reduce, productionIndex: 54 }, null, null, null, null, { action: Action.Reduce, productionIndex: 54 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 53 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 78 }, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 54 */ [null, { action: Action.Shift, nextState: 48 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 43 }, null, null, null, { action: Action.Shift, nextState: 52 }, null, { action: Action.Shift, nextState: 39 }, null, null, { action: Action.Shift, nextState: 49 }, { action: Action.Shift, nextState: 45 }, { action: Action.Shift, nextState: 42 }, null, { action: Action.Shift, nextState: 44 }, { action: Action.Shift, nextState: 47 }, { action: Action.Shift, nextState: 38 }, null, null, { action: Action.Shift, nextState: 50 }, null, { action: Action.Shift, nextState: 51 }, null, { action: Action.Shift, nextState: 40 }, { action: Action.Shift, nextState: 41 }, null, { action: Action.Shift, nextState: 46 }, null, null, { action: Action.None, nextState: 79 }, null, null, null, null, null, null, null, null],
        /* state 55 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 80 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 56 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 81 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 57 */ [null, { action: Action.Shift, nextState: 48 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 43 }, null, null, null, { action: Action.Shift, nextState: 52 }, null, { action: Action.Shift, nextState: 39 }, null, null, { action: Action.Shift, nextState: 49 }, { action: Action.Shift, nextState: 45 }, { action: Action.Shift, nextState: 42 }, null, { action: Action.Shift, nextState: 44 }, { action: Action.Shift, nextState: 47 }, { action: Action.Shift, nextState: 38 }, null, null, { action: Action.Shift, nextState: 50 }, null, { action: Action.Shift, nextState: 51 }, null, { action: Action.Shift, nextState: 40 }, { action: Action.Shift, nextState: 41 }, null, { action: Action.Shift, nextState: 46 }, null, null, { action: Action.None, nextState: 82 }, null, null, null, null, null, null, null, null],
        /* state 58 */ [null, { action: Action.Shift, nextState: 48 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 43 }, null, null, null, { action: Action.Shift, nextState: 52 }, null, { action: Action.Shift, nextState: 39 }, null, null, { action: Action.Shift, nextState: 49 }, { action: Action.Shift, nextState: 45 }, { action: Action.Shift, nextState: 42 }, null, { action: Action.Shift, nextState: 44 }, { action: Action.Shift, nextState: 47 }, { action: Action.Shift, nextState: 38 }, null, null, { action: Action.Shift, nextState: 50 }, null, { action: Action.Shift, nextState: 51 }, null, { action: Action.Shift, nextState: 40 }, { action: Action.Shift, nextState: 41 }, null, { action: Action.Shift, nextState: 46 }, null, null, { action: Action.None, nextState: 83 }, null, null, null, null, null, null, null, null],
        /* state 59 */ [null, { action: Action.Shift, nextState: 48 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 43 }, null, null, null, { action: Action.Shift, nextState: 52 }, null, { action: Action.Shift, nextState: 39 }, null, null, { action: Action.Shift, nextState: 49 }, { action: Action.Shift, nextState: 45 }, { action: Action.Shift, nextState: 42 }, null, { action: Action.Shift, nextState: 44 }, { action: Action.Shift, nextState: 47 }, { action: Action.Shift, nextState: 38 }, null, null, { action: Action.Shift, nextState: 50 }, null, { action: Action.Shift, nextState: 51 }, null, { action: Action.Shift, nextState: 40 }, { action: Action.Shift, nextState: 41 }, null, { action: Action.Shift, nextState: 46 }, null, null, { action: Action.None, nextState: 84 }, null, null, null, null, null, null, null, null],
        /* state 60 */ [null, { action: Action.Shift, nextState: 48 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 43 }, null, null, null, { action: Action.Shift, nextState: 52 }, null, { action: Action.Shift, nextState: 39 }, null, null, { action: Action.Shift, nextState: 49 }, { action: Action.Shift, nextState: 45 }, { action: Action.Shift, nextState: 42 }, null, { action: Action.Shift, nextState: 44 }, { action: Action.Shift, nextState: 47 }, { action: Action.Shift, nextState: 38 }, null, null, { action: Action.Shift, nextState: 50 }, null, { action: Action.Shift, nextState: 51 }, null, { action: Action.Shift, nextState: 40 }, { action: Action.Shift, nextState: 41 }, null, { action: Action.Shift, nextState: 46 }, null, null, { action: Action.None, nextState: 85 }, null, null, null, null, null, null, null, null],
        /* state 61 */ [null, { action: Action.Shift, nextState: 48 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 43 }, null, null, null, { action: Action.Shift, nextState: 52 }, null, { action: Action.Shift, nextState: 39 }, null, null, { action: Action.Shift, nextState: 49 }, { action: Action.Shift, nextState: 45 }, { action: Action.Shift, nextState: 42 }, null, { action: Action.Shift, nextState: 44 }, { action: Action.Shift, nextState: 47 }, { action: Action.Shift, nextState: 38 }, null, null, { action: Action.Shift, nextState: 50 }, null, { action: Action.Shift, nextState: 51 }, null, { action: Action.Shift, nextState: 40 }, { action: Action.Shift, nextState: 41 }, null, { action: Action.Shift, nextState: 46 }, null, null, { action: Action.None, nextState: 86 }, null, null, null, null, null, null, null, null],
        /* state 62 */ [null, { action: Action.Shift, nextState: 48 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 43 }, null, null, null, { action: Action.Shift, nextState: 52 }, null, { action: Action.Shift, nextState: 39 }, null, null, { action: Action.Shift, nextState: 49 }, { action: Action.Shift, nextState: 45 }, { action: Action.Shift, nextState: 42 }, null, { action: Action.Shift, nextState: 44 }, { action: Action.Shift, nextState: 47 }, { action: Action.Shift, nextState: 38 }, null, null, { action: Action.Shift, nextState: 50 }, null, { action: Action.Shift, nextState: 51 }, null, { action: Action.Shift, nextState: 40 }, { action: Action.Shift, nextState: 41 }, null, { action: Action.Shift, nextState: 46 }, null, null, { action: Action.None, nextState: 87 }, null, null, null, null, null, null, null, null],
        /* state 63 */ [null, { action: Action.Shift, nextState: 48 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 43 }, null, null, null, { action: Action.Shift, nextState: 52 }, null, { action: Action.Shift, nextState: 39 }, null, null, { action: Action.Shift, nextState: 49 }, { action: Action.Shift, nextState: 45 }, { action: Action.Shift, nextState: 42 }, null, { action: Action.Shift, nextState: 44 }, { action: Action.Shift, nextState: 47 }, { action: Action.Shift, nextState: 38 }, null, null, { action: Action.Shift, nextState: 50 }, null, { action: Action.Shift, nextState: 51 }, null, { action: Action.Shift, nextState: 40 }, { action: Action.Shift, nextState: 41 }, null, { action: Action.Shift, nextState: 46 }, null, null, { action: Action.None, nextState: 88 }, null, null, null, null, null, null, null, null],
        /* state 64 */ [null, { action: Action.Shift, nextState: 48 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 43 }, null, null, null, { action: Action.Shift, nextState: 52 }, null, { action: Action.Shift, nextState: 39 }, null, null, { action: Action.Shift, nextState: 49 }, { action: Action.Shift, nextState: 45 }, { action: Action.Shift, nextState: 42 }, null, { action: Action.Shift, nextState: 44 }, { action: Action.Shift, nextState: 47 }, { action: Action.Shift, nextState: 38 }, null, null, { action: Action.Shift, nextState: 50 }, null, { action: Action.Shift, nextState: 51 }, null, { action: Action.Shift, nextState: 40 }, { action: Action.Shift, nextState: 41 }, null, { action: Action.Shift, nextState: 46 }, null, null, { action: Action.None, nextState: 89 }, null, null, null, null, null, null, null, null],
        /* state 65 */ [null, { action: Action.Shift, nextState: 48 }, { action: Action.Shift, nextState: 90 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 43 }, null, null, null, { action: Action.Shift, nextState: 52 }, null, { action: Action.Shift, nextState: 39 }, null, null, { action: Action.Shift, nextState: 49 }, { action: Action.Shift, nextState: 45 }, { action: Action.Shift, nextState: 42 }, null, { action: Action.Shift, nextState: 44 }, { action: Action.Shift, nextState: 47 }, { action: Action.Shift, nextState: 38 }, null, null, { action: Action.Shift, nextState: 50 }, null, { action: Action.Shift, nextState: 51 }, null, { action: Action.Shift, nextState: 40 }, { action: Action.Shift, nextState: 41 }, null, { action: Action.Shift, nextState: 46 }, null, null, { action: Action.None, nextState: 92 }, { action: Action.None, nextState: 91 }, null, null, null, null, null, null, null],
        /* state 66 */ [null, null, null, { action: Action.Shift, nextState: 59 }, { action: Action.Shift, nextState: 57 }, null, { action: Action.Shift, nextState: 58 }, { action: Action.Shift, nextState: 55 }, { action: Action.Shift, nextState: 60 }, null, null, { action: Action.Shift, nextState: 61 }, null, { action: Action.Shift, nextState: 62 }, { action: Action.Shift, nextState: 63 }, null, { action: Action.Shift, nextState: 56 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 93 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 67 */ [null, null, null, { action: Action.Shift, nextState: 59 }, { action: Action.Shift, nextState: 57 }, null, { action: Action.Shift, nextState: 58 }, { action: Action.Shift, nextState: 55 }, { action: Action.Shift, nextState: 60 }, null, null, { action: Action.Shift, nextState: 61 }, null, { action: Action.Shift, nextState: 62 }, { action: Action.Shift, nextState: 63 }, null, { action: Action.Shift, nextState: 56 }, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 94 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 68 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 95 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 69 */ [null, null, null, { action: Action.Shift, nextState: 59 }, { action: Action.Shift, nextState: 57 }, null, { action: Action.Shift, nextState: 58 }, { action: Action.Shift, nextState: 55 }, { action: Action.Shift, nextState: 60 }, null, { action: Action.Shift, nextState: 96 }, { action: Action.Shift, nextState: 61 }, null, { action: Action.Shift, nextState: 62 }, { action: Action.Shift, nextState: 63 }, null, { action: Action.Shift, nextState: 56 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 70 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 97 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 71 */ [null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 98 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 72 */ [null, null, null, { action: Action.Shift, nextState: 59 }, { action: Action.Shift, nextState: 57 }, null, { action: Action.Shift, nextState: 58 }, { action: Action.Shift, nextState: 55 }, { action: Action.Shift, nextState: 60 }, null, null, { action: Action.Shift, nextState: 61 }, null, { action: Action.Shift, nextState: 62 }, { action: Action.Shift, nextState: 63 }, null, { action: Action.Shift, nextState: 56 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 99 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 73 */ [null, null, { action: Action.Reduce, productionIndex: 38 }, { action: Action.Reduce, productionIndex: 38 }, { action: Action.Reduce, productionIndex: 38 }, { action: Action.Reduce, productionIndex: 38 }, { action: Action.Reduce, productionIndex: 38 }, { action: Action.Reduce, productionIndex: 38 }, { action: Action.Reduce, productionIndex: 38 }, null, { action: Action.Reduce, productionIndex: 38 }, { action: Action.Reduce, productionIndex: 38 }, null, { action: Action.Reduce, productionIndex: 38 }, { action: Action.Reduce, productionIndex: 38 }, null, { action: Action.Reduce, productionIndex: 38 }, null, null, { action: Action.Reduce, productionIndex: 38 }, null, null, { action: Action.Reduce, productionIndex: 38 }, null, { action: Action.Reduce, productionIndex: 38 }, null, null, null, null, { action: Action.Reduce, productionIndex: 38 }, null, null, null, { action: Action.Reduce, productionIndex: 38 }, { action: Action.Reduce, productionIndex: 38 }, null, { action: Action.Reduce, productionIndex: 38 }, null, null, null, null, { action: Action.Reduce, productionIndex: 38 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 74 */ [null, null, { action: Action.Reduce, productionIndex: 39 }, { action: Action.Reduce, productionIndex: 39 }, { action: Action.Reduce, productionIndex: 39 }, { action: Action.Reduce, productionIndex: 39 }, { action: Action.Reduce, productionIndex: 39 }, { action: Action.Shift, nextState: 55 }, { action: Action.Reduce, productionIndex: 39 }, null, { action: Action.Reduce, productionIndex: 39 }, { action: Action.Reduce, productionIndex: 39 }, null, { action: Action.Reduce, productionIndex: 39 }, { action: Action.Reduce, productionIndex: 39 }, null, { action: Action.Shift, nextState: 56 }, null, null, { action: Action.Reduce, productionIndex: 39 }, null, null, { action: Action.Reduce, productionIndex: 39 }, null, { action: Action.Reduce, productionIndex: 39 }, null, null, null, null, { action: Action.Reduce, productionIndex: 39 }, null, null, null, { action: Action.Reduce, productionIndex: 39 }, { action: Action.Reduce, productionIndex: 39 }, null, { action: Action.Reduce, productionIndex: 39 }, null, null, null, null, { action: Action.Reduce, productionIndex: 39 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 75 */ [null, null, { action: Action.Reduce, productionIndex: 44 }, { action: Action.Reduce, productionIndex: 44 }, { action: Action.Reduce, productionIndex: 44 }, { action: Action.Reduce, productionIndex: 44 }, { action: Action.Reduce, productionIndex: 44 }, { action: Action.Shift, nextState: 55 }, { action: Action.Reduce, productionIndex: 44 }, null, { action: Action.Reduce, productionIndex: 44 }, { action: Action.Reduce, productionIndex: 44 }, null, { action: Action.Reduce, productionIndex: 44 }, { action: Action.Reduce, productionIndex: 44 }, null, { action: Action.Shift, nextState: 56 }, null, null, { action: Action.Reduce, productionIndex: 44 }, null, null, { action: Action.Reduce, productionIndex: 44 }, null, { action: Action.Reduce, productionIndex: 44 }, null, null, null, null, { action: Action.Reduce, productionIndex: 44 }, null, null, null, { action: Action.Reduce, productionIndex: 44 }, { action: Action.Reduce, productionIndex: 44 }, null, { action: Action.Reduce, productionIndex: 44 }, null, null, null, null, { action: Action.Reduce, productionIndex: 44 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 76 */ [null, null, { action: Action.Reduce, productionIndex: 48 }, { action: Action.Shift, nextState: 59 }, { action: Action.Shift, nextState: 57 }, { action: Action.Reduce, productionIndex: 48 }, { action: Action.Shift, nextState: 58 }, { action: Action.Shift, nextState: 55 }, { action: Action.Shift, nextState: 60 }, null, { action: Action.Reduce, productionIndex: 48 }, { action: Action.Shift, nextState: 61 }, null, { action: Action.Shift, nextState: 62 }, { action: Action.Shift, nextState: 63 }, null, { action: Action.Shift, nextState: 56 }, null, null, { action: Action.Reduce, productionIndex: 48 }, null, null, { action: Action.Reduce, productionIndex: 48 }, null, { action: Action.Reduce, productionIndex: 48 }, null, null, null, null, { action: Action.Reduce, productionIndex: 48 }, null, null, null, { action: Action.Reduce, productionIndex: 48 }, { action: Action.Reduce, productionIndex: 48 }, null, { action: Action.Reduce, productionIndex: 48 }, null, null, null, null, { action: Action.Reduce, productionIndex: 48 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 77 */ [null, null, { action: Action.Shift, nextState: 100 }, { action: Action.Shift, nextState: 59 }, { action: Action.Shift, nextState: 57 }, null, { action: Action.Shift, nextState: 58 }, { action: Action.Shift, nextState: 55 }, { action: Action.Shift, nextState: 60 }, null, null, { action: Action.Shift, nextState: 61 }, null, { action: Action.Shift, nextState: 62 }, { action: Action.Shift, nextState: 63 }, null, { action: Action.Shift, nextState: 56 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 78 */ [null, { action: Action.Shift, nextState: 48 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 43 }, null, null, null, { action: Action.Shift, nextState: 52 }, null, { action: Action.Shift, nextState: 39 }, null, null, { action: Action.Shift, nextState: 49 }, { action: Action.Shift, nextState: 45 }, { action: Action.Shift, nextState: 42 }, null, { action: Action.Shift, nextState: 44 }, { action: Action.Shift, nextState: 47 }, { action: Action.Shift, nextState: 38 }, null, null, { action: Action.Shift, nextState: 50 }, null, { action: Action.Shift, nextState: 51 }, null, { action: Action.Shift, nextState: 40 }, { action: Action.Shift, nextState: 41 }, null, { action: Action.Shift, nextState: 46 }, null, null, { action: Action.None, nextState: 101 }, null, null, null, null, null, null, null, null],
        /* state 79 */ [null, null, null, { action: Action.Shift, nextState: 59 }, { action: Action.Shift, nextState: 57 }, null, { action: Action.Shift, nextState: 58 }, { action: Action.Shift, nextState: 55 }, { action: Action.Shift, nextState: 60 }, null, null, { action: Action.Shift, nextState: 61 }, null, { action: Action.Shift, nextState: 62 }, { action: Action.Shift, nextState: 63 }, null, { action: Action.Shift, nextState: 56 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 102 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 80 */ [null, { action: Action.Shift, nextState: 103 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 81 */ [null, null, null, null, null, null, null, { action: Action.Shift, nextState: 104 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 82 */ [null, null, { action: Action.Reduce, productionIndex: 40 }, { action: Action.Shift, nextState: 59 }, { action: Action.Reduce, productionIndex: 40 }, { action: Action.Reduce, productionIndex: 40 }, { action: Action.Reduce, productionIndex: 40 }, { action: Action.Shift, nextState: 55 }, { action: Action.Shift, nextState: 60 }, null, { action: Action.Reduce, productionIndex: 40 }, { action: Action.Reduce, productionIndex: 40 }, null, { action: Action.Reduce, productionIndex: 40 }, { action: Action.Reduce, productionIndex: 40 }, null, { action: Action.Shift, nextState: 56 }, null, null, { action: Action.Reduce, productionIndex: 40 }, null, null, { action: Action.Reduce, productionIndex: 40 }, null, { action: Action.Reduce, productionIndex: 40 }, null, null, null, null, { action: Action.Reduce, productionIndex: 40 }, null, null, null, { action: Action.Reduce, productionIndex: 40 }, { action: Action.Reduce, productionIndex: 40 }, null, { action: Action.Reduce, productionIndex: 40 }, null, null, null, null, { action: Action.Reduce, productionIndex: 40 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 83 */ [null, null, { action: Action.Reduce, productionIndex: 41 }, { action: Action.Shift, nextState: 59 }, { action: Action.Reduce, productionIndex: 41 }, { action: Action.Reduce, productionIndex: 41 }, { action: Action.Reduce, productionIndex: 41 }, { action: Action.Shift, nextState: 55 }, { action: Action.Shift, nextState: 60 }, null, { action: Action.Reduce, productionIndex: 41 }, { action: Action.Reduce, productionIndex: 41 }, null, { action: Action.Reduce, productionIndex: 41 }, { action: Action.Reduce, productionIndex: 41 }, null, { action: Action.Shift, nextState: 56 }, null, null, { action: Action.Reduce, productionIndex: 41 }, null, null, { action: Action.Reduce, productionIndex: 41 }, null, { action: Action.Reduce, productionIndex: 41 }, null, null, null, null, { action: Action.Reduce, productionIndex: 41 }, null, null, null, { action: Action.Reduce, productionIndex: 41 }, { action: Action.Reduce, productionIndex: 41 }, null, { action: Action.Reduce, productionIndex: 41 }, null, null, null, null, { action: Action.Reduce, productionIndex: 41 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 84 */ [null, null, { action: Action.Reduce, productionIndex: 42 }, { action: Action.Reduce, productionIndex: 42 }, { action: Action.Reduce, productionIndex: 42 }, { action: Action.Reduce, productionIndex: 42 }, { action: Action.Reduce, productionIndex: 42 }, { action: Action.Shift, nextState: 55 }, { action: Action.Reduce, productionIndex: 42 }, null, { action: Action.Reduce, productionIndex: 42 }, { action: Action.Reduce, productionIndex: 42 }, null, { action: Action.Reduce, productionIndex: 42 }, { action: Action.Reduce, productionIndex: 42 }, null, { action: Action.Shift, nextState: 56 }, null, null, { action: Action.Reduce, productionIndex: 42 }, null, null, { action: Action.Reduce, productionIndex: 42 }, null, { action: Action.Reduce, productionIndex: 42 }, null, null, null, null, { action: Action.Reduce, productionIndex: 42 }, null, null, null, { action: Action.Reduce, productionIndex: 42 }, { action: Action.Reduce, productionIndex: 42 }, null, { action: Action.Reduce, productionIndex: 42 }, null, null, null, null, { action: Action.Reduce, productionIndex: 42 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 85 */ [null, null, { action: Action.Reduce, productionIndex: 43 }, { action: Action.Reduce, productionIndex: 43 }, { action: Action.Reduce, productionIndex: 43 }, { action: Action.Reduce, productionIndex: 43 }, { action: Action.Reduce, productionIndex: 43 }, { action: Action.Shift, nextState: 55 }, { action: Action.Reduce, productionIndex: 43 }, null, { action: Action.Reduce, productionIndex: 43 }, { action: Action.Reduce, productionIndex: 43 }, null, { action: Action.Reduce, productionIndex: 43 }, { action: Action.Reduce, productionIndex: 43 }, null, { action: Action.Shift, nextState: 56 }, null, null, { action: Action.Reduce, productionIndex: 43 }, null, null, { action: Action.Reduce, productionIndex: 43 }, null, { action: Action.Reduce, productionIndex: 43 }, null, null, null, null, { action: Action.Reduce, productionIndex: 43 }, null, null, null, { action: Action.Reduce, productionIndex: 43 }, { action: Action.Reduce, productionIndex: 43 }, null, { action: Action.Reduce, productionIndex: 43 }, null, null, null, null, { action: Action.Reduce, productionIndex: 43 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 86 */ [null, null, { action: Action.Reduce, productionIndex: 45 }, { action: Action.Shift, nextState: 59 }, { action: Action.Shift, nextState: 57 }, { action: Action.Reduce, productionIndex: 45 }, { action: Action.Shift, nextState: 58 }, { action: Action.Shift, nextState: 55 }, { action: Action.Shift, nextState: 60 }, null, { action: Action.Reduce, productionIndex: 45 }, { action: Action.Reduce, productionIndex: 45 }, null, { action: Action.Reduce, productionIndex: 45 }, { action: Action.Reduce, productionIndex: 45 }, null, { action: Action.Shift, nextState: 56 }, null, null, { action: Action.Reduce, productionIndex: 45 }, null, null, { action: Action.Reduce, productionIndex: 45 }, null, { action: Action.Reduce, productionIndex: 45 }, null, null, null, null, { action: Action.Reduce, productionIndex: 45 }, null, null, null, { action: Action.Reduce, productionIndex: 45 }, { action: Action.Reduce, productionIndex: 45 }, null, { action: Action.Reduce, productionIndex: 45 }, null, null, null, null, { action: Action.Reduce, productionIndex: 45 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 87 */ [null, null, { action: Action.Reduce, productionIndex: 46 }, { action: Action.Shift, nextState: 59 }, { action: Action.Shift, nextState: 57 }, { action: Action.Reduce, productionIndex: 46 }, { action: Action.Shift, nextState: 58 }, { action: Action.Shift, nextState: 55 }, { action: Action.Shift, nextState: 60 }, null, { action: Action.Reduce, productionIndex: 46 }, { action: Action.Reduce, productionIndex: 46 }, null, { action: Action.Reduce, productionIndex: 46 }, { action: Action.Reduce, productionIndex: 46 }, null, { action: Action.Shift, nextState: 56 }, null, null, { action: Action.Reduce, productionIndex: 46 }, null, null, { action: Action.Reduce, productionIndex: 46 }, null, { action: Action.Reduce, productionIndex: 46 }, null, null, null, null, { action: Action.Reduce, productionIndex: 46 }, null, null, null, { action: Action.Reduce, productionIndex: 46 }, { action: Action.Reduce, productionIndex: 46 }, null, { action: Action.Reduce, productionIndex: 46 }, null, null, null, null, { action: Action.Reduce, productionIndex: 46 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 88 */ [null, null, { action: Action.Reduce, productionIndex: 47 }, { action: Action.Shift, nextState: 59 }, { action: Action.Shift, nextState: 57 }, { action: Action.Reduce, productionIndex: 47 }, { action: Action.Shift, nextState: 58 }, { action: Action.Shift, nextState: 55 }, { action: Action.Shift, nextState: 60 }, null, { action: Action.Reduce, productionIndex: 47 }, { action: Action.Reduce, productionIndex: 47 }, null, { action: Action.Reduce, productionIndex: 47 }, { action: Action.Reduce, productionIndex: 47 }, null, { action: Action.Shift, nextState: 56 }, null, null, { action: Action.Reduce, productionIndex: 47 }, null, null, { action: Action.Reduce, productionIndex: 47 }, null, { action: Action.Reduce, productionIndex: 47 }, null, null, null, null, { action: Action.Reduce, productionIndex: 47 }, null, null, null, { action: Action.Reduce, productionIndex: 47 }, { action: Action.Reduce, productionIndex: 47 }, null, { action: Action.Reduce, productionIndex: 47 }, null, null, null, null, { action: Action.Reduce, productionIndex: 47 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 89 */ [null, null, { action: Action.Reduce, productionIndex: 26 }, { action: Action.Shift, nextState: 59 }, { action: Action.Shift, nextState: 57 }, { action: Action.Reduce, productionIndex: 26 }, { action: Action.Shift, nextState: 58 }, { action: Action.Shift, nextState: 55 }, { action: Action.Shift, nextState: 60 }, null, { action: Action.Reduce, productionIndex: 26 }, { action: Action.Shift, nextState: 61 }, null, { action: Action.Shift, nextState: 62 }, { action: Action.Shift, nextState: 63 }, null, { action: Action.Shift, nextState: 56 }, null, null, { action: Action.Reduce, productionIndex: 26 }, null, null, { action: Action.Reduce, productionIndex: 26 }, null, { action: Action.Reduce, productionIndex: 26 }, null, null, null, null, { action: Action.Reduce, productionIndex: 26 }, null, null, null, { action: Action.Reduce, productionIndex: 26 }, { action: Action.Reduce, productionIndex: 26 }, null, { action: Action.Reduce, productionIndex: 26 }, null, null, null, null, { action: Action.Reduce, productionIndex: 26 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 90 */ [null, null, { action: Action.Reduce, productionIndex: 31 }, { action: Action.Reduce, productionIndex: 31 }, { action: Action.Reduce, productionIndex: 31 }, { action: Action.Reduce, productionIndex: 31 }, { action: Action.Reduce, productionIndex: 31 }, { action: Action.Reduce, productionIndex: 31 }, { action: Action.Reduce, productionIndex: 31 }, null, { action: Action.Reduce, productionIndex: 31 }, { action: Action.Reduce, productionIndex: 31 }, null, { action: Action.Reduce, productionIndex: 31 }, { action: Action.Reduce, productionIndex: 31 }, null, { action: Action.Reduce, productionIndex: 31 }, null, null, { action: Action.Reduce, productionIndex: 31 }, null, null, { action: Action.Reduce, productionIndex: 31 }, null, { action: Action.Reduce, productionIndex: 31 }, null, null, null, null, { action: Action.Reduce, productionIndex: 31 }, null, null, null, { action: Action.Reduce, productionIndex: 31 }, { action: Action.Reduce, productionIndex: 31 }, null, { action: Action.Reduce, productionIndex: 31 }, null, null, null, null, { action: Action.Reduce, productionIndex: 31 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 91 */ [null, null, { action: Action.Shift, nextState: 105 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 92 */ [null, null, { action: Action.Reduce, productionIndex: 16 }, { action: Action.Shift, nextState: 59 }, { action: Action.Shift, nextState: 57 }, { action: Action.Shift, nextState: 106 }, { action: Action.Shift, nextState: 58 }, { action: Action.Shift, nextState: 55 }, { action: Action.Shift, nextState: 60 }, null, null, { action: Action.Shift, nextState: 61 }, null, { action: Action.Shift, nextState: 62 }, { action: Action.Shift, nextState: 63 }, null, { action: Action.Shift, nextState: 56 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 93 */ [null, { action: Action.Shift, nextState: 48 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 43 }, null, null, null, { action: Action.Shift, nextState: 52 }, null, { action: Action.Shift, nextState: 39 }, null, null, { action: Action.Shift, nextState: 49 }, { action: Action.Shift, nextState: 45 }, { action: Action.Shift, nextState: 42 }, null, { action: Action.Shift, nextState: 44 }, { action: Action.Shift, nextState: 47 }, { action: Action.Shift, nextState: 38 }, null, null, { action: Action.Shift, nextState: 50 }, null, { action: Action.Shift, nextState: 51 }, null, { action: Action.Shift, nextState: 40 }, { action: Action.Shift, nextState: 41 }, null, { action: Action.Shift, nextState: 46 }, null, null, { action: Action.None, nextState: 107 }, null, null, null, null, null, null, null, null],
        /* state 94 */ [null, { action: Action.Shift, nextState: 48 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 43 }, null, null, null, { action: Action.Shift, nextState: 52 }, null, { action: Action.Shift, nextState: 39 }, null, null, { action: Action.Shift, nextState: 49 }, { action: Action.Shift, nextState: 45 }, { action: Action.Shift, nextState: 42 }, null, { action: Action.Shift, nextState: 44 }, { action: Action.Shift, nextState: 47 }, { action: Action.Shift, nextState: 38 }, null, null, { action: Action.Shift, nextState: 50 }, null, { action: Action.Shift, nextState: 51 }, null, { action: Action.Shift, nextState: 40 }, { action: Action.Shift, nextState: 41 }, null, { action: Action.Shift, nextState: 46 }, null, null, { action: Action.None, nextState: 108 }, null, null, null, null, null, null, null, null],
        /* state 95 */ [null, null, { action: Action.Reduce, productionIndex: 35 }, { action: Action.Reduce, productionIndex: 35 }, { action: Action.Reduce, productionIndex: 35 }, { action: Action.Reduce, productionIndex: 35 }, { action: Action.Reduce, productionIndex: 35 }, { action: Action.Reduce, productionIndex: 35 }, { action: Action.Reduce, productionIndex: 35 }, null, { action: Action.Reduce, productionIndex: 35 }, { action: Action.Reduce, productionIndex: 35 }, null, { action: Action.Reduce, productionIndex: 35 }, { action: Action.Reduce, productionIndex: 35 }, null, { action: Action.Reduce, productionIndex: 35 }, null, null, { action: Action.Reduce, productionIndex: 35 }, null, null, { action: Action.Reduce, productionIndex: 35 }, null, { action: Action.Reduce, productionIndex: 35 }, null, null, null, null, { action: Action.Reduce, productionIndex: 35 }, null, null, null, { action: Action.Reduce, productionIndex: 35 }, { action: Action.Reduce, productionIndex: 35 }, null, { action: Action.Reduce, productionIndex: 35 }, null, null, null, null, { action: Action.Reduce, productionIndex: 35 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 96 */ [null, { action: Action.Shift, nextState: 48 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 43 }, null, null, null, { action: Action.Shift, nextState: 52 }, null, { action: Action.Shift, nextState: 39 }, null, null, { action: Action.Shift, nextState: 49 }, { action: Action.Shift, nextState: 45 }, { action: Action.Shift, nextState: 42 }, null, { action: Action.Shift, nextState: 44 }, { action: Action.Shift, nextState: 47 }, { action: Action.Shift, nextState: 38 }, null, null, { action: Action.Shift, nextState: 50 }, null, { action: Action.Shift, nextState: 51 }, null, { action: Action.Shift, nextState: 40 }, { action: Action.Shift, nextState: 41 }, { action: Action.Reduce, productionIndex: 18 }, { action: Action.Shift, nextState: 46 }, null, null, { action: Action.None, nextState: 69 }, null, { action: Action.None, nextState: 109 }, null, null, null, null, null, null],
        /* state 97 */ [null, { action: Action.Shift, nextState: 48 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 43 }, null, null, null, { action: Action.Shift, nextState: 52 }, null, { action: Action.Shift, nextState: 39 }, null, null, { action: Action.Shift, nextState: 49 }, { action: Action.Shift, nextState: 45 }, { action: Action.Shift, nextState: 42 }, null, { action: Action.Shift, nextState: 44 }, { action: Action.Shift, nextState: 47 }, { action: Action.Shift, nextState: 38 }, null, null, { action: Action.Shift, nextState: 50 }, null, { action: Action.Shift, nextState: 51 }, null, { action: Action.Shift, nextState: 40 }, { action: Action.Shift, nextState: 41 }, null, { action: Action.Shift, nextState: 46 }, null, null, { action: Action.None, nextState: 110 }, null, null, null, null, null, null, null, null],
        /* state 98 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 111 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 99 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 113 }, null, null, null, null, null, null, null, null, null, null, { action: Action.None, nextState: 112 }, null, null, null, null, null, null, null, null, null, null],
        /* state 100 */ [null, null, { action: Action.Reduce, productionIndex: 49 }, { action: Action.Reduce, productionIndex: 49 }, { action: Action.Reduce, productionIndex: 49 }, { action: Action.Reduce, productionIndex: 49 }, { action: Action.Reduce, productionIndex: 49 }, { action: Action.Reduce, productionIndex: 49 }, { action: Action.Reduce, productionIndex: 49 }, null, { action: Action.Reduce, productionIndex: 49 }, { action: Action.Reduce, productionIndex: 49 }, null, { action: Action.Reduce, productionIndex: 49 }, { action: Action.Reduce, productionIndex: 49 }, null, { action: Action.Reduce, productionIndex: 49 }, null, null, { action: Action.Reduce, productionIndex: 49 }, null, null, { action: Action.Reduce, productionIndex: 49 }, null, { action: Action.Reduce, productionIndex: 49 }, null, null, null, null, { action: Action.Reduce, productionIndex: 49 }, null, null, null, { action: Action.Reduce, productionIndex: 49 }, { action: Action.Reduce, productionIndex: 49 }, null, { action: Action.Reduce, productionIndex: 49 }, null, null, null, null, { action: Action.Reduce, productionIndex: 49 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 101 */ [null, null, null, { action: Action.Shift, nextState: 59 }, { action: Action.Shift, nextState: 57 }, null, { action: Action.Shift, nextState: 58 }, { action: Action.Shift, nextState: 55 }, { action: Action.Shift, nextState: 60 }, null, null, { action: Action.Shift, nextState: 61 }, null, { action: Action.Shift, nextState: 62 }, { action: Action.Shift, nextState: 63 }, null, { action: Action.Shift, nextState: 56 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 114 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 102 */ [null, null, null, null, null, null, null, null, null, null, { action: Action.Reduce, productionIndex: 12 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 103 */ [null, { action: Action.Shift, nextState: 48 }, { action: Action.Shift, nextState: 115 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 43 }, null, null, null, { action: Action.Shift, nextState: 52 }, null, { action: Action.Shift, nextState: 39 }, null, null, { action: Action.Shift, nextState: 49 }, { action: Action.Shift, nextState: 45 }, { action: Action.Shift, nextState: 42 }, null, { action: Action.Shift, nextState: 44 }, { action: Action.Shift, nextState: 47 }, { action: Action.Shift, nextState: 38 }, null, null, { action: Action.Shift, nextState: 50 }, null, { action: Action.Shift, nextState: 51 }, null, { action: Action.Shift, nextState: 40 }, { action: Action.Shift, nextState: 41 }, null, { action: Action.Shift, nextState: 46 }, null, null, { action: Action.None, nextState: 92 }, { action: Action.None, nextState: 116 }, null, null, null, null, null, null, null],
        /* state 104 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 117 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 105 */ [null, null, { action: Action.Reduce, productionIndex: 32 }, { action: Action.Reduce, productionIndex: 32 }, { action: Action.Reduce, productionIndex: 32 }, { action: Action.Reduce, productionIndex: 32 }, { action: Action.Reduce, productionIndex: 32 }, { action: Action.Reduce, productionIndex: 32 }, { action: Action.Reduce, productionIndex: 32 }, null, { action: Action.Reduce, productionIndex: 32 }, { action: Action.Reduce, productionIndex: 32 }, null, { action: Action.Reduce, productionIndex: 32 }, { action: Action.Reduce, productionIndex: 32 }, null, { action: Action.Reduce, productionIndex: 32 }, null, null, { action: Action.Reduce, productionIndex: 32 }, null, null, { action: Action.Reduce, productionIndex: 32 }, null, { action: Action.Reduce, productionIndex: 32 }, null, null, null, null, { action: Action.Reduce, productionIndex: 32 }, null, null, null, { action: Action.Reduce, productionIndex: 32 }, { action: Action.Reduce, productionIndex: 32 }, null, { action: Action.Reduce, productionIndex: 32 }, null, null, null, null, { action: Action.Reduce, productionIndex: 32 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 106 */ [null, { action: Action.Shift, nextState: 48 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 43 }, null, null, null, { action: Action.Shift, nextState: 52 }, null, { action: Action.Shift, nextState: 39 }, null, null, { action: Action.Shift, nextState: 49 }, { action: Action.Shift, nextState: 45 }, { action: Action.Shift, nextState: 42 }, null, { action: Action.Shift, nextState: 44 }, { action: Action.Shift, nextState: 47 }, { action: Action.Shift, nextState: 38 }, null, null, { action: Action.Shift, nextState: 50 }, null, { action: Action.Shift, nextState: 51 }, null, { action: Action.Shift, nextState: 40 }, { action: Action.Shift, nextState: 41 }, null, { action: Action.Shift, nextState: 46 }, null, null, { action: Action.None, nextState: 92 }, { action: Action.None, nextState: 118 }, null, null, null, null, null, null, null],
        /* state 107 */ [null, null, null, { action: Action.Shift, nextState: 59 }, { action: Action.Shift, nextState: 57 }, null, { action: Action.Shift, nextState: 58 }, { action: Action.Shift, nextState: 55 }, { action: Action.Shift, nextState: 60 }, null, null, { action: Action.Shift, nextState: 61 }, null, { action: Action.Shift, nextState: 62 }, { action: Action.Shift, nextState: 63 }, null, { action: Action.Shift, nextState: 56 }, null, null, { action: Action.Shift, nextState: 119 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 108 */ [null, null, null, { action: Action.Shift, nextState: 59 }, { action: Action.Shift, nextState: 57 }, null, { action: Action.Shift, nextState: 58 }, { action: Action.Shift, nextState: 55 }, { action: Action.Shift, nextState: 60 }, null, null, { action: Action.Shift, nextState: 61 }, null, { action: Action.Shift, nextState: 62 }, { action: Action.Shift, nextState: 63 }, null, { action: Action.Shift, nextState: 56 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 120 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 109 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Reduce, productionIndex: 19 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 110 */ [null, null, { action: Action.Reduce, productionIndex: 36 }, [{ action: Action.Shift, nextState: 59 }, { action: Action.Reduce, productionIndex: 36 }], [{ action: Action.Shift, nextState: 57 }, { action: Action.Reduce, productionIndex: 36 }], { action: Action.Reduce, productionIndex: 36 }, [{ action: Action.Shift, nextState: 58 }, { action: Action.Reduce, productionIndex: 36 }], [{ action: Action.Shift, nextState: 55 }, { action: Action.Reduce, productionIndex: 36 }], [{ action: Action.Shift, nextState: 60 }, { action: Action.Reduce, productionIndex: 36 }], null, { action: Action.Reduce, productionIndex: 36 }, [{ action: Action.Shift, nextState: 61 }, { action: Action.Reduce, productionIndex: 36 }], null, [{ action: Action.Shift, nextState: 62 }, { action: Action.Reduce, productionIndex: 36 }], [{ action: Action.Shift, nextState: 63 }, { action: Action.Reduce, productionIndex: 36 }], null, [{ action: Action.Shift, nextState: 56 }, { action: Action.Reduce, productionIndex: 36 }], null, null, { action: Action.Reduce, productionIndex: 36 }, null, null, { action: Action.Reduce, productionIndex: 36 }, null, { action: Action.Reduce, productionIndex: 36 }, null, null, null, null, { action: Action.Reduce, productionIndex: 36 }, null, null, null, { action: Action.Reduce, productionIndex: 36 }, { action: Action.Reduce, productionIndex: 36 }, null, { action: Action.Reduce, productionIndex: 36 }, null, null, null, null, { action: Action.Reduce, productionIndex: 36 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 111 */ [null, null, null, null, null, { action: Action.Shift, nextState: 122 }, null, null, null, null, null, null, { action: Action.Shift, nextState: 121 }, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Reduce, productionIndex: 20 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 112 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 123 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 113 */ [null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 124 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 114 */ [null, null, null, null, null, null, null, null, null, null, { action: Action.Reduce, productionIndex: 11 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 115 */ [null, null, { action: Action.Reduce, productionIndex: 27 }, { action: Action.Reduce, productionIndex: 27 }, { action: Action.Reduce, productionIndex: 27 }, { action: Action.Reduce, productionIndex: 27 }, { action: Action.Reduce, productionIndex: 27 }, { action: Action.Reduce, productionIndex: 27 }, { action: Action.Reduce, productionIndex: 27 }, null, { action: Action.Reduce, productionIndex: 27 }, { action: Action.Reduce, productionIndex: 27 }, null, { action: Action.Reduce, productionIndex: 27 }, { action: Action.Reduce, productionIndex: 27 }, null, { action: Action.Reduce, productionIndex: 27 }, null, null, { action: Action.Reduce, productionIndex: 27 }, null, null, { action: Action.Reduce, productionIndex: 27 }, null, { action: Action.Reduce, productionIndex: 27 }, null, null, null, null, { action: Action.Reduce, productionIndex: 27 }, null, null, null, { action: Action.Reduce, productionIndex: 27 }, { action: Action.Reduce, productionIndex: 27 }, null, { action: Action.Reduce, productionIndex: 27 }, null, null, null, null, { action: Action.Reduce, productionIndex: 27 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 116 */ [null, null, { action: Action.Shift, nextState: 125 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 117 */ [null, { action: Action.Shift, nextState: 126 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 118 */ [null, null, { action: Action.Reduce, productionIndex: 17 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 119 */ [null, { action: Action.Shift, nextState: 48 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 43 }, null, null, null, { action: Action.Shift, nextState: 52 }, null, { action: Action.Shift, nextState: 39 }, null, null, { action: Action.Shift, nextState: 49 }, { action: Action.Shift, nextState: 45 }, { action: Action.Shift, nextState: 42 }, null, { action: Action.Shift, nextState: 44 }, { action: Action.Shift, nextState: 47 }, { action: Action.Shift, nextState: 38 }, null, null, { action: Action.Shift, nextState: 50 }, null, { action: Action.Shift, nextState: 51 }, null, { action: Action.Shift, nextState: 40 }, { action: Action.Shift, nextState: 41 }, null, { action: Action.Shift, nextState: 46 }, null, null, { action: Action.None, nextState: 127 }, null, null, null, null, null, null, null, null],
        /* state 120 */ [null, null, { action: Action.Reduce, productionIndex: 34 }, { action: Action.Reduce, productionIndex: 34 }, { action: Action.Reduce, productionIndex: 34 }, { action: Action.Reduce, productionIndex: 34 }, { action: Action.Reduce, productionIndex: 34 }, { action: Action.Reduce, productionIndex: 34 }, { action: Action.Reduce, productionIndex: 34 }, null, { action: Action.Reduce, productionIndex: 34 }, { action: Action.Reduce, productionIndex: 34 }, null, { action: Action.Reduce, productionIndex: 34 }, { action: Action.Reduce, productionIndex: 34 }, null, { action: Action.Reduce, productionIndex: 34 }, null, null, { action: Action.Reduce, productionIndex: 34 }, null, null, { action: Action.Reduce, productionIndex: 34 }, null, { action: Action.Reduce, productionIndex: 34 }, null, null, null, null, { action: Action.Reduce, productionIndex: 34 }, null, null, null, { action: Action.Reduce, productionIndex: 34 }, { action: Action.Reduce, productionIndex: 34 }, null, { action: Action.Reduce, productionIndex: 34 }, null, null, null, null, { action: Action.Reduce, productionIndex: 34 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 121 */ [null, { action: Action.Shift, nextState: 48 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 43 }, null, null, null, { action: Action.Shift, nextState: 52 }, null, { action: Action.Shift, nextState: 39 }, null, null, { action: Action.Shift, nextState: 49 }, { action: Action.Shift, nextState: 45 }, { action: Action.Shift, nextState: 42 }, null, { action: Action.Shift, nextState: 44 }, { action: Action.Shift, nextState: 47 }, { action: Action.Shift, nextState: 38 }, null, null, { action: Action.Shift, nextState: 50 }, null, { action: Action.Shift, nextState: 51 }, null, { action: Action.Shift, nextState: 40 }, { action: Action.Shift, nextState: 41 }, null, { action: Action.Shift, nextState: 46 }, null, null, { action: Action.None, nextState: 128 }, null, null, null, null, null, null, null, null],
        /* state 122 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 71 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.None, nextState: 129 }, null],
        /* state 123 */ [null, null, { action: Action.Reduce, productionIndex: 37 }, { action: Action.Reduce, productionIndex: 37 }, { action: Action.Reduce, productionIndex: 37 }, { action: Action.Reduce, productionIndex: 37 }, { action: Action.Reduce, productionIndex: 37 }, { action: Action.Reduce, productionIndex: 37 }, { action: Action.Reduce, productionIndex: 37 }, null, { action: Action.Reduce, productionIndex: 37 }, { action: Action.Reduce, productionIndex: 37 }, null, { action: Action.Reduce, productionIndex: 37 }, { action: Action.Reduce, productionIndex: 37 }, null, { action: Action.Reduce, productionIndex: 37 }, null, null, { action: Action.Reduce, productionIndex: 37 }, null, null, { action: Action.Reduce, productionIndex: 37 }, null, { action: Action.Reduce, productionIndex: 37 }, null, null, null, null, { action: Action.Reduce, productionIndex: 37 }, null, null, null, { action: Action.Reduce, productionIndex: 37 }, { action: Action.Reduce, productionIndex: 37 }, null, { action: Action.Reduce, productionIndex: 37 }, null, null, null, null, { action: Action.Reduce, productionIndex: 37 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 124 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 130 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 125 */ [null, null, { action: Action.Reduce, productionIndex: 28 }, { action: Action.Reduce, productionIndex: 28 }, { action: Action.Reduce, productionIndex: 28 }, { action: Action.Reduce, productionIndex: 28 }, { action: Action.Reduce, productionIndex: 28 }, { action: Action.Reduce, productionIndex: 28 }, { action: Action.Reduce, productionIndex: 28 }, null, { action: Action.Reduce, productionIndex: 28 }, { action: Action.Reduce, productionIndex: 28 }, null, { action: Action.Reduce, productionIndex: 28 }, { action: Action.Reduce, productionIndex: 28 }, null, { action: Action.Reduce, productionIndex: 28 }, null, null, { action: Action.Reduce, productionIndex: 28 }, null, null, { action: Action.Reduce, productionIndex: 28 }, null, { action: Action.Reduce, productionIndex: 28 }, null, null, null, null, { action: Action.Reduce, productionIndex: 28 }, null, null, null, { action: Action.Reduce, productionIndex: 28 }, { action: Action.Reduce, productionIndex: 28 }, null, { action: Action.Reduce, productionIndex: 28 }, null, null, null, null, { action: Action.Reduce, productionIndex: 28 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 126 */ [null, { action: Action.Shift, nextState: 48 }, { action: Action.Shift, nextState: 131 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 43 }, null, null, null, { action: Action.Shift, nextState: 52 }, null, { action: Action.Shift, nextState: 39 }, null, null, { action: Action.Shift, nextState: 49 }, { action: Action.Shift, nextState: 45 }, { action: Action.Shift, nextState: 42 }, null, { action: Action.Shift, nextState: 44 }, { action: Action.Shift, nextState: 47 }, { action: Action.Shift, nextState: 38 }, null, null, { action: Action.Shift, nextState: 50 }, null, { action: Action.Shift, nextState: 51 }, null, { action: Action.Shift, nextState: 40 }, { action: Action.Shift, nextState: 41 }, null, { action: Action.Shift, nextState: 46 }, null, null, { action: Action.None, nextState: 92 }, { action: Action.None, nextState: 132 }, null, null, null, null, null, null, null],
        /* state 127 */ [null, null, null, { action: Action.Shift, nextState: 59 }, { action: Action.Shift, nextState: 57 }, null, { action: Action.Shift, nextState: 58 }, { action: Action.Shift, nextState: 55 }, { action: Action.Shift, nextState: 60 }, null, null, { action: Action.Shift, nextState: 61 }, null, { action: Action.Shift, nextState: 62 }, { action: Action.Shift, nextState: 63 }, null, { action: Action.Shift, nextState: 56 }, null, null, null, null, null, { action: Action.Shift, nextState: 133 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 128 */ [null, null, null, { action: Action.Shift, nextState: 59 }, { action: Action.Shift, nextState: 57 }, { action: Action.Shift, nextState: 134 }, { action: Action.Shift, nextState: 58 }, { action: Action.Shift, nextState: 55 }, { action: Action.Shift, nextState: 60 }, null, null, { action: Action.Shift, nextState: 61 }, null, { action: Action.Shift, nextState: 62 }, { action: Action.Shift, nextState: 63 }, null, { action: Action.Shift, nextState: 56 }, null, null, null, null, null, null, null, { action: Action.Reduce, productionIndex: 21 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 129 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Reduce, productionIndex: 22 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 130 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 135 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 131 */ [null, null, { action: Action.Reduce, productionIndex: 29 }, { action: Action.Reduce, productionIndex: 29 }, { action: Action.Reduce, productionIndex: 29 }, { action: Action.Reduce, productionIndex: 29 }, { action: Action.Reduce, productionIndex: 29 }, { action: Action.Reduce, productionIndex: 29 }, { action: Action.Reduce, productionIndex: 29 }, null, { action: Action.Reduce, productionIndex: 29 }, { action: Action.Reduce, productionIndex: 29 }, null, { action: Action.Reduce, productionIndex: 29 }, { action: Action.Reduce, productionIndex: 29 }, null, { action: Action.Reduce, productionIndex: 29 }, null, null, { action: Action.Reduce, productionIndex: 29 }, null, null, { action: Action.Reduce, productionIndex: 29 }, null, { action: Action.Reduce, productionIndex: 29 }, null, null, null, null, { action: Action.Reduce, productionIndex: 29 }, null, null, null, { action: Action.Reduce, productionIndex: 29 }, { action: Action.Reduce, productionIndex: 29 }, null, { action: Action.Reduce, productionIndex: 29 }, null, null, null, null, { action: Action.Reduce, productionIndex: 29 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 132 */ [null, null, { action: Action.Shift, nextState: 136 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 133 */ [null, null, { action: Action.Reduce, productionIndex: 33 }, { action: Action.Reduce, productionIndex: 33 }, { action: Action.Reduce, productionIndex: 33 }, { action: Action.Reduce, productionIndex: 33 }, { action: Action.Reduce, productionIndex: 33 }, { action: Action.Reduce, productionIndex: 33 }, { action: Action.Reduce, productionIndex: 33 }, null, { action: Action.Reduce, productionIndex: 33 }, { action: Action.Reduce, productionIndex: 33 }, null, { action: Action.Reduce, productionIndex: 33 }, { action: Action.Reduce, productionIndex: 33 }, null, { action: Action.Reduce, productionIndex: 33 }, null, null, { action: Action.Reduce, productionIndex: 33 }, null, null, { action: Action.Reduce, productionIndex: 33 }, null, { action: Action.Reduce, productionIndex: 33 }, null, null, null, null, { action: Action.Reduce, productionIndex: 33 }, null, null, null, { action: Action.Reduce, productionIndex: 33 }, { action: Action.Reduce, productionIndex: 33 }, null, { action: Action.Reduce, productionIndex: 33 }, null, null, null, null, { action: Action.Reduce, productionIndex: 33 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 134 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 71 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.None, nextState: 137 }, null],
        /* state 135 */ [null, { action: Action.Shift, nextState: 48 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 43 }, null, null, null, { action: Action.Shift, nextState: 52 }, null, { action: Action.Shift, nextState: 39 }, null, null, { action: Action.Shift, nextState: 49 }, { action: Action.Shift, nextState: 45 }, { action: Action.Shift, nextState: 42 }, null, { action: Action.Shift, nextState: 44 }, { action: Action.Shift, nextState: 47 }, { action: Action.Shift, nextState: 38 }, null, null, { action: Action.Shift, nextState: 50 }, null, { action: Action.Shift, nextState: 51 }, null, { action: Action.Shift, nextState: 40 }, { action: Action.Shift, nextState: 41 }, null, { action: Action.Shift, nextState: 46 }, null, null, { action: Action.None, nextState: 138 }, null, null, null, null, null, null, null, null],
        /* state 136 */ [null, null, { action: Action.Reduce, productionIndex: 30 }, { action: Action.Reduce, productionIndex: 30 }, { action: Action.Reduce, productionIndex: 30 }, { action: Action.Reduce, productionIndex: 30 }, { action: Action.Reduce, productionIndex: 30 }, { action: Action.Reduce, productionIndex: 30 }, { action: Action.Reduce, productionIndex: 30 }, null, { action: Action.Reduce, productionIndex: 30 }, { action: Action.Reduce, productionIndex: 30 }, null, { action: Action.Reduce, productionIndex: 30 }, { action: Action.Reduce, productionIndex: 30 }, null, { action: Action.Reduce, productionIndex: 30 }, null, null, { action: Action.Reduce, productionIndex: 30 }, null, null, { action: Action.Reduce, productionIndex: 30 }, null, { action: Action.Reduce, productionIndex: 30 }, null, null, null, null, { action: Action.Reduce, productionIndex: 30 }, null, null, null, { action: Action.Reduce, productionIndex: 30 }, { action: Action.Reduce, productionIndex: 30 }, null, { action: Action.Reduce, productionIndex: 30 }, null, null, null, null, { action: Action.Reduce, productionIndex: 30 }, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 137 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Reduce, productionIndex: 23 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 138 */ [null, null, null, { action: Action.Shift, nextState: 59 }, { action: Action.Shift, nextState: 57 }, null, { action: Action.Shift, nextState: 58 }, { action: Action.Shift, nextState: 55 }, { action: Action.Shift, nextState: 60 }, null, { action: Action.Shift, nextState: 139 }, { action: Action.Shift, nextState: 61 }, null, { action: Action.Shift, nextState: 62 }, { action: Action.Shift, nextState: 63 }, null, { action: Action.Shift, nextState: 56 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        /* state 139 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Reduce, productionIndex: 24 }, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Shift, nextState: 113 }, null, null, null, null, null, null, null, null, null, null, { action: Action.None, nextState: 140 }, null, null, null, null, null, null, null, null, null, null],
        /* state 140 */ [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: Action.Reduce, productionIndex: 25 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    ];
    CoolToJS.productions = [
        // 0: $accept -> Program $end
        { popCount: 2, reduceResult: null },
        // 1: Program -> Class ;
        { popCount: 2, reduceResult: CoolToJS.SyntaxKind.Program },
        // 2: Program -> Class ; Program
        { popCount: 3, reduceResult: CoolToJS.SyntaxKind.Program },
        // 3: FeatureList -> Feature ;
        { popCount: 2, reduceResult: CoolToJS.SyntaxKind.FeatureList },
        // 4: FeatureList -> Feature ; FeatureList
        { popCount: 3, reduceResult: CoolToJS.SyntaxKind.FeatureList },
        // 5: Class -> ClassKeyword TypeIdentifier InheritsKeyword TypeIdentifier { FeatureList }
        { popCount: 7, reduceResult: CoolToJS.SyntaxKind.Class },
        // 6: Class -> ClassKeyword TypeIdentifier InheritsKeyword TypeIdentifier { }
        { popCount: 6, reduceResult: CoolToJS.SyntaxKind.Class },
        // 7: Class -> ClassKeyword TypeIdentifier { FeatureList }
        { popCount: 5, reduceResult: CoolToJS.SyntaxKind.Class },
        // 8: Class -> ClassKeyword TypeIdentifier { }
        { popCount: 4, reduceResult: CoolToJS.SyntaxKind.Class },
        // 9: FormalList -> Formal
        { popCount: 1, reduceResult: CoolToJS.SyntaxKind.FormalList },
        // 10: FormalList -> Formal , FormalList
        { popCount: 3, reduceResult: CoolToJS.SyntaxKind.FormalList },
        // 11: Feature -> ObjectIdentifier ( FormalList ) : TypeIdentifier { Expression }
        { popCount: 9, reduceResult: CoolToJS.SyntaxKind.Feature },
        // 12: Feature -> ObjectIdentifier ( ) : TypeIdentifier { Expression }
        { popCount: 8, reduceResult: CoolToJS.SyntaxKind.Feature },
        // 13: Feature -> ObjectIdentifier : TypeIdentifier <- Expression
        { popCount: 5, reduceResult: CoolToJS.SyntaxKind.Feature },
        // 14: Feature -> ObjectIdentifier : TypeIdentifier
        { popCount: 3, reduceResult: CoolToJS.SyntaxKind.Feature },
        // 15: Formal -> ObjectIdentifier : TypeIdentifier
        { popCount: 3, reduceResult: CoolToJS.SyntaxKind.Formal },
        // 16: ExpressionList -> Expression
        { popCount: 1, reduceResult: CoolToJS.SyntaxKind.ExpressionList },
        // 17: ExpressionList -> Expression , ExpressionList
        { popCount: 3, reduceResult: CoolToJS.SyntaxKind.ExpressionList },
        // 18: ExpressionSeries -> Expression ;
        { popCount: 2, reduceResult: CoolToJS.SyntaxKind.ExpressionSeries },
        // 19: ExpressionSeries -> Expression ; ExpressionSeries
        { popCount: 3, reduceResult: CoolToJS.SyntaxKind.ExpressionSeries },
        // 20: LocalVariableDeclarationList -> ObjectIdentifier : TypeIdentifier
        { popCount: 3, reduceResult: CoolToJS.SyntaxKind.LocalVariableDeclarationList },
        // 21: LocalVariableDeclarationList -> ObjectIdentifier : TypeIdentifier <- Expression
        { popCount: 5, reduceResult: CoolToJS.SyntaxKind.LocalVariableDeclarationList },
        // 22: LocalVariableDeclarationList -> ObjectIdentifier : TypeIdentifier , LocalVariableDeclarationList
        { popCount: 5, reduceResult: CoolToJS.SyntaxKind.LocalVariableDeclarationList },
        // 23: LocalVariableDeclarationList -> ObjectIdentifier : TypeIdentifier <- Expression , LocalVariableDeclarationList
        { popCount: 7, reduceResult: CoolToJS.SyntaxKind.LocalVariableDeclarationList },
        // 24: CaseOption -> ObjectIdentifier : TypeIdentifier => Expression ;
        { popCount: 6, reduceResult: CoolToJS.SyntaxKind.CaseOption },
        // 25: CaseOption -> ObjectIdentifier : TypeIdentifier => Expression ; CaseOption
        { popCount: 7, reduceResult: CoolToJS.SyntaxKind.CaseOption },
        // 26: Expression -> ObjectIdentifier <- Expression
        { popCount: 3, reduceResult: CoolToJS.SyntaxKind.Expression },
        // 27: Expression -> Expression . ObjectIdentifier ( )
        { popCount: 5, reduceResult: CoolToJS.SyntaxKind.Expression },
        // 28: Expression -> Expression . ObjectIdentifier ( ExpressionList )
        { popCount: 6, reduceResult: CoolToJS.SyntaxKind.Expression },
        // 29: Expression -> Expression @ TypeIdentifier . ObjectIdentifier ( )
        { popCount: 7, reduceResult: CoolToJS.SyntaxKind.Expression },
        // 30: Expression -> Expression @ TypeIdentifier . ObjectIdentifier ( ExpressionList )
        { popCount: 8, reduceResult: CoolToJS.SyntaxKind.Expression },
        // 31: Expression -> ObjectIdentifier ( )
        { popCount: 3, reduceResult: CoolToJS.SyntaxKind.Expression },
        // 32: Expression -> ObjectIdentifier ( ExpressionList )
        { popCount: 4, reduceResult: CoolToJS.SyntaxKind.Expression },
        // 33: Expression -> IfKeyword Expression ThenKeyword Expression ElseKeyword Expression FiKeyword
        { popCount: 7, reduceResult: CoolToJS.SyntaxKind.Expression },
        // 34: Expression -> WhileKeyword Expression LoopKeyword Expression PoolKeyword
        { popCount: 5, reduceResult: CoolToJS.SyntaxKind.Expression },
        // 35: Expression -> { ExpressionSeries }
        { popCount: 3, reduceResult: CoolToJS.SyntaxKind.Expression },
        // 36: Expression -> LetKeyword LocalVariableDeclarationList InKeyword Expression
        { popCount: 4, reduceResult: CoolToJS.SyntaxKind.Expression },
        // 37: Expression -> CaseKeyword Expression OfKeyword CaseOption EsacKeyword
        { popCount: 5, reduceResult: CoolToJS.SyntaxKind.Expression },
        // 38: Expression -> NewKeyword TypeIdentifier
        { popCount: 2, reduceResult: CoolToJS.SyntaxKind.Expression },
        // 39: Expression -> IsvoidKeyword Expression
        { popCount: 2, reduceResult: CoolToJS.SyntaxKind.Expression },
        // 40: Expression -> Expression + Expression
        { popCount: 3, reduceResult: CoolToJS.SyntaxKind.Expression },
        // 41: Expression -> Expression - Expression
        { popCount: 3, reduceResult: CoolToJS.SyntaxKind.Expression },
        // 42: Expression -> Expression * Expression
        { popCount: 3, reduceResult: CoolToJS.SyntaxKind.Expression },
        // 43: Expression -> Expression / Expression
        { popCount: 3, reduceResult: CoolToJS.SyntaxKind.Expression },
        // 44: Expression -> ~ Expression
        { popCount: 2, reduceResult: CoolToJS.SyntaxKind.Expression },
        // 45: Expression -> Expression < Expression
        { popCount: 3, reduceResult: CoolToJS.SyntaxKind.Expression },
        // 46: Expression -> Expression <= Expression
        { popCount: 3, reduceResult: CoolToJS.SyntaxKind.Expression },
        // 47: Expression -> Expression = Expression
        { popCount: 3, reduceResult: CoolToJS.SyntaxKind.Expression },
        // 48: Expression -> NotKeyword Expression
        { popCount: 2, reduceResult: CoolToJS.SyntaxKind.Expression },
        // 49: Expression -> ( Expression )
        { popCount: 3, reduceResult: CoolToJS.SyntaxKind.Expression },
        // 50: Expression -> ObjectIdentifier
        { popCount: 1, reduceResult: CoolToJS.SyntaxKind.Expression },
        // 51: Expression -> Integer
        { popCount: 1, reduceResult: CoolToJS.SyntaxKind.Expression },
        // 52: Expression -> String
        { popCount: 1, reduceResult: CoolToJS.SyntaxKind.Expression },
        // 53: Expression -> TrueKeyword
        { popCount: 1, reduceResult: CoolToJS.SyntaxKind.Expression },
        // 54: Expression -> FalseKeyword
        { popCount: 1, reduceResult: CoolToJS.SyntaxKind.Expression },
    ];
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    var Parser = /** @class */ (function () {
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
                        if (tokens[i].token === CoolToJS.SyntaxKind.LetKeyword) {
                            warningToken = tokens[i];
                            break;
                        }
                    }
                    warningToken = warningToken || tokens[inputPointer];
                    if (alreadyWarnedTokens.indexOf(warningToken) !== -1) {
                        return;
                    }
                    var warningMessage = 'Ambiguous shift/reduce detected in parse table.  Automatically took shift option. '
                        + 'To remove abiguity and ensure proper parsing, ensure all "let" blocks surround their contents in curly brackets.';
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
                // #endregion     
                // keep looping until the only item on the stack is the start symbol and we have no more input to read
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
                    if (tableEntry === null || (tableEntry.action === CoolToJS.Action.Accept && isAtEndOfInput())) {
                        tableEntry = CoolToJS.slr1ParseTable[state][CoolToJS.SyntaxKind.EndOfInput];
                        if (tableEntry instanceof Array) {
                            tableEntry = tableEntry[0];
                            recordAmbiguousParseWarning();
                        }
                    }
                    // if tableEntry is STILL null, we have a parse error.
                    if (tableEntry === null) {
                        // TODO: better error reporting
                        var errorMessage = '';
                        if (tokens[inputPointer].token === CoolToJS.SyntaxKind.EndOfInput) {
                            errorMessage = 'Parse error: unexpected end of input';
                        }
                        else {
                            errorMessage = 'Parse error: unexpected token: "' + tokens[inputPointer].match + '"';
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
                    if (tableEntry.action === CoolToJS.Action.Shift) {
                        stack.push({
                            syntaxKind: tokens[inputPointer].token,
                            syntaxKindName: CoolToJS.SyntaxKind[tokens[inputPointer].token],
                            token: tokens[inputPointer],
                            parent: null,
                            children: [],
                        });
                        inputPointer++;
                    }
                    else if (tableEntry.action === CoolToJS.Action.Reduce) {
                        var production = CoolToJS.productions[tableEntry.productionIndex];
                        var removedItems = stack.splice(-1 * production.popCount, production.popCount);
                        var newStackItem = {
                            syntaxKind: production.reduceResult,
                            syntaxKindName: CoolToJS.SyntaxKind[production.reduceResult],
                            children: removedItems,
                            parent: null,
                        };
                        // set the new item as the parent of the removed items
                        for (var i = 0; i < newStackItem.children.length; i++) {
                            newStackItem.children[i].parent = newStackItem;
                        }
                        stack.push(newStackItem);
                    }
                    else {
                        // Parse error!
                        // TODO: does this always mean "unexpected end of program"?
                        var errorMessage = 'Parse error: expected end of program, but instead saw "' + tokens[inputPointer].match + '"';
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
                    //printStack();
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
                if (tokens[i].token !== CoolToJS.SyntaxKind.CarriageReturn
                    && tokens[i].token !== CoolToJS.SyntaxKind.Comment
                    && tokens[i].token !== CoolToJS.SyntaxKind.NewLine
                    && tokens[i].token !== CoolToJS.SyntaxKind.Tab
                    && tokens[i].token !== CoolToJS.SyntaxKind.WhiteSpace) {
                    cleanArray.push(tokens[i]);
                }
            }
            return cleanArray;
        };
        return Parser;
    }());
    CoolToJS.Parser = Parser;
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    var SemanticAnalyzer = /** @class */ (function () {
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
                _this.usageRecord = new CoolToJS.UsageRecord();
                _this.analyze(astConvertOutput.abstractSyntaxTree, starterTypeEnvironment, errorMessages, warningMessages);
                _this.markAsyncFeatures(_this.typeHeirarchy.findMethodOnType('in_string', 'IO', false), _this.typeHeirarchy.findMethodOnType('in_int', 'IO', false));
                return {
                    success: errorMessages.length === 0,
                    abstractSyntaxTree: astConvertOutput.abstractSyntaxTree,
                    usageRecord: _this.usageRecord,
                    errorMessages: errorMessages,
                    warningMessages: warningMessages
                };
            };
            // analyzes the current node and returns the inferred type name (if applicable)
            this.analyze = function (ast, typeEnvironment, errorMessages, warningMessages) {
                /* PROGRAM */
                if (ast.type === CoolToJS.NodeType.Program) {
                    var programNode = ast;
                    // ensure that exactly 1 Main class is defined and that all class names are unique
                    var mainClass;
                    var duplicateClasses = [];
                    for (var i = 0; i < programNode.classList.length; i++) {
                        if (!mainClass && programNode.classList[i].className === 'Main') {
                            mainClass = programNode.classList[i];
                        }
                        if (programNode.classList.map(function (c) { return c.className; }).slice(0, i).indexOf(programNode.classList[i].className) !== -1) {
                            duplicateClasses.push(programNode.classList[i]);
                        }
                        if (['String', 'Int', 'Bool'].indexOf(programNode.classList[i].superClassName) !== -1) {
                            errorMessages.push({
                                location: programNode.classList[i].token.location,
                                message: 'Classes cannot inherit from "' + programNode.classList[i].superClassName + '"'
                            });
                        }
                        if (['String', 'Int', 'Bool', 'Object', 'IO'].indexOf(programNode.classList[i].className) !== -1) {
                            errorMessages.push({
                                location: programNode.classList[i].token.location,
                                message: 'Redefinition of basic class "' + programNode.classList[i].superClassName + '"'
                            });
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
                    CoolToJS.Utility.addBuiltinObjects(programNode);
                    _this.typeHeirarchy = CoolToJS.TypeHeirarchy.createHeirarchy(programNode);
                    // ensure that superclasses exist
                    var allSuperclassesExist = true;
                    programNode.classList.forEach(function (classNode) {
                        if (classNode.superClassName && !programNode.classList.some(function (c) { return c.className === classNode.superClassName; })) {
                            allSuperclassesExist = false;
                            errorMessages.push({
                                location: classNode.token.location,
                                message: 'Inherited type "' + classNode.superClassName + '" does not exist'
                            });
                        }
                    });
                    // check for circular inheritance
                    if (allSuperclassesExist) {
                        var typeHeirachyFlattened = _this.typeHeirarchy.flatten();
                        programNode.classList.forEach(function (c) {
                            if (!typeHeirachyFlattened.some(function (t) { return t.classNode === c; }) && programNode.classList.some(function (cc) { return cc.className === c.superClassName; })) {
                                errorMessages.push({
                                    location: c.token.location,
                                    message: 'Class "' + c.className + '", or an ancestor of "' + c.className + '", is involved in an inheritance cycle'
                                });
                            }
                        });
                    }
                    ast.children.forEach(function (node) {
                        if (['String', 'Int', 'Bool', 'Object', 'IO'].indexOf(node.className) === -1) {
                            _this.analyze(node, typeEnvironment, errorMessages, warningMessages);
                        }
                    });
                }
                /* CLASS */
                else if (ast.type === CoolToJS.NodeType.Class) {
                    var classNode = ast;
                    typeEnvironment.currentClassType = classNode.className;
                    typeEnvironment.variableScope = [];
                    // ensure that all method names are unique
                    var duplicateMethods = [];
                    for (var i = 0; i < classNode.methodList.length; i++) {
                        if (classNode.methodList.map(function (c) { return c.methodName; }).slice(0, i).indexOf(classNode.methodList[i].methodName) !== -1) {
                            duplicateMethods.push(classNode.methodList[i]);
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
                        if (classNode.propertyList.map(function (c) { return c.propertyName; }).slice(0, i).indexOf(classNode.propertyList[i].propertyName) !== -1) {
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
                /* CLASS PROPERTY */
                else if (ast.type === CoolToJS.NodeType.Property) {
                    var propertyNode = ast;
                    if (propertyNode.typeName !== 'SELF_TYPE' && !_this.typeHeirarchy.findTypeHeirarchy(propertyNode.typeName)) {
                        errorMessages.push({
                            location: propertyNode.token.location,
                            message: 'Class "' + propertyNode.typeName + '" of attribute "' + propertyNode.propertyName + '" is undefined'
                        });
                    }
                    if (propertyNode.hasInitializer) {
                        var initializerType = _this.analyze(propertyNode.propertyInitializerExpression, typeEnvironment, errorMessages, warningMessages);
                        if (!_this.typeHeirarchy.isAssignableFrom(propertyNode.typeName, initializerType, typeEnvironment.currentClassType)) {
                            _this.addTypeError(propertyNode.typeName, initializerType, propertyNode.token.location, errorMessages);
                        }
                    }
                }
                /* CLASS METHOD */
                else if (ast.type === CoolToJS.NodeType.Method) {
                    var methodNode = ast;
                    //methodNode.isAsync = true;
                    // add method parameters to the current scope
                    methodNode.parameters.forEach(function (param) {
                        typeEnvironment.variableScope.push({
                            variableName: param.parameterName,
                            variableType: param.parameterTypeName
                        });
                    });
                    var methodReturnType = _this.analyze(methodNode.methodBodyExpression, typeEnvironment, errorMessages, warningMessages);
                    // remove the added variables from the scope
                    typeEnvironment.variableScope.splice(typeEnvironment.variableScope.length - methodNode.parameters.length, methodNode.parameters.length);
                    if (methodNode.returnTypeName !== 'SELF_TYPE' && !_this.typeHeirarchy.findTypeHeirarchy(methodNode.returnTypeName)) {
                        errorMessages.push({
                            location: methodNode.token.location,
                            message: 'Undefined return type "' + methodNode.returnTypeName + '" of method "' + methodNode.methodName + '"'
                        });
                    }
                    else if (!_this.typeHeirarchy.isAssignableFrom(methodNode.returnTypeName, methodReturnType, typeEnvironment.currentClassType)) {
                        errorMessages.push({
                            location: methodNode.token.location,
                            message: 'Return type "' + methodReturnType + '" of method "' + methodNode.methodName + '" is not assignable to the declared type of "' + methodNode.returnTypeName + '"'
                        });
                    }
                }
                /* ASSIGNMENT EXPRESSION */
                else if (ast.type === CoolToJS.NodeType.AssignmentExpression) {
                    var assignmentExpressionNode = ast;
                    var identifierName, identifierType, identifierWasFound = false;
                    // first check the scope for the target variable
                    for (var i = typeEnvironment.variableScope.length - 1; i >= 0; i--) {
                        if (typeEnvironment.variableScope[i].variableName === assignmentExpressionNode.identifierName) {
                            identifierName = typeEnvironment.variableScope[i].variableName;
                            identifierType = typeEnvironment.variableScope[i].variableType;
                            identifierWasFound = true;
                            break;
                        }
                    }
                    // if we didn't find it in the scope, check the current class variables
                    if (!identifierWasFound) {
                        var foundPropertyNode = _this.typeHeirarchy.findPropertyOnType(assignmentExpressionNode.identifierName, typeEnvironment.currentClassType, true);
                        if (foundPropertyNode) {
                            identifierName = foundPropertyNode.propertyName;
                            identifierType = foundPropertyNode.typeName;
                            identifierWasFound = true;
                            assignmentExpressionNode.isAssignmentToSelfVariable = true;
                        }
                    }
                    if (!identifierWasFound) {
                        errorMessages.push({
                            location: assignmentExpressionNode.token.location,
                            message: 'Assignment to undeclared variable "' + assignmentExpressionNode.identifierName + '"'
                        });
                        return CoolToJS.UnknownType;
                    }
                    var expressionType = _this.analyze(assignmentExpressionNode.assignmentExpression, typeEnvironment, errorMessages, warningMessages);
                    if (!_this.typeHeirarchy.isAssignableFrom(identifierType, expressionType, typeEnvironment.currentClassType)) {
                        _this.addTypeError(identifierType, expressionType, assignmentExpressionNode.token.location, errorMessages);
                    }
                    return expressionType;
                }
                /* METHOD CALL EXPRESSION */
                else if (ast.type === CoolToJS.NodeType.MethodCallExpression) {
                    var methodCallExpressionNode = ast, methodTargetType;
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
                    var foundMethodNode = _this.typeHeirarchy.findMethodOnType(methodCallExpressionNode.methodName, methodTargetType, !methodCallExpressionNode.isCallToParent);
                    if (foundMethodNode) {
                        methodCallExpressionNode.method = foundMethodNode;
                        if (foundMethodNode.parameters.length !== methodCallExpressionNode.parameterExpressionList.length) {
                            errorMessages.push({
                                location: methodCallExpressionNode.token.location,
                                message: ('Method "' + methodCallExpressionNode.methodName + '" takes exactly '
                                    + foundMethodNode.parameters.length + ' parameter'
                                    + (foundMethodNode.parameters.length === 1 ? '' : 's')
                                    + '. ' + methodCallExpressionNode.parameterExpressionList.length
                                    + (methodCallExpressionNode.parameterExpressionList.length === 1 ? ' parameter was' : ' parameters were')
                                    + ' provided.')
                            });
                        }
                        var parameterTypes = methodCallExpressionNode.parameterExpressionList.map(function (exprNode) {
                            return _this.analyze(exprNode, typeEnvironment, errorMessages, warningMessages);
                        });
                        foundMethodNode.parameters.forEach(function (param, paramIndex) {
                            if (parameterTypes[paramIndex]
                                && !_this.typeHeirarchy.isAssignableFrom(param.parameterTypeName, parameterTypes[paramIndex], typeEnvironment.currentClassType)) {
                                errorMessages.push({
                                    location: methodCallExpressionNode.token.location,
                                    message: ('Parameter ' + (paramIndex + 1) + ' of method "' + methodCallExpressionNode.methodName
                                        + '" must be of type "' + param.parameterTypeName + '".  '
                                        + 'A parameter of type "' + parameterTypes[paramIndex] + '" was provided instead')
                                });
                            }
                        });
                        methodCallExpressionNode.isInStringOrInInt = foundMethodNode.isInStringOrInInt;
                        _this.markCalledBy(methodCallExpressionNode, foundMethodNode);
                        foundMethodNode.isUsed = true;
                        if (foundMethodNode.returnTypeName === 'SELF_TYPE') {
                            return methodTargetType;
                        }
                        else {
                            return foundMethodNode.returnTypeName;
                        }
                    }
                    errorMessages.push({
                        location: methodCallExpressionNode.token.location,
                        message: 'Method "' + methodCallExpressionNode.methodName + '" does not exist on type "' + methodTargetType + '"'
                    });
                    return CoolToJS.UnknownType;
                }
                /* IF/THEN/ELSE EXPRESSION */
                else if (ast.type === CoolToJS.NodeType.IfThenElseExpression) {
                    var ifThenElseNode = ast;
                    var predicateType = _this.analyze(ifThenElseNode.predicate, typeEnvironment, errorMessages, warningMessages);
                    if (!_this.typeHeirarchy.isAssignableFrom('Bool', predicateType, typeEnvironment.currentClassType)) {
                        errorMessages.push({
                            location: ifThenElseNode.token.location,
                            message: 'The condition expression of an "if" statement must return a "Bool"'
                        });
                    }
                    var consequentType = _this.analyze(ifThenElseNode.consequent, typeEnvironment, errorMessages, warningMessages);
                    var alternativeType = _this.analyze(ifThenElseNode.alternative, typeEnvironment, errorMessages, warningMessages);
                    var closestCommonType = _this.typeHeirarchy.closetCommonParent(consequentType, alternativeType);
                    return closestCommonType;
                }
                /* WHILE EXPRESSION */
                else if (ast.type === CoolToJS.NodeType.WhileExpression) {
                    var whileExpressionNode = ast;
                    var predicateType = _this.analyze(whileExpressionNode.whileConditionExpression, typeEnvironment, errorMessages, warningMessages);
                    if (!_this.typeHeirarchy.isAssignableFrom('Bool', predicateType, typeEnvironment.currentClassType)) {
                        errorMessages.push({
                            location: whileExpressionNode.token.location,
                            message: 'The condition expression of a "while" statement must return a "Bool"'
                        });
                    }
                    _this.analyze(whileExpressionNode.whileBodyExpression, typeEnvironment, errorMessages, warningMessages);
                    return 'Object';
                }
                /* BLOCK EXPRESSION */
                else if (ast.type === CoolToJS.NodeType.BlockExpression) {
                    var blockExpressionNode = ast;
                    var returnType;
                    blockExpressionNode.expressionList.forEach(function (expressionNode) {
                        returnType = _this.analyze(expressionNode, typeEnvironment, errorMessages, warningMessages);
                    });
                    return returnType;
                }
                /* LET EXPRESSION */
                else if (ast.type === CoolToJS.NodeType.LetExpression) {
                    var letExpressionNode = ast;
                    // add the new variables to the scope
                    letExpressionNode.localVariableDeclarations.forEach(function (varDeclarationNode) {
                        typeEnvironment.variableScope.push({
                            variableName: varDeclarationNode.identifierName,
                            variableType: varDeclarationNode.typeName
                        });
                        _this.analyze(varDeclarationNode, typeEnvironment, errorMessages, warningMessages);
                    });
                    var returnType = _this.analyze(letExpressionNode.letBodyExpression, typeEnvironment, errorMessages, warningMessages);
                    // remove the added variables from the scope
                    typeEnvironment.variableScope.splice(typeEnvironment.variableScope.length - letExpressionNode.localVariableDeclarations.length, letExpressionNode.localVariableDeclarations.length);
                    return returnType;
                }
                /* LOCAL VARIABLE DECLARAION */
                else if (ast.type === CoolToJS.NodeType.LocalVariableDeclaration) {
                    var lvdNode = ast;
                    if (lvdNode.typeName !== 'SELF_TYPE' && !_this.typeHeirarchy.findTypeHeirarchy(lvdNode.typeName)) {
                        errorMessages.push({
                            location: lvdNode.token.location,
                            message: 'Class "' + lvdNode.typeName + '" of let-bound identifier "' + lvdNode.identifierName + '" is undefined'
                        });
                    }
                    if (lvdNode.initializerExpression) {
                        var initializerType = _this.analyze(lvdNode.initializerExpression, typeEnvironment, errorMessages, warningMessages);
                        if (!_this.typeHeirarchy.isAssignableFrom(lvdNode.typeName, initializerType, typeEnvironment.currentClassType)) {
                            _this.addTypeError(lvdNode.typeName, initializerType, lvdNode.token.location, errorMessages);
                        }
                    }
                }
                /* CASE EXPRESSION */
                else if (ast.type === CoolToJS.NodeType.CaseExpression) {
                    var caseExpressionNode = ast;
                    var caseOptionTypes = caseExpressionNode.caseOptionList.map(function (co) {
                        typeEnvironment.variableScope.push({
                            variableName: co.identiferName,
                            variableType: co.typeName
                        });
                        var caseOptionReturnType = _this.analyze(co.caseOptionExpression, typeEnvironment, errorMessages, warningMessages);
                        if (co.typeName !== 'SELF_TYPE' && !_this.typeHeirarchy.findTypeHeirarchy(co.typeName)) {
                            errorMessages.push({
                                location: co.token.location,
                                message: 'Class "' + co.typeName + '" of case branch is undefined'
                            });
                        }
                        typeEnvironment.variableScope.pop();
                        return caseOptionReturnType;
                    });
                    while (caseOptionTypes.length > 1) {
                        var commonParent = _this.typeHeirarchy.closetCommonParent(caseOptionTypes[0], caseOptionTypes[1]);
                        caseOptionTypes.splice(0, 2, commonParent);
                    }
                    _this.analyze(caseExpressionNode.condition, typeEnvironment, errorMessages, warningMessages);
                    _this.usageRecord.caseExpression = true;
                    return caseOptionTypes[0];
                }
                /* CASE OPTION */
                else if (ast.type === CoolToJS.NodeType.CaseOption) {
                    throw 'Analysis of Case Option nodes happens inside of the Case Expression block.  We should never be here.';
                }
                /* NEW EXPRESSION */
                else if (ast.type === CoolToJS.NodeType.NewExpression) {
                    var newExpressionNode = ast;
                    var referencedClassNode = _this.typeHeirarchy.findTypeHeirarchy(newExpressionNode.typeName).classNode;
                    if (!referencedClassNode) {
                        errorMessages.push({
                            location: newExpressionNode.token.location,
                            message: 'Class "' + newExpressionNode.token.match + '" is not defined'
                        });
                        return CoolToJS.UnknownType;
                    }
                    else {
                        newExpressionNode.classNode = referencedClassNode;
                        _this.markCalledBy(newExpressionNode, referencedClassNode);
                        return newExpressionNode.typeName;
                    }
                }
                /* ISVOID EXPRESSION */
                else if (ast.type === CoolToJS.NodeType.IsvoidExpression) {
                    _this.analyze(ast.isVoidCondition, typeEnvironment, errorMessages, warningMessages);
                    return 'Bool';
                }
                /* BINARY OPERATION EXPRESSION */
                else if (ast.type === CoolToJS.NodeType.BinaryOperationExpression) {
                    var binOpNode = ast;
                    var leftSideType = _this.analyze(binOpNode.operand1, typeEnvironment, errorMessages, warningMessages);
                    var rightSideType = _this.analyze(binOpNode.operand2, typeEnvironment, errorMessages, warningMessages);
                    if (_this.usageRecord.binaryOperations.indexOf(binOpNode.operationType) === -1) {
                        _this.usageRecord.binaryOperations.push(binOpNode.operationType);
                    }
                    if (binOpNode.operationType !== CoolToJS.BinaryOperationType.Comparison) {
                        if (!_this.typeHeirarchy.isAssignableFrom('Int', leftSideType, typeEnvironment.currentClassType)) {
                            errorMessages.push({
                                location: binOpNode.token.location,
                                message: 'Left side of the "' + binOpNode.token.match + '" operator must be of type "Int"'
                            });
                        }
                        if (!_this.typeHeirarchy.isAssignableFrom('Int', rightSideType, typeEnvironment.currentClassType)) {
                            errorMessages.push({
                                location: binOpNode.token.location,
                                message: 'Right side of the "' + binOpNode.token.match + '" operator must be of type "Int"'
                            });
                        }
                        if (binOpNode.operationType === CoolToJS.BinaryOperationType.LessThanOrEqualTo
                            || binOpNode.operationType === CoolToJS.BinaryOperationType.LessThan) {
                            return 'Bool';
                        }
                        else {
                            return 'Int';
                        }
                    }
                    else {
                        if (['Int', 'String', 'Bool'].indexOf(leftSideType) !== -1
                            || ['Int', 'String', 'Bool'].indexOf(rightSideType) !== -1) {
                            if (leftSideType !== rightSideType) {
                                errorMessages.push({
                                    location: binOpNode.token.location,
                                    message: 'Illegal comparison between type "' + leftSideType + '" and type "' + rightSideType + '"'
                                });
                            }
                        }
                        return 'Bool';
                    }
                }
                /* UNARY OPERATION EXPRESSION */
                else if (ast.type === CoolToJS.NodeType.UnaryOperationExpression) {
                    var unaryOpNode = ast;
                    var unaryOperationType = _this.analyze(unaryOpNode.operand, typeEnvironment, errorMessages, warningMessages);
                    if (_this.usageRecord.unaryOperations.indexOf(unaryOpNode.operationType) === -1) {
                        _this.usageRecord.unaryOperations.push(unaryOpNode.operationType);
                    }
                    if (unaryOpNode.operationType === CoolToJS.UnaryOperationType.Not) {
                        if (!_this.typeHeirarchy.isAssignableFrom('Bool', unaryOperationType, typeEnvironment.currentClassType)) {
                            errorMessages.push({
                                location: unaryOpNode.token.location,
                                message: 'Expression following the "Not" operator must be of type "Bool"'
                            });
                        }
                        return 'Bool';
                    }
                    else {
                        if (!_this.typeHeirarchy.isAssignableFrom('Int', unaryOperationType, typeEnvironment.currentClassType)) {
                            errorMessages.push({
                                location: unaryOpNode.token.location,
                                message: 'Expression following the "~" operator must be of type "Int"'
                            });
                        }
                        return 'Int';
                    }
                }
                /* PARANTHETICAL EXPRESSION */
                else if (ast.type === CoolToJS.NodeType.ParentheticalExpression) {
                    return _this.analyze(ast.innerExpression, typeEnvironment, errorMessages, warningMessages);
                }
                /* SELF EXPRESSION */
                else if (ast.type === CoolToJS.NodeType.SelfExpression) {
                    return typeEnvironment.currentClassType;
                }
                /* OBJECT IDENTIFIER EXPRESSION */
                else if (ast.type === CoolToJS.NodeType.ObjectIdentifierExpression) {
                    var objectIdExpressionNode = ast;
                    for (var i = typeEnvironment.variableScope.length - 1; i >= 0; i--) {
                        if (typeEnvironment.variableScope[i].variableName === objectIdExpressionNode.objectIdentifierName) {
                            return typeEnvironment.variableScope[i].variableType;
                        }
                    }
                    var foundPropertyNode = _this.typeHeirarchy.findPropertyOnType(objectIdExpressionNode.objectIdentifierName, typeEnvironment.currentClassType, true);
                    if (foundPropertyNode) {
                        objectIdExpressionNode.isCallToSelf = true;
                        _this.markCalledBy(objectIdExpressionNode, foundPropertyNode);
                        return foundPropertyNode.typeName;
                    }
                    errorMessages.push({
                        location: objectIdExpressionNode.token.location,
                        message: 'Undeclared variable "' + objectIdExpressionNode.objectIdentifierName + '"'
                    });
                    return CoolToJS.UnknownType;
                }
                /* INTEGER LITERAL */
                else if (ast.type === CoolToJS.NodeType.IntegerLiteralExpression) {
                    return 'Int';
                }
                /* STRING LITERAL */
                else if (ast.type === CoolToJS.NodeType.StringLiteralExpression) {
                    return 'String';
                }
                /* BOOL LITERAL */
                else if (ast.type === CoolToJS.NodeType.TrueKeywordExpression || ast.type === CoolToJS.NodeType.FalseKeywordExpression) {
                    return 'Bool';
                }
                else
                    throw "Unrecognized Abstract Syntax Tree type!";
            };
        }
        SemanticAnalyzer.prototype.addTypeError = function (type1Name, type2Name, location, errorMessages) {
            errorMessages.push({
                location: location,
                message: 'Type "' + type2Name + '" is not assignable to type "' + type1Name + '"'
            });
        };
        SemanticAnalyzer.prototype.markAsyncFeatures = function () {
            var _this = this;
            var asyncFeatures = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                asyncFeatures[_i] = arguments[_i];
            }
            asyncFeatures.forEach(function (asyncFeature) {
                asyncFeature.calledBy.filter(function (calledByFeature) {
                    return !calledByFeature.isAsync;
                }).forEach(function (calledByFeature) {
                    calledByFeature.isAsync = true;
                    if (calledByFeature.type === CoolToJS.NodeType.Property) {
                        var asyncClass = calledByFeature.parent;
                        asyncClass.isAsync = true;
                        asyncClass.calledBy.forEach(function (calledByFeatureByClass) {
                            calledByFeatureByClass.isAsync = true;
                            _this.markAsyncFeatures(calledByFeatureByClass);
                        });
                    }
                    else {
                        _this.markAsyncFeatures(calledByFeature);
                    }
                });
            });
        };
        SemanticAnalyzer.prototype.markCalledBy = function (node, referencedNode) {
            var parentFeature = node.parent;
            while (parentFeature && parentFeature.type !== CoolToJS.NodeType.Method && parentFeature.type !== CoolToJS.NodeType.Property) {
                parentFeature = parentFeature.parent;
            }
            if (!parentFeature) {
                throw 'Invalid state: ' + node.nodeTypeName + ' has no parent Method or Property';
            }
            if (parentFeature.calls.indexOf(referencedNode) === -1) {
                parentFeature.calls.push(referencedNode);
            }
            if (referencedNode.calledBy.indexOf(parentFeature) === -1) {
                referencedNode.calledBy.push(parentFeature);
            }
        };
        return SemanticAnalyzer;
    }());
    CoolToJS.SemanticAnalyzer = SemanticAnalyzer;
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    var DontCompile;
    (function (DontCompile) {
        var SyntaxKind;
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
        })(SyntaxKind = DontCompile.SyntaxKind || (DontCompile.SyntaxKind = {}));
        DontCompile.StartSyntaxKind = SyntaxKind.E;
        // order signifies priority (keywords are listed first)
        DontCompile.TokenLookup = [
            {
                token: SyntaxKind.Integer,
                regex: /^([0-9]+)\b/,
            },
            {
                token: SyntaxKind.MultiplicationOperator,
                regex: /^(\*)/
            },
            {
                token: SyntaxKind.AdditionOperator,
                regex: /^(\+)/
            },
            {
                token: SyntaxKind.OpenParenthesis,
                regex: /^(\()/
            },
            {
                token: SyntaxKind.ClosedParenthesis,
                regex: /^(\))/
            },
            {
                token: SyntaxKind.WhiteSpace,
                regex: /^( +)/,
            },
            {
                token: SyntaxKind.CarriageReturn,
                regex: /^(\r)/,
            },
            {
                token: SyntaxKind.NewLine,
                regex: /^(\n)/,
            },
            {
                token: SyntaxKind.Tab,
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
            var in_string = function (onInput) { };
        }
        if (transpilerOptions.in_int) {
            var in_int = transpilerOptions.in_int;
        }
        else {
            var in_int = function (onInput) { };
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
        var semanticAnalyzer = new CoolToJS.SemanticAnalyzer();
        var semanticAnalyzerOutput = semanticAnalyzer.Analyze(astConvertOutput);
        if (!semanticAnalyzerOutput.success) {
            return {
                success: false,
                errorMessages: semanticAnalyzerOutput.errorMessages,
                warningMessages: semanticAnalyzerOutput.warningMessages,
                elapsedTime: Date.now() - startTime
            };
        }
        var codeGenerator = new CoolToJS.JavaScriptGenerator();
        var codeGeneratorOutput = codeGenerator.Generate(semanticAnalyzerOutput, {
            in_int: in_int,
            in_string: in_string,
            out_int: out_int,
            out_string: out_string
        });
        return {
            success: codeGeneratorOutput.success,
            errorMessages: codeGeneratorOutput.errorMessages,
            warningMessages: codeGeneratorOutput.warningMessages,
            generatedJavaScript: codeGeneratorOutput.generatedJavaScript,
            elapsedTime: Date.now() - startTime
        };
    }
    CoolToJS.Transpile = Transpile;
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    CoolToJS.UnknownType = '$UnknownType$';
    var TypeHeirarchy = /** @class */ (function () {
        function TypeHeirarchy(classNode) {
            var _this = this;
            this.children = [];
            // returns whether or not a Type exists in the current program
            this.typeExists = function (typeName) {
                return _this.findTypeHeirarchy(typeName) !== null;
            };
            // finds a type in the current TypeHeirarchy Tree
            this.findTypeHeirarchy = function (typeName) {
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
                return findTypeHeirarchy(_this);
            };
            this.classNode = classNode;
        }
        Object.defineProperty(TypeHeirarchy.prototype, "typeName", {
            get: function () {
                return this.classNode.className;
            },
            enumerable: true,
            configurable: true
        });
        TypeHeirarchy.createHeirarchy = function (programNode) {
            // create TypeHierarchy objects for every class defined in this program
            var allTypes = programNode.classList.map(function (c) {
                return {
                    parentName: c.superClassName || 'Object',
                    typeHeirarchy: new TypeHeirarchy(c)
                };
            });
            var root;
            // assemble a tree out of the list of TypeHierarchy's from above
            allTypes.forEach(function (typeAndParent, i) {
                if (typeAndParent.typeHeirarchy.typeName === 'Object') {
                    root = typeAndParent.typeHeirarchy;
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
            return root;
        };
        // determines whether one class either inherits or is another
        // examples:
        // isAssignableFrom('BaseClass', 'SubClass') => true
        // isAssignableFrom('SubClass', 'BaseClass') => false
        // isAssignableFrom('SubClass', 'SubClass') => true
        TypeHeirarchy.prototype.isAssignableFrom = function (type1Name, type2Name, selfTypeClass) {
            if (type1Name === 'SELF_TYPE') {
                type1Name = selfTypeClass;
            }
            if (type2Name === 'SELF_TYPE') {
                type2Name = selfTypeClass;
            }
            // shortcut for performance
            if (type1Name === type2Name) {
                return true;
            }
            if (type1Name === CoolToJS.UnknownType || type2Name === CoolToJS.UnknownType) {
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
        TypeHeirarchy.prototype.closetCommonParent = function (type1Name, type2Name) {
            if (type1Name === type2Name) {
                return type1Name;
            }
            var type1Heirarchy = this.findTypeHeirarchy(type1Name);
            var type2Heirarchy = this.findTypeHeirarchy(type2Name);
            var originalType1Heirarchy = type1Heirarchy;
            while (type2Heirarchy) {
                type1Heirarchy = originalType1Heirarchy;
                while (type1Heirarchy) {
                    if (type1Heirarchy === type2Heirarchy) {
                        return type1Heirarchy.typeName;
                    }
                    type1Heirarchy = type1Heirarchy.parent;
                }
                type2Heirarchy = type2Heirarchy.parent;
            }
            // we should always at least find Object.  This is an error condition.
            return CoolToJS.UnknownType;
        };
        // returns a MethodNode that corresponds to the provided method name, given the current heirarchy.
        // providing includeInheritedMethods = false causes this method to only return MethodNodes
        // that exist directly on the given type (does not search through the inheritance tree).
        TypeHeirarchy.prototype.findMethodOnType = function (methodName, typeName, includeInheritedMethods) {
            if (includeInheritedMethods === void 0) { includeInheritedMethods = true; }
            var typeHeirarchy = this.findTypeHeirarchy(typeName);
            while (typeHeirarchy) {
                for (var i = 0; i < typeHeirarchy.classNode.methodList.length; i++) {
                    if (typeHeirarchy.classNode.methodList[i].methodName === methodName) {
                        return typeHeirarchy.classNode.methodList[i];
                    }
                }
                typeHeirarchy = includeInheritedMethods ? typeHeirarchy.parent : null;
            }
            return null;
        };
        // same as findMethodOnType, but for properties
        TypeHeirarchy.prototype.findPropertyOnType = function (propertyName, typeName, includeInheritedProperties) {
            if (includeInheritedProperties === void 0) { includeInheritedProperties = true; }
            var typeHeirarchy = this.findTypeHeirarchy(typeName);
            while (typeHeirarchy) {
                for (var i = 0; i < typeHeirarchy.classNode.propertyList.length; i++) {
                    if (typeHeirarchy.classNode.propertyList[i].propertyName === propertyName) {
                        return typeHeirarchy.classNode.propertyList[i];
                    }
                }
                typeHeirarchy = includeInheritedProperties ? typeHeirarchy.parent : null;
            }
            return null;
        };
        // returns this tree as a list
        TypeHeirarchy.prototype.flatten = function (result) {
            result = result || [];
            result.push(this);
            this.children.forEach(function (c) {
                c.flatten(result);
            });
            return result;
        };
        return TypeHeirarchy;
    }());
    CoolToJS.TypeHeirarchy = TypeHeirarchy;
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    // tracks which properties, methods, keywords, etc. are used in 
    // order to minimize the size of the output code
    var UsageRecord = /** @class */ (function () {
        function UsageRecord() {
            this.binaryOperations = [];
            this.unaryOperations = [];
            this.caseExpression = false;
        }
        return UsageRecord;
    }());
    CoolToJS.UsageRecord = UsageRecord;
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
                    completedCallback(coolPrograms.map(function (x) { return x.program; }));
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
        // adds the implied classes (Object, IO, Integer, etc.)
        // to our program node's class list
        function addBuiltinObjects(programNode) {
            // Object class
            var objectClass = new CoolToJS.ClassNode('Object');
            var abortMethodNode = new CoolToJS.MethodNode();
            abortMethodNode.methodName = 'abort';
            abortMethodNode.returnTypeName = 'Object';
            abortMethodNode.parent = objectClass;
            objectClass.children.push(abortMethodNode);
            var typeNameMethodNode = new CoolToJS.MethodNode();
            typeNameMethodNode.methodName = 'type_name';
            typeNameMethodNode.returnTypeName = 'String';
            typeNameMethodNode.parent = objectClass;
            objectClass.children.push(typeNameMethodNode);
            var copyMethodNode = new CoolToJS.MethodNode();
            copyMethodNode.methodName = 'copy';
            copyMethodNode.returnTypeName = 'SELF_TYPE';
            copyMethodNode.parent = objectClass;
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
            outStringMethodNode.parent = ioClass;
            ioClass.children.push(outStringMethodNode);
            var outIntMethodNode = new CoolToJS.MethodNode();
            outIntMethodNode.methodName = 'out_int';
            outIntMethodNode.returnTypeName = 'SELF_TYPE';
            outIntMethodNode.parameters.push({
                parameterName: 'x',
                parameterTypeName: 'Int'
            });
            outIntMethodNode.parent = ioClass;
            ioClass.children.push(outIntMethodNode);
            var inStringMethodNode = new CoolToJS.MethodNode();
            inStringMethodNode.methodName = 'in_string';
            inStringMethodNode.returnTypeName = 'String';
            inStringMethodNode.isAsync = true;
            inStringMethodNode.isInStringOrInInt = true;
            inStringMethodNode.parent = ioClass;
            ioClass.children.push(inStringMethodNode);
            var inIntMethodNode = new CoolToJS.MethodNode();
            inIntMethodNode.methodName = 'in_int';
            inIntMethodNode.returnTypeName = 'Int';
            inIntMethodNode.isAsync = true;
            inIntMethodNode.isInStringOrInInt = true;
            inIntMethodNode.parent = ioClass;
            ioClass.children.push(inIntMethodNode);
            programNode.children.push(ioClass);
            // Int
            var intClass = new CoolToJS.ClassNode('Int');
            programNode.children.push(intClass);
            // String
            var stringClass = new CoolToJS.ClassNode('String');
            var lengthMethodNode = new CoolToJS.MethodNode();
            lengthMethodNode.methodName = 'length';
            lengthMethodNode.returnTypeName = 'Int';
            lengthMethodNode.parent = stringClass;
            stringClass.children.push(lengthMethodNode);
            var concatMethodNode = new CoolToJS.MethodNode();
            concatMethodNode.methodName = 'concat';
            concatMethodNode.returnTypeName = 'String';
            concatMethodNode.parameters.push({
                parameterName: 's',
                parameterTypeName: 'String'
            });
            concatMethodNode.parent = stringClass;
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
            stringClass.parent = stringClass;
            stringClass.children.push(substrMethodNode);
            programNode.children.push(stringClass);
            // Bool
            var boolClass = new CoolToJS.ClassNode('Bool');
            programNode.children.push(boolClass);
        }
        Utility.addBuiltinObjects = addBuiltinObjects;
        function getFunctionDetails(func) {
            return {
                body: getFunctionBody(func),
                parameters: getFunctionParameters(func)
            };
        }
        Utility.getFunctionDetails = getFunctionDetails;
        function getFunctionBody(func) {
            return func.toString().slice(func.toString().indexOf("{") + 1, func.toString().lastIndexOf("}"));
        }
        Utility.getFunctionBody = getFunctionBody;
        var stripComments = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        var argumentNames = /([^\s,]+)/g;
        function getFunctionParameters(func) {
            var fnStr = func.toString().replace(stripComments, '');
            var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(argumentNames);
            if (result === null)
                result = [];
            return result;
        }
        Utility.getFunctionParameters = getFunctionParameters;
        var reserved = [
            'break', 'case', 'class', 'catch', 'const', 'continue', 'debugger', 'default', 'delete',
            'do', 'else', 'export', 'extends', 'finally', 'for', 'function', 'if', 'import', 'in',
            'instanceof', 'let', 'new', 'return', 'super', 'switch', 'this', 'throw', 'try', 'typeof',
            'var', 'void', 'while', 'with', 'yield', 'enum', 'await', 'implements', 'package', 'protected',
            'static', 'interface', 'private', 'public', 'abstract', 'boolean', 'byte', 'char', 'double',
            'final', 'float', 'goto', 'int', 'long', 'native', 'short', 'synchronized', 'transient',
            'volatile', 'null'
        ];
        function escapeIfReserved(id) {
            if (reserved.indexOf(id.toLowerCase()) !== -1) {
                return '__' + id;
            }
            else {
                return id;
            }
        }
        Utility.escapeIfReserved = escapeIfReserved;
        Utility.baseObjectClass = "\
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
        Utility.baseStringClass = '\
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
        Utility.baseIntClass = "\
class _Int extends _Object {\n\
    constructor (_intValue) {\n\
        super(\"Int\");\n\
        this._value = _intValue;\n\
    }\n\
    _value;\n\
}\n\n";
        Utility.baseBoolClass = "\
class _Bool extends _Object {\n\
    constructor (_boolValue) {\n\
        super(\"Bool\");\n\
        this._value = _boolValue;\n\
    }\n\
    _value;\n\
}\n\n";
        Utility.baseObjectClasses = [
            Utility.baseObjectClass, Utility.baseStringClass, Utility.baseIntClass, Utility.baseBoolClass
        ];
        Utility.binaryOperationFunctions = [
            { operation: CoolToJS.BinaryOperationType.Addition, func: '_add = (a, b) => { return new _Int(a._value + b._value); }' },
            { operation: CoolToJS.BinaryOperationType.Subtraction, func: '_subtract = (a, b) => { return new _Int(a._value - b._value); }' },
            { operation: CoolToJS.BinaryOperationType.Division, func: '_divide = (a, b) => { return new _Int(Math.floor(a._value / b._value)); }' },
            { operation: CoolToJS.BinaryOperationType.Multiplication, func: '_multiply = (a, b) => { return new _Int(a._value * b._value); }' },
            { operation: CoolToJS.BinaryOperationType.LessThan, func: '_lessThan = (a, b) => { return new _Bool(a._value < b._value); }' },
            { operation: CoolToJS.BinaryOperationType.LessThanOrEqualTo, func: '_lessThanOrEqualTo = (a, b) => { return new _Bool(a._value <= b._value); }' },
            { operation: CoolToJS.BinaryOperationType.Comparison, func: '_equals = (a, b) => {\n\        if (!a || !b || typeof a._value === "undefined" || typeof b._value === "undefined") {\n\            return new _Bool(a === b);\n\        } else {\n\            return new _Bool(a._value === b._value);\n\        }\n\    }' },
        ];
        Utility.unaryOperationFunctions = [
            { operation: CoolToJS.UnaryOperationType.Complement, func: '_complement = (a) => { return new _Int(-1 * a._value); }' },
            { operation: CoolToJS.UnaryOperationType.Not, func: '_not = (a) => { return new _Bool(!a._value); }' },
        ];
        Utility.getCaseFunction = function (isAsync) {
            if (isAsync) {
                var funcString = '_asyncCase = function *(obj, branches, thisObj, currentTypeName) {\n';
            }
            else {
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
            }
            else {
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
            }
            else {
                funcString += '            return eliminatedBranches[0][1].call(thisObj, obj);\n';
            }
            funcString += '\
        }\n\
    }';
            return funcString;
        };
    })(Utility = CoolToJS.Utility || (CoolToJS.Utility = {}));
})(CoolToJS || (CoolToJS = {}));
//# sourceMappingURL=cooltojs-1.0.1.js.map