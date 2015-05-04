module CoolToJS {
    export class SemanticAnalyzer {
        Analyze = (astConvertOutput: ASTConverterOutput): SemanticAnalyzerOutput => {
            var errorMessages = astConvertOutput.errorMessages || [];
            var warningMessages = astConvertOutput.warningMessages || [];
            var starterTypeEnvironment: TypeEnvironment = {
                currentClassType: null,
                variableScope: [],
                methodScope: []
            }
            this.analyze(astConvertOutput.abstractSyntaxTree, starterTypeEnvironment, errorMessages, warningMessages);

            return {
                success: errorMessages.length === 0,
                abstractSyntaxTree: astConvertOutput.abstractSyntaxTree,
                errorMessages: errorMessages,
                warningMessages: warningMessages
            }
        };

        typeHeirarchy: TypeHeirarchy;

        // analyzes the current node and returns the inferred type name (if applicable)
        analyze = (ast: Node,
            typeEnvironment: TypeEnvironment,
            errorMessages: Array<ErrorMessage>,
            warningMessages: Array<WarningMessage>): string => {

            /* PROGRAM */
            if (ast.type === NodeType.Program) {
                var programNode = <ProgramNode>ast;

                // ensure that exactly 1 Main class is defined and that all class names are unique
                var mainClass: ClassNode;
                var duplicateClasses: Array<ClassNode> = [];
                for (var i = 0; i < programNode.classList.length; i++) {
                    if (!mainClass && programNode.classList[i].className === 'Main') {
                        mainClass = programNode.classList[i];
                    }

                    if (programNode.classList.map(c => { return c.className }).slice(0, i).indexOf(programNode.classList[i].className) !== -1) {
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

                duplicateClasses.forEach((classNode) => {
                    errorMessages.push({
                        location: classNode.token.location,
                        message: 'Class "' + classNode.className + '" was previously defined'
                    });
                });

                // ensure that at least one main() method is defined in class Main and 
                // that it takes no parameters
                if (mainClass) {
                    var mainMethod: MethodNode;
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
                    } else if (mainMethod.hasParameters) {
                        errorMessages.push({
                            location: mainMethod.token.location,
                            message: '"main" method in class "Main" should have no arguments'
                        });
                    }
                }

                Utility.addBuiltinObjects(programNode);
                this.typeHeirarchy = TypeHeirarchy.createHeirarchy(programNode);

                // ensure that superclasses exist
                programNode.classList.forEach(classNode => {
                    if (classNode.superClassName && !this.typeHeirarchy.typeExists(classNode.superClassName)) {
                        errorMessages.push({
                            location: classNode.token.location,
                            message: 'Inherited type "' + classNode.superClassName + '" does not exist'
                        });
                    }
                });

                ast.children.forEach(node => {
                    if (['String', 'Int', 'Bool', 'Object', 'IO'].indexOf((<ClassNode>node).className) === -1) {
                        this.analyze(node, typeEnvironment, errorMessages, warningMessages);
                    }
                });
            }

            /* CLASS */
            else if (ast.type === NodeType.Class) {
                var classNode = <ClassNode>ast;
                typeEnvironment.currentClassType = classNode.className;
                typeEnvironment.variableScope = [];

                // ensure that all method names are unique
                var duplicateMethods: Array<MethodNode> = [];
                for (var i = 0; i < classNode.methodList.length; i++) {
                    if (classNode.methodList.map(c => { return c.methodName }).slice(0, i).indexOf(classNode.methodList[i].methodName) !== -1) {
                        duplicateMethods.push(classNode.methodList[i]);
                    }
                }

                duplicateMethods.forEach((methodNode) => {
                    errorMessages.push({
                        location: methodNode.token.location,
                        message: 'Method "' + methodNode.methodName + '" is multiply defined in class "' + classNode.className + '"'
                    });
                });

                // add all superclass properties to the scope
                var addedSuperClassProperties: Array<VariableScope> = [];
                var parentTypeHeirarchy = this.typeHeirarchy.findTypeHeirarchy(classNode.className).parent;
                while (parentTypeHeirarchy) {
                    parentTypeHeirarchy.classNode.propertyList.forEach(pn => {
                        addedSuperClassProperties.push({
                            variableName: pn.propertyName,
                            variableType: pn.typeName
                        });
                    });
                    parentTypeHeirarchy = parentTypeHeirarchy.parent;
                }

                // add the properties to the stack in reverse order so that the closest
                // properties to the current scope are at the top of the stack
                typeEnvironment.variableScope = typeEnvironment.variableScope.concat(addedSuperClassProperties.reverse());

                // ensure that all property names are unique
                var duplicateProperties: Array<PropertyNode> = [];
                for (var i = 0; i < classNode.propertyList.length; i++) {
                    if (classNode.propertyList.map(c => { return c.propertyName }).slice(0, i).indexOf(classNode.propertyList[i].propertyName) !== -1) {
                        duplicateProperties.push(classNode.propertyList[i]);
                    } else {
                        typeEnvironment.variableScope.push({
                            variableName: classNode.propertyList[i].propertyName,
                            variableType: classNode.propertyList[i].typeName
                        });
                    }
                }

                duplicateProperties.forEach((propertyNode) => {
                    errorMessages.push({
                        location: propertyNode.token.location,
                        message: 'Property "' + propertyNode.propertyName + '" is multiply defined in class "' + classNode.className + '"'
                    });
                });

                ast.children.forEach(node => {
                    this.analyze(node, typeEnvironment, errorMessages, warningMessages);
                });
            }

            /* CLASS PROPERTY */
            else if (ast.type === NodeType.Property) {
                var propertyNode = <PropertyNode>ast;
                if (propertyNode.hasInitializer) {
                    var initializerType = this.analyze(propertyNode.propertyInitializerExpression, typeEnvironment, errorMessages, warningMessages);
                    if (!this.typeHeirarchy.isAssignableFrom(propertyNode.typeName, initializerType, typeEnvironment.currentClassType)) {
                        this.addTypeError(propertyNode.typeName, initializerType, propertyNode.token.location, errorMessages);
                    }
                }
            }

            /* CLASS METHOD */
            else if (ast.type === NodeType.Method) {
                var methodNode = <MethodNode>ast;

                // add method parameters to the current scope
                methodNode.parameters.forEach(param => {
                    typeEnvironment.variableScope.push({
                        variableName: param.parameterName,
                        variableType: param.parameterTypeName
                    });
                });

                var methodReturnType = this.analyze(methodNode.methodBodyExpression, typeEnvironment, errorMessages, warningMessages);

                // remove the added variables from the scope
                typeEnvironment.variableScope.splice(typeEnvironment.variableScope.length - methodNode.parameters.length, methodNode.parameters.length);

                if (!this.typeHeirarchy.isAssignableFrom(methodNode.returnTypeName, methodReturnType, typeEnvironment.currentClassType)) {
                    errorMessages.push({
                        location: methodNode.token.location,
                        message: 'Return type "' + methodReturnType + '" of method "' + methodNode.methodName + '" is not assignable to the declared type of "' + methodNode.returnTypeName + '"'
                    });
                }
            }

            /* ASSIGNMENT EXPRESSION */
            else if (ast.type === NodeType.AssignmentExpression) {
                var assignmentExpressionNode = <AssignmentExpressionNode>ast;
                for (var i = typeEnvironment.variableScope.length - 1; i >= 0; i--) {
                    if (typeEnvironment.variableScope[i].variableName === assignmentExpressionNode.identifierName) {
                        var expressionType = this.analyze(assignmentExpressionNode.assignmentExpression, typeEnvironment, errorMessages, warningMessages);

                        if (!this.typeHeirarchy.isAssignableFrom(typeEnvironment.variableScope[i].variableType, expressionType, typeEnvironment.currentClassType)) {
                            this.addTypeError(typeEnvironment.variableScope[i].variableType, expressionType, assignmentExpressionNode.token.location, errorMessages);
                        }

                        return expressionType;
                    }
                }

                errorMessages.push({
                    location: assignmentExpressionNode.token.location,
                    message: 'Assignment to undeclared variable "' + assignmentExpressionNode.identifierName + '"'
                });

                return UnknownType;
            }

            /* METHOD CALL EXPRESSION */
            else if (ast.type === NodeType.MethodCallExpression) {
                var methodCallExpressionNode = <MethodCallExpressionNode>ast,
                    methodTargetType: string;

                if (!methodCallExpressionNode.isCallToParent && !methodCallExpressionNode.isCallToSelf) {
                    methodTargetType = this.analyze(methodCallExpressionNode.targetExpression, typeEnvironment, errorMessages, warningMessages);
                } else if (!methodCallExpressionNode.isCallToParent) {
                    methodTargetType = typeEnvironment.currentClassType;
                } else if (!methodCallExpressionNode.isCallToSelf) {
                    methodTargetType = methodCallExpressionNode.explicitParentCallTypeName;
                } else {
                    throw 'MethodCallExpressionNode should not have both isCallToParent = true AND isCallToSelf = true';
                }

                var foundMethodNode = this.typeHeirarchy.findMethodOnType(methodCallExpressionNode.methodName, methodTargetType, !methodCallExpressionNode.isCallToParent);

                if (foundMethodNode) {
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

                    var parameterTypes: Array<string> = methodCallExpressionNode.parameterExpressionList.map((exprNode) => {
                        return this.analyze(exprNode, typeEnvironment, errorMessages, warningMessages);
                    });

                    foundMethodNode.parameters.forEach((param, paramIndex) => {
                        if (parameterTypes[paramIndex]
                            && !this.typeHeirarchy.isAssignableFrom(param.parameterTypeName,
                                parameterTypes[paramIndex],
                                typeEnvironment.currentClassType)) {

                            errorMessages.push({
                                location: methodCallExpressionNode.token.location,
                                message: ('Parameter ' + (paramIndex + 1) + ' of method "' + methodCallExpressionNode.methodName
                                    + '" must be of type "' + param.parameterTypeName + '".  '
                                    + 'A parameter of type "' + parameterTypes[paramIndex] + '" was provided instead')
                            });
                        }
                    });

                    if (foundMethodNode.returnTypeName === 'SELF_TYPE') {
                        return methodTargetType;
                    } else {
                        return foundMethodNode.returnTypeName;
                    }
                }

                errorMessages.push({
                    location: methodCallExpressionNode.token.location,
                    message: 'Method "' + methodCallExpressionNode.methodName + '" does not exist on type "' + methodTargetType + '"'
                });

                return UnknownType;
            }

            /* IF/THEN/ELSE EXPRESSION */
            else if (ast.type === NodeType.IfThenElseExpression) {
                var ifThenElseNode = <IfThenElseExpressionNode>ast;
                var predicateType = this.analyze(ifThenElseNode.predicate, typeEnvironment, errorMessages, warningMessages);
                if (!this.typeHeirarchy.isAssignableFrom('Bool', predicateType, typeEnvironment.currentClassType)) {
                    errorMessages.push({
                        location: ifThenElseNode.token.location,
                        message: 'The condition expression of an "if" statement must return a "Bool"'
                    });
                }
                var consequentType = this.analyze(ifThenElseNode.consequent, typeEnvironment, errorMessages, warningMessages);
                var alternativeType = this.analyze(ifThenElseNode.alternative, typeEnvironment, errorMessages, warningMessages);

                var closestCommonType = this.typeHeirarchy.closetCommonParent(consequentType, alternativeType);
                return closestCommonType;
            }

            /* WHILE EXPRESSION */
            else if (ast.type === NodeType.WhileExpression) {
                var whileExpressionNode = <WhileExpressionNode>ast;
                var predicateType = this.analyze(whileExpressionNode.whileConditionExpression, typeEnvironment, errorMessages, warningMessages);
                if (!this.typeHeirarchy.isAssignableFrom('Bool', predicateType, typeEnvironment.currentClassType)) {
                    errorMessages.push({
                        location: whileExpressionNode.token.location,
                        message: 'The condition expression of a "while" statement must return a "Bool"'
                    });
                }

                return 'Object';
            }

            /* BLOCK EXPRESSION */
            else if (ast.type === NodeType.BlockExpression) {
                var blockExpressionNode = <BlockExpressionNode>ast;
                var returnType: string;
                blockExpressionNode.expressionList.forEach(expressionNode => {
                    returnType = this.analyze(expressionNode, typeEnvironment, errorMessages, warningMessages);
                });
                return returnType;
            }

            /* LET EXPRESSION */
            else if (ast.type === NodeType.LetExpression) {
                var letExpressionNode = <LetExpressionNode>ast;

                // add the new variables to the scope
                letExpressionNode.localVariableDeclarations.forEach(varDeclarationNode => {
                    typeEnvironment.variableScope.push({
                        variableName: varDeclarationNode.identifierName,
                        variableType: varDeclarationNode.typeName
                    });
                    this.analyze(varDeclarationNode, typeEnvironment, errorMessages, warningMessages);
                });
                var returnType = this.analyze(letExpressionNode.letBodyExpression, typeEnvironment, errorMessages, warningMessages);

                // remove the added variables from the scope
                typeEnvironment.variableScope.splice(
                    typeEnvironment.variableScope.length - letExpressionNode.localVariableDeclarations.length,
                    letExpressionNode.localVariableDeclarations.length);

                return returnType;
            }

            /* LOCAL VARIABLE DECLARAION */
            else if (ast.type === NodeType.LocalVariableDeclaration) {
                var lvdNode = <LocalVariableDeclarationNode>ast;
                if (lvdNode.initializerExpression) {
                    var initializerType = this.analyze(lvdNode.initializerExpression, typeEnvironment, errorMessages, warningMessages);
                    if (!this.typeHeirarchy.isAssignableFrom(lvdNode.typeName, initializerType, typeEnvironment.currentClassType)) {
                        this.addTypeError(lvdNode.typeName, initializerType, lvdNode.token.location, errorMessages);
                    }
                }
            }

            /* CASE EXPRESSION */
            else if (ast.type === NodeType.CaseExpression) {
                var caseExpressionNode = <CaseExpressionNode>ast;
                var caseOptionTypes = caseExpressionNode.caseOptionList.map(co => {

                    typeEnvironment.variableScope.push({
                        variableName: co.identiferName,
                        variableType: co.typeName
                    });

                    return this.analyze(co.caseOptionExpression, typeEnvironment, errorMessages, warningMessages);

                    typeEnvironment.variableScope.pop();
                });

                while (caseOptionTypes.length > 1) {
                    var commonParent = this.typeHeirarchy.closetCommonParent(caseOptionTypes[0], caseOptionTypes[1]);
                    caseOptionTypes.splice(0, 2, commonParent);
                }

                return caseOptionTypes[0];
            }

            /* CASE OPTION */
            else if (ast.type === NodeType.CaseOption) {
                throw 'Analysis of Case Option nodes happens inside of the Case Expression block.  We should never be here.'
            }

            /* NEW EXPRESSION */
            else if (ast.type === NodeType.NewExpression) {
                var newExpressionNode = <NewExpressionNode>ast;
                return newExpressionNode.typeName;
            }

            /* ISVOID EXPRESSION */
            else if (ast.type === NodeType.IsvoidExpression) {
                this.analyze((<IsVoidExpressionNode>ast).isVoidCondition, typeEnvironment, errorMessages, warningMessages);
                return 'Bool';
            }

            /* BINARY OPERATION EXPRESSION */
            else if (ast.type === NodeType.BinaryOperationExpression) {
                var binOpNode = <BinaryOperationExpressionNode>ast;
                var leftSideType = this.analyze(binOpNode.operand1, typeEnvironment, errorMessages, warningMessages);
                var rightSideType = this.analyze(binOpNode.operand2, typeEnvironment, errorMessages, warningMessages);

                if (binOpNode.operationType !== BinaryOperationType.Comparison) {
                    if (!this.typeHeirarchy.isAssignableFrom('Int', leftSideType, typeEnvironment.currentClassType)) {
                        errorMessages.push({
                            location: binOpNode.token.location,
                            message: 'Left side of the "' + binOpNode.token.match + '" operator must be of type "Int"'
                        });
                    }

                    if (!this.typeHeirarchy.isAssignableFrom('Int', rightSideType, typeEnvironment.currentClassType)) {
                        errorMessages.push({
                            location: binOpNode.token.location,
                            message: 'Right side of the "' + binOpNode.token.match + '" operator must be of type "Int"'
                        });
                    }
                    
                    if (binOpNode.operationType === BinaryOperationType.LessThanOrEqualTo
                        || binOpNode.operationType === BinaryOperationType.LessThan) {

                        return 'Bool';
                    } else {
                        return 'Int';
                    }

                } else {
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
            else if (ast.type === NodeType.UnaryOperationExpression) {
                var unaryOpNode = <UnaryOperationExpressionNode>ast;
                var unaryOperationType = this.analyze(unaryOpNode.operand, typeEnvironment, errorMessages, warningMessages);

                if (unaryOpNode.operationType === UnaryOperationType.Not) {
                    if (!this.typeHeirarchy.isAssignableFrom('Bool', unaryOperationType, typeEnvironment.currentClassType)) {
                        errorMessages.push({
                            location: unaryOpNode.token.location,
                            message: 'Expression following the "Not" operator must be of type "Bool"'
                        });
                    }

                    return 'Bool';
                } else {
                    if (!this.typeHeirarchy.isAssignableFrom('Int', unaryOperationType, typeEnvironment.currentClassType)) {
                        errorMessages.push({
                            location: unaryOpNode.token.location,
                            message: 'Expression following the "~" operator must be of type "Int"'
                        });
                    }

                    return 'Int';
                }
            }

            /* PARANTHETICAL EXPRESSION */
            else if (ast.type === NodeType.ParantheticalExpression) {
                return this.analyze((<ParantheticalExpressionNode>ast).innerExpression, typeEnvironment, errorMessages, warningMessages);
            }

            /* SELF EXPRESSION */
            else if (ast.type === NodeType.SelfExpression) {
                return typeEnvironment.currentClassType;
            }

            /* OBJECT IDENTIFIER EXPRESSION */
            else if (ast.type === NodeType.ObjectIdentifierExpression) {
                var objectIdExpressionNode = <ObjectIdentifierExpressionNode>ast;

                for (var i = typeEnvironment.variableScope.length - 1; i >= 0; i--) {
                    if (typeEnvironment.variableScope[i].variableName === objectIdExpressionNode.objectIdentifierName) {
                        return typeEnvironment.variableScope[i].variableType;
                    }
                }

                errorMessages.push({
                    location: objectIdExpressionNode.token.location,
                    message: 'Undeclared variable "' + objectIdExpressionNode.objectIdentifierName + '"'
                });

                return UnknownType;
            }

            /* INTEGER LITERAL */
            else if (ast.type === NodeType.IntegerLiteralExpression) {
                return 'Int';
            }

            /* STRING LITERAL */
            else if (ast.type === NodeType.StringLiteralExpression) {
                return 'String';
            }

            /* BOOL LITERAL */
            else if (ast.type === NodeType.TrueKeywordExpression || ast.type === NodeType.FalseKeywordExpression) {
                return 'Bool';
            }

            else throw "Unrecognized Abstract Syntax Tree type!";
        }

        private addTypeError(type1Name: string, type2Name: string, location: SourceLocation, errorMessages: Array<ErrorMessage>) {
            errorMessages.push({
                location: location,
                message: 'Type "' + type2Name + '" is not assignable to type "' + type1Name + '"'
            });
        }
    }

    interface TypeEnvironment {
        currentClassType: string;
        variableScope: Array<VariableScope>;
    }

    interface VariableScope {
        variableName: string;
        variableType: string
    }
}