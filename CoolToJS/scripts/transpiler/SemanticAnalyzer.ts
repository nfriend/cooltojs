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
                errorMessages: errorMessages,
                warningMessages: warningMessages
            }
        };

        // analyzes the current node and returns the inferred type name (if applicable)
        analyze = (ast: Node,
            typeEnvironment: TypeEnvironment,
            errorMessages: Array<ErrorMessage>,
            warningMessages: Array<WarningMessage>): string => {

            /* PROGRAM */
            if (ast.type === NodeType.Program) {
                var programNode = <ProgramNode>ast;

                this.addBuiltinObjects(programNode);
                this.buildInheritanceGraph(programNode);

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

                ast.children.forEach(node => {
                    this.analyze(node, typeEnvironment, errorMessages, warningMessages);
                });
            }

            /* CLASS */
            else if (ast.type === NodeType.Class) {
                var classNode = <ClassNode>ast;
                typeEnvironment.currentClassType = classNode.className;
                typeEnvironment.methodScope = [];

                // add this class's superclass's methods to the methodscope
                var superClass = this.findTypeHeirarchy(classNode.className).parent;
                var methodsToAddToScope: Array <ScopeItem> = [];
                while (superClass) {
                    superClass.classNode.methodList.forEach(methodNode => {
                        methodsToAddToScope.push({
                            identifierName: methodNode.methodName,
                            identifierType: methodNode.returnTypeName
                        });
                    });
                    superClass = superClass.parent;
                }

                // add them to the methodscope in reverse order so the most basic methods
                // appear on the bottom of the stack
                typeEnvironment.methodScope = typeEnvironment.methodScope.concat(methodsToAddToScope.reverse());

                // ensure that all method names are unique
                var duplicateMethods: Array<MethodNode> = [];
                for (var i = 0; i < classNode.methodList.length; i++) {
                    if (classNode.methodList.map(c => { return c.methodName }).slice(0, i).indexOf(classNode.methodList[i].methodName) !== -1) {
                        duplicateMethods.push(classNode.methodList[i]);
                    } else {
                        typeEnvironment.methodScope.push({
                            identifierName: classNode.methodList[i].methodName,
                            identifierType: classNode.methodList[i].returnTypeName
                        })
                    }
                }

                duplicateMethods.forEach((methodNode) => {
                    errorMessages.push({
                        location: methodNode.token.location,
                        message: 'Method "' + methodNode.methodName + '" is multiply defined in class "' + classNode.className + '"'
                    });
                });

                // ensure that all property names are unique
                var duplicateProperties: Array<PropertyNode> = [];
                for (var i = 0; i < classNode.propertyList.length; i++) {
                    if (classNode.propertyList.map(c => { return c.propertyName }).slice(0, i).indexOf(classNode.propertyList[i].propertyName) !== -1) {
                        duplicateProperties.push(classNode.propertyList[i]);
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
                    if (!this.isAssignableFrom(propertyNode.typeName, initializerType)) {
                        this.addTypeError(propertyNode.typeName, initializerType, propertyNode.token.location, errorMessages);
                    }
                }
            }

            /* CLASS METHOD */
            else if (ast.type === NodeType.Method) {
                return null;
            }

            /* ASSIGNMENT EXPRESSION */
            else if (ast.type === NodeType.AssignmentExpression) {
                var assignmentExpressionNode = <AssignmentExpressionNode>ast;
                for (var i = typeEnvironment.variableScope.length - 1; i >= 0; i--) {
                    if (typeEnvironment.variableScope[i].identifierName === assignmentExpressionNode.identifierName) {
                        var expressionType = this.analyze(assignmentExpressionNode.assignmentExpression, typeEnvironment, errorMessages, warningMessages);

                        if (!this.isAssignableFrom(typeEnvironment.variableScope[i].identifierType, expressionType)) {
                            this.addTypeError(typeEnvironment.variableScope[i].identifierType, expressionType, assignmentExpressionNode.token.location, errorMessages);
                        }

                        return expressionType;
                    }
                }

                errorMessages.push({
                    location: assignmentExpressionNode.token.location,
                    message: 'Assignment to undeclared variable "' + assignmentExpressionNode.identifierName + '"'
                });

                return this.unknownType;
            }

            /* METHOD CALL EXPRESSION */
            else if (ast.type === NodeType.MethodCallExpression) {
                var methodCallExpressionNode = <MethodCallExpressionNode>ast;
                var methodTargetType: string;

                if (!methodCallExpressionNode.isCallToParent && !methodCallExpressionNode.isCallToSelf) {
                    methodTargetType = this.analyze(methodCallExpressionNode.targetExpression, typeEnvironment, errorMessages, warningMessages);
                } else if (!methodCallExpressionNode.isCallToParent) {
                    methodTargetType = typeEnvironment.currentClassType;
                } else if (!methodCallExpressionNode.isCallToSelf) {
                    methodTargetType = methodCallExpressionNode.explicitParentCallTypeName;
                } else {
                    throw 'MethodCallExpressionNode should not have both isCallToParent = true AND isCallToSelf = true';
                }

                for (var i = typeEnvironment.methodScope.length - 1; i >= 0; i--) {
                    if (typeEnvironment.methodScope[i].identifierName === methodCallExpressionNode.methodName) {
                        return typeEnvironment.methodScope[i].identifierType;
                    }
                }

                errorMessages.push({
                    location: methodCallExpressionNode.token.location,
                    message: 'Call to undefined method "' + methodCallExpressionNode.methodName + '"'
                });

                return this.unknownType;
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
                        identifierName: varDeclarationNode.identifierName,
                        identifierType: varDeclarationNode.typeName
                    });
                });
                var returnType = this.analyze(letExpressionNode.letBodyExpression, typeEnvironment, errorMessages, warningMessages);

                // remove the added variables from the scope
                typeEnvironment.variableScope.splice(
                    typeEnvironment.variableScope.length - letExpressionNode.localVariableDeclarations.length,
                    letExpressionNode.localVariableDeclarations.length);

                return returnType;
            }

            /* NEW EXPRESSION */
            else if (ast.type === NodeType.NewExpression) {
                var newExpressionNode = <NewExpressionNode>ast;
                return newExpressionNode.typeName;
            }

            /* OBJECT IDENTIFIER EXPRESSION */
            else if (ast.type === NodeType.ObjectIdentifierExpression) {
                var objectIdExpressionNode = <ObjectIdentifierExpressionNode>ast;

                for (var i = typeEnvironment.variableScope.length - 1; i >= 0; i--) {
                    if (typeEnvironment.variableScope[i].identifierName === objectIdExpressionNode.objectIdentifierName) {
                        return typeEnvironment.variableScope[i].identifierType;
                    }
                }

                errorMessages.push({
                    location: objectIdExpressionNode.token.location,
                    message: 'Undeclared variable "' + objectIdExpressionNode.objectIdentifierName + '"'
                });

                return this.unknownType;
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

            // TODO
            else return this.unknownType;
        }

        private typeExists(typeName: string): boolean {
            return this.findTypeHeirarchy(typeName) !== null;
        }

        private findTypeHeirarchy(typeName: string): TypeHeirarchy {
            var findTypeHeirarchy = (typeHeirachy: TypeHeirarchy) => {
                if (typeHeirachy.typeName === typeName) {
                    return typeHeirachy;
                } else {
                    for (var i = 0; i < typeHeirachy.children.length; i++) {
                        var findTypeResult = findTypeHeirarchy(typeHeirachy.children[i])
                        if (findTypeResult) {
                            return findTypeResult;
                        }
                    }
                }

                return null;
            }

            return findTypeHeirarchy(this.inheritanceGraph);
        }

        // determines whether one class either inherits or is another
        // examples:
        // isAssignableFrom('BaseClass', 'SubClass') => true
        // isAssignableFrom('SubClass', 'BaseClass') => false
        // isAssignableFrom('SubClass', 'SubClass') => true
        private isAssignableFrom(type1Name: string, type2Name: string): boolean {
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
        }

        private addTypeError(type1Name: string, type2Name: string, location: SourceLocation, errorMessages: Array<ErrorMessage>) {
            errorMessages.push({
                location: location,
                message: 'Type "' + type2Name + '" is not assignable to type "' + type1Name + '"'
            });
        }

        // adds the implied classes (Object, IO, Integer, etc.)
        // to our program node's class list
        private addBuiltinObjects(programNode: ProgramNode): void {

            // Object class
            var objectClass = new ClassNode('Object');

            var abortMethodNode = new MethodNode();
            abortMethodNode.methodName = 'abort';
            abortMethodNode.returnTypeName = 'Object'
            objectClass.children.push(abortMethodNode);

            var typeNameMethodNode = new MethodNode();
            typeNameMethodNode.methodName = 'type_name';
            typeNameMethodNode.returnTypeName = 'String'
            objectClass.children.push(typeNameMethodNode);

            var copyMethodNode = new MethodNode();
            copyMethodNode.methodName = 'copy';
            copyMethodNode.returnTypeName = 'SELF_TYPE'
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
            ioClass.children.push(outStringMethodNode);

            var outIntMethodNode = new MethodNode();
            outIntMethodNode.methodName = 'out_int';
            outIntMethodNode.returnTypeName = 'SELF_TYPE';
            outIntMethodNode.parameters.push({
                parameterName: 'x',
                parameterTypeName: 'Int'
            });
            ioClass.children.push(outIntMethodNode);

            var inStringMethodNode = new MethodNode();
            inStringMethodNode.methodName = 'in_string';
            inStringMethodNode.returnTypeName = 'String';
            ioClass.children.push(inStringMethodNode);

            var inIntMethodNode = new MethodNode();
            inIntMethodNode.methodName = 'in_int';
            inIntMethodNode.returnTypeName = 'Int';
            ioClass.children.push(inIntMethodNode);

            programNode.children.push(ioClass);

            // Int
            var intClass = new ClassNode('Int');
            programNode.children.push(intClass);

            // String
            var stringClass = new ClassNode('String');

            var lengthMethodNode = new MethodNode();
            lengthMethodNode.methodName = 'length';
            lengthMethodNode.returnTypeName = 'String';
            stringClass.children.push(lengthMethodNode);

            var concatMethodNode = new MethodNode();
            concatMethodNode.methodName = 'concat';
            concatMethodNode.returnTypeName = 'String';
            concatMethodNode.parameters.push({
                parameterName: 's',
                parameterTypeName: 'String'
            });
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
            stringClass.children.push(substrMethodNode);

            programNode.children.push(stringClass);

            // Bool
            var boolClass = new ClassNode('Bool');
            programNode.children.push(boolClass);
        }

        private inheritanceGraph: TypeHeirarchy;

        private unknownType: string = '$UnknownType$';

        // constructs a heirarchy of all referenced classes
        // to allow for future inheritance checking
        private buildInheritanceGraph(programNode: ProgramNode): void {

            // create TypeHierarchy objects for every class defined in this program
            var allTypes = programNode.classList.map((c) => {
                return {
                    parentName: c.superClassName || 'Object',
                    typeHeirarchy: new TypeHeirarchy(c)
                };
            });

            // assemble a tree out of the list of TypeHierarchy's from above
            allTypes.forEach((typeAndParent, i) => {
                if (typeAndParent.typeHeirarchy.typeName === 'Object') {
                    this.inheritanceGraph = typeAndParent.typeHeirarchy;
                }

                for (var j = 0; j < allTypes.length; j++) {
                    if (j === i) continue;

                    if (typeAndParent.parentName === allTypes[j].typeHeirarchy.typeName) {
                        typeAndParent.typeHeirarchy.parent = allTypes[j].typeHeirarchy;
                        allTypes[j].typeHeirarchy.children.push(typeAndParent.typeHeirarchy);
                    }
                }
            });
        }
    }

    class TypeHeirarchy {
        constructor(classNode: ClassNode) {
            this.classNode = classNode;
        }

        get typeName(): string {
            return this.classNode.className;
        }

        classNode: ClassNode;
        parent: TypeHeirarchy;
        children: Array<TypeHeirarchy> = [];
    }

    interface TypeEnvironment {
        currentClassType: string;
        variableScope: Array<ScopeItem>;
        methodScope: Array<ScopeItem>;
    }

    interface ScopeItem {
        identifierName: string;
        identifierType: string
    }
}