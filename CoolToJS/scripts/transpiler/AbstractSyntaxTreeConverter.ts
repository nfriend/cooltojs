module CoolToJS {
    'use strict';

    export class AbstractSyntaxTreeConverter {

        public Convert = (parserOutput: ParserOutput): ASTConverterOutput => {
            return {
                success: true,
                abstractSyntaxTree: this.convert(parserOutput.syntaxTree),
                errorMessages: parserOutput.errorMessages,
                warningMessages: parserOutput.warningMessages
            }
        }

        private convert = (syntaxTree: SyntaxTree): Node => {
            var convertedNode: Node;

            // use a shallow copy of the provided tree so we
            // don't alter the original
            syntaxTree = Utility.ShallowCopySyntaxTree(syntaxTree);

            /* PROGRAM */
            if (syntaxTree.syntaxKind === SyntaxKind.Program) {
                this.flattenRecursion(syntaxTree);
                convertedNode = new ProgramNode();

                // create Class nodes for each class in this program
                for (var i = 0; i < syntaxTree.children.length; i++) {
                    if (syntaxTree.children[i].syntaxKind === SyntaxKind.Class) {
                        var childClassNode = this.convert(syntaxTree.children[i]);
                        childClassNode.parent = convertedNode;
                        convertedNode.children.push(childClassNode);
                    }
                }
            }

            /* CLASS */
            else if (syntaxTree.syntaxKind === SyntaxKind.Class) {
                var classNode = new ClassNode(syntaxTree.children[1].token.match);
                classNode.token = syntaxTree.children[1].token;
                if (syntaxTree.children[2].syntaxKind === SyntaxKind.InheritsKeyword) {
                    // if this class is a subclass
                    classNode.superClassName = syntaxTree.children[3].token.match;
                }

                // find the FeatureList child, and use its children to construct
                // this class's methods and properties
                for (var i = 0; i < syntaxTree.children.length; i++) {
                    if (syntaxTree.children[i].syntaxKind === SyntaxKind.FeatureList) {
                        this.flattenRecursion(syntaxTree.children[i]);
                        for (var j = 0; j < syntaxTree.children[i].children.length; j++) {
                            if (syntaxTree.children[i].children[j].syntaxKind === SyntaxKind.Feature) {
                                var childFeatureNode = this.convert(syntaxTree.children[i].children[j]);
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
            else if (syntaxTree.syntaxKind === SyntaxKind.Feature) {
                if (syntaxTree.children[1].syntaxKind === SyntaxKind.OpenParenthesis) {
                    // we should convert into a method

                    var methodNode = new MethodNode();
                    methodNode.methodName = syntaxTree.children[0].token.match;
                    methodNode.token = syntaxTree.children[0].token;

                    if (syntaxTree.children[2].syntaxKind === SyntaxKind.FormalList) {
                        // this method has at least one parameter
                        methodNode.returnTypeName = syntaxTree.children[5].token.match;
                        this.flattenRecursion(syntaxTree.children[2]);
                        for (var i = 0; i < syntaxTree.children[2].children.length; i++) {
                            if (syntaxTree.children[2].children[i].syntaxKind === SyntaxKind.Formal) {
                                methodNode.parameters.push({
                                    parameterName: syntaxTree.children[2].children[i].children[0].token.match,
                                    parameterTypeName: syntaxTree.children[2].children[i].children[2].token.match
                                });
                            }
                        }

                        // convert the method body
                        var methodBodyNode = this.convert(syntaxTree.children[7])
                        methodBodyNode.parent = methodNode;
                        methodNode.children.push(methodBodyNode);
                    } else {
                        // this method has no parameters
                        methodNode.returnTypeName = syntaxTree.children[4].token.match;

                        // convert the method body
                        var methodBodyNode = this.convert(syntaxTree.children[6])
                        methodBodyNode.parent = methodNode;
                        methodNode.children.push(methodBodyNode);
                    }

                    convertedNode = methodNode;
                } else if (syntaxTree.children[1].syntaxKind === SyntaxKind.Colon) {
                    // we should convert into a property

                    var propertyNode = new PropertyNode();
                    propertyNode.propertyName = syntaxTree.children[0].token.match;
                    propertyNode.token = syntaxTree.children[0].token;
                    propertyNode.typeName = syntaxTree.children[2].token.match;

                    if (syntaxTree.children[4]) {
                        // if this property has an initializer

                        // convert the property initializer
                        var propertyInitializerNode = this.convert(syntaxTree.children[4])
                        propertyInitializerNode.parent = propertyNode;
                        propertyNode.children.push(propertyInitializerNode);
                    }

                    convertedNode = propertyNode;
                } else {
                    throw 'Unexpected SyntaxKind: second child of a Feature should either be a ( or a :';
                }
            }

            /* EXPRESSION */
            else if (syntaxTree.syntaxKind === SyntaxKind.Expression) {

                /* ASSIGNMENT EXPRESSION */
                if (syntaxTree.children[1] && syntaxTree.children[1].syntaxKind === SyntaxKind.AssignmentOperator) {
                    var assignmentExprNode = new AssignmentExpressionNode();
                    assignmentExprNode.identifierName = syntaxTree.children[0].token.match;
                    
                    var assignmentExpression = this.convert(syntaxTree.children[2]);
                    assignmentExpression.parent = assignmentExprNode;
                    assignmentExprNode.children.push(assignmentExpression);
                    convertedNode = assignmentExprNode;
                }

                /* METHOD CALL EXPRESSION */
                else if (syntaxTree.children[1]
                    && (syntaxTree.children[1].syntaxKind === SyntaxKind.DotOperator
                        || syntaxTree.children[1].syntaxKind === SyntaxKind.AtSignOperator
                        || (syntaxTree.children[0].syntaxKind === SyntaxKind.ObjectIdentifier
                            && syntaxTree.children[1].syntaxKind === SyntaxKind.OpenParenthesis))) {

                    var methodCallExprNode = new MethodCallExpressionNode(),
                        expressionListIndex: number;

                    if (syntaxTree.children[1].syntaxKind === SyntaxKind.DotOperator) {
                        // standard method call on an expression

                        methodCallExprNode.methodName = syntaxTree.children[2].token.match;
                        methodCallExprNode.token = syntaxTree.children[2].token;
                        expressionListIndex = 4;

                    } else if (syntaxTree.children[1].syntaxKind === SyntaxKind.AtSignOperator) {
                        // method call to parent class
                        methodCallExprNode.methodName = syntaxTree.children[4].token.match;
                        methodCallExprNode.token = syntaxTree.children[4].token;
                        methodCallExprNode.isCallToParent = true;
                        expressionListIndex = 6;

                    } else if (syntaxTree.children[1].syntaxKind === SyntaxKind.OpenParenthesis) {
                        // method call to implied "self"

                        methodCallExprNode.methodName = syntaxTree.children[0].token.match;
                        methodCallExprNode.token = syntaxTree.children[0].token;
                        methodCallExprNode.isCallToSelf = true;
                        expressionListIndex = 2;
                    }

                    if (syntaxTree.children[expressionListIndex].syntaxKind === SyntaxKind.ExpressionList) {
                        this.flattenRecursion(syntaxTree.children[expressionListIndex]);

                        for (var i = 0; i < syntaxTree.children[expressionListIndex].children.length; i++) {
                            if (syntaxTree.children[expressionListIndex].children[i].syntaxKind === SyntaxKind.Expression) {
                                var parameterExprNode = this.convert(syntaxTree.children[expressionListIndex].children[i]);
                                parameterExprNode.parent = methodCallExprNode;
                                methodCallExprNode.children.push(parameterExprNode);
                            }
                        }
                    }

                    convertedNode = methodCallExprNode;
                }

                /* IF/THEN/ELSE EXPRESSION */
                else if (syntaxTree.children[0].syntaxKind === SyntaxKind.IfKeyword) {
                    var ifThenElseExprNode = new IfThenElseExpressionNode();

                    var predicateNode = this.convert(syntaxTree.children[1]);
                    ifThenElseExprNode.children[0] = predicateNode;
                    var consequentNode = this.convert(syntaxTree.children[3]);
                    ifThenElseExprNode.children[1] = consequentNode;
                    var alternativeNode = this.convert(syntaxTree.children[5]);
                    ifThenElseExprNode.children[2] = alternativeNode;

                    predicateNode.parent = ifThenElseExprNode;
                    consequentNode.parent = ifThenElseExprNode;
                    alternativeNode.parent = ifThenElseExprNode;

                    convertedNode = ifThenElseExprNode;
                }

                /* WHILE EXPRESSION */
                else if (syntaxTree.children[0].syntaxKind === SyntaxKind.WhileKeyword) {
                    var whileExprNode = new WhileExpressionNode();

                    var conditionNode = this.convert(syntaxTree.children[1]);
                    whileExprNode.children[0] = conditionNode;
                    var bodyExpressionNode = this.convert(syntaxTree.children[3]);
                    whileExprNode.children[1] = bodyExpressionNode;

                    conditionNode.parent = whileExprNode;
                    bodyExpressionNode.parent = whileExprNode;

                    convertedNode = whileExprNode;
                }

                /* BLOCK EXPRESSION */
                else if (syntaxTree.children[0].syntaxKind === SyntaxKind.OpenCurlyBracket) {
                    var blockExpressionNode = new BlockExpressionNode();

                    this.flattenRecursion(syntaxTree.children[1]);
                    for (var i = 0; i < syntaxTree.children[1].children.length; i++) {
                        if (syntaxTree.children[1].children[i].syntaxKind === SyntaxKind.Expression) {
                            var childExpressionNode = this.convert(syntaxTree.children[1].children[i]);
                            childExpressionNode.parent = blockExpressionNode;
                            blockExpressionNode.children.push(childExpressionNode);
                        }
                    }

                    convertedNode = blockExpressionNode;
                }

                /* LET EXPRESSION */
                else if (syntaxTree.children[0].syntaxKind === SyntaxKind.LetKeyword) {
                    var letExpressionNode = new LetExpressionNode();

                    this.flattenRecursion(syntaxTree.children[1]);
                    for (var i = 0; i < syntaxTree.children[1].children.length; i++) {
                        if (syntaxTree.children[1].children[i].syntaxKind === SyntaxKind.ObjectIdentifier) {
                            var localVarDeclaration = new LocalVariableDeclarationNode();
                            localVarDeclaration.identifierName = syntaxTree.children[1].children[i].token.match;
                            localVarDeclaration.typeName = syntaxTree.children[1].children[i + 2].token.match;

                            if (syntaxTree.children[1].children[i + 3]
                                && syntaxTree.children[1].children[i + 3].syntaxKind == SyntaxKind.AssignmentOperator) {

                                var localVarDeclInitExprNode = this.convert(syntaxTree.children[1].children[i + 4]);
                                localVarDeclInitExprNode.parent = localVarDeclaration;

                                // Why are getters/setters not working?
                                //localVarDeclaration.initializerExpression = localVarDeclInitExprNode;
                                localVarDeclaration.children[0] = localVarDeclInitExprNode;

                            }

                            localVarDeclaration.parent = letExpressionNode;
                            letExpressionNode.localVariableDeclarations.push(localVarDeclaration);
                        }
                    }

                    var expressionBodyNode = this.convert(syntaxTree.children[3]);
                    expressionBodyNode.parent = letExpressionNode;
                    letExpressionNode.children.push(expressionBodyNode);

                    convertedNode = letExpressionNode;
                }

                /* CASE EXPRESSION */
                else if (syntaxTree.children[0].syntaxKind === SyntaxKind.CaseKeyword) {
                    var caseExpressionNode = new CaseExpressionNode();
                    this.flattenRecursion(syntaxTree.children[3]);
                    for (var i = 0; i < syntaxTree.children[3].children.length; i++) {
                        if (syntaxTree.children[3].children[i].syntaxKind === SyntaxKind.ObjectIdentifier) {
                            var caseOptionNode = new CaseOptionNode();
                            caseOptionNode.identiferName = syntaxTree.children[3].children[i].token.match;
                            caseOptionNode.typeName = syntaxTree.children[3].children[i + 2].token.match;

                            var caseOptionExpressionNode = this.convert(syntaxTree.children[3].children[i + 4]);
                            caseOptionExpressionNode.parent = caseOptionNode;
                            caseOptionNode.children[0] = caseOptionExpressionNode;

                            caseOptionNode.parent = caseExpressionNode;
                            caseExpressionNode.caseOptionList.push(caseOptionNode);
                        }
                    }

                    var caseConditionNode = this.convert(syntaxTree.children[1]);
                    caseConditionNode.parent = caseExpressionNode;
                    caseExpressionNode.condition = caseConditionNode;

                    convertedNode = caseExpressionNode;
                }

                /* NEW EXPRESSION */
                else if (syntaxTree.children[0].syntaxKind === SyntaxKind.NewKeyword) {
                    var newExpressionNode = new NewExpressionNode();
                    newExpressionNode.typeName = syntaxTree.children[1].token.match;
                    convertedNode = newExpressionNode;
                }

                /* ISVOID EXPRESSION */
                else if (syntaxTree.children[0].syntaxKind === SyntaxKind.IsvoidKeyword) {
                    var isVoidExpressionNode = new IsVoidExpressionNode();
                    var isVoidConditionNode = this.convert(syntaxTree.children[1]);
                    isVoidExpressionNode.parent = isVoidExpressionNode;
                    isVoidExpressionNode.children[0] = isVoidConditionNode;
                    convertedNode = isVoidExpressionNode;
                }

                /* BINARY OPERATION EXPRESSION */
                else if (syntaxTree.children[1] && this.isBinaryOperator(syntaxTree.children[1])) {
                    var binaryOperationExprNode = new BinaryOperationExpressionNode();

                    switch (syntaxTree.children[1].syntaxKind) {
                        case SyntaxKind.AdditionOperator:
                            binaryOperationExprNode.operationType = BinaryOperationType.Addition;
                            break;
                        case SyntaxKind.SubtractionOperator:
                            binaryOperationExprNode.operationType = BinaryOperationType.Subtraction;
                            break;
                        case SyntaxKind.MultiplationOperator:
                            binaryOperationExprNode.operationType = BinaryOperationType.Multiplication;
                            break;
                        case SyntaxKind.DivisionOperator:
                            binaryOperationExprNode.operationType = BinaryOperationType.Division;
                            break;
                        case SyntaxKind.LessThanOperator:
                            binaryOperationExprNode.operationType = BinaryOperationType.LessThan;
                            break;
                        case SyntaxKind.LessThanOrEqualsOperator:
                            binaryOperationExprNode.operationType = BinaryOperationType.LessThanOrEqualTo;
                            break;
                        case SyntaxKind.EqualsOperator:
                            binaryOperationExprNode.operationType = BinaryOperationType.Comparison;
                            break;
                        default:
                            throw 'Unknown BinaryOperationType';
                    }

                    var operand1Node = this.convert(syntaxTree.children[0]);
                    operand1Node.parent = binaryOperationExprNode;
                    var operand2Node = this.convert(syntaxTree.children[0]);
                    operand2Node.parent = binaryOperationExprNode;

                    binaryOperationExprNode.children[0] = operand1Node;
                    binaryOperationExprNode.children[1] = operand2Node;

                    convertedNode = binaryOperationExprNode;
                }

                /* UNARY OPERATION EXPRESSION */
                else if (syntaxTree.children[0].syntaxKind === SyntaxKind.TildeOperator) {
                    var unaryOperationExprNode = new UnaryOperationExpressionNode();
                    var operandNode = this.convert(syntaxTree.children[1]);
                    operandNode.parent = unaryOperationExprNode;
                    unaryOperationExprNode.children[0] = operandNode;
                    convertedNode = unaryOperationExprNode;
                }

                /* UNARY OPERATION EXPRESSION */
                else if (syntaxTree.children[0].syntaxKind === SyntaxKind.TildeOperator
                    || syntaxTree.children[0].syntaxKind === SyntaxKind.NotKeyword) {

                    var unaryOperationExprNode = new UnaryOperationExpressionNode();
                    if (syntaxTree.children[0].syntaxKind === SyntaxKind.TildeOperator) {
                        unaryOperationExprNode.operationType = UnaryOperationType.Complement;
                    } else if (syntaxTree.children[0].syntaxKind === SyntaxKind.NotKeyword) {
                        unaryOperationExprNode.operationType = UnaryOperationType.Not;
                    } else {
                        throw 'Unknown UnaryOperationType';
                    }

                    var operandNode = this.convert(syntaxTree.children[1]);
                    operandNode.parent = unaryOperationExprNode;
                    unaryOperationExprNode.children[0] = operandNode;
                    convertedNode = unaryOperationExprNode;
                }

                /* UNARY OPERATION EXPRESSION */
                else if (syntaxTree.children[0].syntaxKind === SyntaxKind.OpenParenthesis) {
                    var parExprNod = new ParantheticalExpressionNode();
                    var innerExprNode = this.convert(syntaxTree.children[1]);
                    innerExprNode.parent = parExprNod;
                    parExprNod.children[0] = innerExprNode;
                    convertedNode = parExprNod;
                }

                /* OBJECT IDENTIFIER EXPRESSION */
                else if (syntaxTree.children[0].syntaxKind === SyntaxKind.ObjectIdentifier && syntaxTree.children.length === 1) {
                    var objIdentExprNode = new ObjectIdentifierExpressionNode();
                    objIdentExprNode.objectIdentifierName = syntaxTree.children[0].token.match;
                    convertedNode = objIdentExprNode;
                }

                /* INTEGER LITERAL EXPRESSION */
                else if (syntaxTree.children[0].syntaxKind === SyntaxKind.Integer) {
                    var intLiteralExprNode = new IntegerLiteralExpressionNode();
                    intLiteralExprNode.value = parseInt(syntaxTree.children[0].token.match, 10);
                    convertedNode = intLiteralExprNode;
                }

                /* STRING LITERAL EXPRESSION */
                else if (syntaxTree.children[0].syntaxKind === SyntaxKind.String) {
                    var stringLiteralExprNode = new StringLiteralExpressionNode();
                    // TODO: remove quotes
                    stringLiteralExprNode.value = syntaxTree.children[0].token.match;
                    convertedNode = stringLiteralExprNode;
                }

                /* TRUE KEYWORD EXPRESSION */
                else if (syntaxTree.children[0].syntaxKind === SyntaxKind.TrueKeyword) {
                    var trueKeywordExprNode = new TrueKeywordExpressionNode();
                    convertedNode = trueKeywordExprNode;
                }

                /* FALSE KEYWORD EXPRESSION */
                else if (syntaxTree.children[0].syntaxKind === SyntaxKind.FalseKeyword) {
                    var falseKeywordExprNode = new FalseKeywordExpressionNode();
                    convertedNode = falseKeywordExprNode;
                }
            }

            /* ERROR */
            else {
                throw 'Unknown syntaxTree kind!';
            }

            return convertedNode;
        }

        private flattenRecursion(syntaxTree: SyntaxTree): void {
            for (var i = 0; i < syntaxTree.children.length; i++) {
                if (syntaxTree.children[i].syntaxKind === syntaxTree.syntaxKind) {
                    // replace the node with its children
                    syntaxTree.children.splice.apply(syntaxTree.children, [i, 1].concat(<any>syntaxTree.children[i].children))
                }
            }
        }

        private isBinaryOperator(syntaxTree: SyntaxTree): boolean {
            return (syntaxTree.syntaxKind === SyntaxKind.AdditionOperator
                || syntaxTree.syntaxKind === SyntaxKind.SubtractionOperator
                || syntaxTree.syntaxKind === SyntaxKind.MultiplationOperator
                || syntaxTree.syntaxKind === SyntaxKind.DivisionOperator
                || syntaxTree.syntaxKind === SyntaxKind.LessThanOperator
                || syntaxTree.syntaxKind === SyntaxKind.LessThanOrEqualsOperator
                || syntaxTree.syntaxKind === SyntaxKind.EqualsOperator);
        }
    }
} 