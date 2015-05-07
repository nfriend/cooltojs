module CoolToJS {

    export interface IOFunctionDefinitions {
        out_string: (output: string) => void;
        out_int: (output: number) => void;
        in_string: (onInput: (input: string) => any) => void;
        in_int: (onInput: (input: string) => any) => void;
    }

    export class JavaScriptGenerator {

        private errorMessages: Array<ErrorMessage> = [];
        private warningMessages: Array<WarningMessage> = [];

        Generate = (semanticAnalysisOutput: SemanticAnalyzerOutput, ioFunctions: IOFunctionDefinitions): JavaScriptGeneratorOutput => {

            this.errorMessages = semanticAnalysisOutput.errorMessages || [];
            this.warningMessages = semanticAnalysisOutput.warningMessages || [];

            var output = this.generate(semanticAnalysisOutput.abstractSyntaxTree, ioFunctions, this.errorMessages, this.warningMessages);

            return {
                success: this.errorMessages.length === 0,
                errorMessages: this.errorMessages,
                warningMessages: this.warningMessages,
                generatedJavaScript: output
            }
        }

        private generate(ast: Node, ioFunctions: IOFunctionDefinitions, errorMessages: Array<ErrorMessage>, warningMessages: Array<WarningMessage>): string {
            var output: Array<string> = [];
            output.push('let inputGenerators = [];\n\n')
            output.push(Utility.baseObjectClass);
            output.push(this.generateIOClass(ioFunctions, 0));
            output.push('\n');

            var isInputNeeded = false;
            (<ProgramNode>ast).classList.forEach(classNode => {
                if (['Object', 'IO', 'Int', 'String', 'Bool'].indexOf(classNode.className) === -1) {
                    output.push(this.generateClass(classNode, 0));
                    output.push('\n');
                    if (!isInputNeeded) {
                        isInputNeeded = classNode.methodList.some(mn => mn.isAsync);
                    }
                }
            });

            if (isInputNeeded) {
                output.push('let mainGenerator = new Main("Main").main();\n');
                output.push('inputGenerators.push(mainGenerator)\n');
                output.push('mainGenerator.next();\n');
            } else {
                output.push('new Main("Main").main();\n');
            }
            return output.join('');
        }

        private generateIOClass(ioFunctions: IOFunctionDefinitions, indentLevel: number): string {
            var output: Array<string> = [];
            output.push(this.indent(indentLevel) + 'class IO extends _BaseObject {\n');

            output.push(this.indent(indentLevel + 1) + 'constructor(typeName) {\n');
            output.push(this.indent(indentLevel + 2) + 'super(typeName);\n');
            output.push(this.indent(indentLevel + 1) + '}\n\n');

            ['out_string', 'out_int', 'in_string', 'in_int'].forEach(methodname => {
                var outStringDetails = Utility.getFunctionDetails(ioFunctions[methodname]);
                output.push(this.indent(indentLevel + 1) + methodname + '(');
                outStringDetails.parameters.forEach((p, index) => {
                    var isLast = outStringDetails.parameters.length - 1 === index;
                    output.push(p + (isLast ? '' : ', '))
                });
                output.push(') {');
                output.push(outStringDetails.body);
                output.push('};\n');
            });
            output.push(this.indent(indentLevel) + '}\n');
            return output.join('');
        }

        private generateClass(classNode: ClassNode, indentLevel: number): string {
            var output: Array<string> = [];

            var extendsPhrase = ' extends ' + (classNode.isSubClass ? classNode.superClassName : '_BaseObject');
            output.push(this.indent(indentLevel) + 'class ' + classNode.className + extendsPhrase + ' {\n');

            output.push(this.indent(indentLevel + 1) + 'constructor(typeName) {\n');
            output.push(this.indent(indentLevel + 2) + 'super(typeName);\n');
            output.push(this.indent(indentLevel + 1) + '}\n\n');

            classNode.propertyList.forEach(propertyNode => {
                output.push(this.generateClassProperty(propertyNode, indentLevel + 1));
            });

            classNode.methodList.forEach(methodNode => {
                output.push(this.generateClassMethod(methodNode, indentLevel + 1));
            });

            output.push(this.indent(indentLevel) + '}\n');

            return output.join('');
        }

        private generateClassProperty(propertyNode: PropertyNode, indentLevel: number): string {
            var output: Array<string> = [];
            output.push(this.indent(indentLevel) + propertyNode.propertyName + ';\n');
            return output.join('');
        }

        private generateClassMethod(methodNode: MethodNode, indentLevel: number): string {
            var output: Array<string> = [];
            output.push(this.indent(indentLevel) + (methodNode.isAsync ? '*' : '') + methodNode.methodName + '() {\n');
            output.push(this.generateExpression(methodNode.methodBodyExpression, indentLevel + 1));
            output.push(this.indent(indentLevel) + '};\n');
            return output.join('');
        }

        private generateExpression(expressionNode: ExpressionNode, indentLevel: number): string {
            switch (expressionNode.type) {
                case NodeType.LetExpression:
                    return this.generateLetExpression(<LetExpressionNode>expressionNode, indentLevel);
                    break;
                case NodeType.StringLiteralExpression:
                    return (<StringLiteralExpressionNode>expressionNode).value;
                    break;
                case NodeType.MethodCallExpression:
                    return this.generateMethodCallExpression(<MethodCallExpressionNode>expressionNode, indentLevel);
                    break;
                case NodeType.BlockExpression:
                    return this.generateBlockExpression(<BlockExpressionNode>expressionNode, indentLevel);
                    break;
                case NodeType.AssignmentExpression:
                    return this.generateAssignmentExpression(<AssignmentExpressionNode>expressionNode, indentLevel);
                    break;
                case NodeType.ObjectIdentifierExpression:
                    return this.generateObjectIdentifierExpression(<ObjectIdentifierExpressionNode>expressionNode, indentLevel);
                    break;
                case NodeType.SelfExpression:
                    return this.generateSelfExpression(<ObjectIdentifierExpressionNode>expressionNode, indentLevel);
                    break;
                case NodeType.NewExpression:
                    return this.generateNewExpression(<NewExpressionNode>expressionNode, indentLevel);
                    break;
                default:
                    this.errorMessages.push({
                        location: null,
                        message: 'Node type "' + expressionNode.nodeTypeName + '" not yet implemented!'
                    });
            }
        }

        private generateLetExpression(letExpressionNode: LetExpressionNode, indentLevel: number): string {
            var output: Array<string> = [];
            if (letExpressionNode.parent.type !== NodeType.Method) {
                output.push(this.indent(indentLevel) + '{\n');
                indentLevel++;
            }

            letExpressionNode.localVariableDeclarations.forEach((lvdn, index) => {
                var isFirst = index === 0,
                    isLast = index === letExpressionNode.localVariableDeclarations.length - 1;

                output.push(this.indent(indentLevel) + (isFirst ? 'let ' : this.indent(1)) + lvdn.identifierName);
                if (lvdn.initializerExpression) {
                    output.push(' = ' + this.generateExpression(lvdn.initializerExpression, 0));
                }

                output.push((isLast ? ';' : ',') + '\n');
            });

            output.push(this.generateExpression(letExpressionNode.letBodyExpression, indentLevel));

            if (letExpressionNode.parent.type !== NodeType.Method) {
                indentLevel--;
                output.push(this.indent(indentLevel) + '}\n');
            }
            return output.join('');
        }

        private generateMethodCallExpression(methodCallExpression: MethodCallExpressionNode, indentLevel: number): string {
            var output: Array<string> = [];

            output.push(this.indent(indentLevel));

            if (methodCallExpression.isInStringOrInInt) {
                output.push('yield in_string(inputGenerators[inputGenerators.length - 1])');
                return output.join('');
            }

            if (methodCallExpression.method.isAsync) {
                // TODO
                output.push('let newGenerator = ' + methodCallExpression + '();');
                output.push('inputGenerators.push(newGenerator);');
                output.push('inputGenerators.next();');
            }

            if (methodCallExpression.targetExpression && !methodCallExpression.isCallToParent) {
                output.push(this.generateExpression(methodCallExpression.targetExpression, 0));
            }

            if (methodCallExpression.isCallToParent) {
                output.push(methodCallExpression.explicitParentCallTypeName + '.prototype.' + methodCallExpression.methodName + '.call(this, ');
            } else {
                output.push(methodCallExpression.isCallToSelf ? 'this.' : '.');
                output.push(methodCallExpression.methodName + '(');
            }

            methodCallExpression.parameterExpressionList.forEach((p, index) => {
                output.push(this.generateExpression(p, 0));
                if (index !== methodCallExpression.parameterExpressionList.length - 1) {
                    output.push(',');
                }
            });

            output.push(')');

            return output.join('');
        }

        private generateBlockExpression(blockExpressionNode: BlockExpressionNode, indentLevel: number): string {
            var output: Array<string> = [];
            blockExpressionNode.expressionList.forEach(en => {
                output.push(this.indent(indentLevel) + this.generateExpression(en, 0) + ';\n');
            });
            return output.join('');
        }

        private generateAssignmentExpression(assignmentExpressionNode: AssignmentExpressionNode, indentLevel: number): string {
            var output: Array<string> = [];
            output.push(this.indent(indentLevel) + assignmentExpressionNode.identifierName + ' = ');
            output.push(this.generateExpression(assignmentExpressionNode.assignmentExpression, 0));
            return output.join('');
        }

        private generateObjectIdentifierExpression(objectIdentifierExpressionNode: ObjectIdentifierExpressionNode, indentLevel: number): string {
            return this.indent(indentLevel) + objectIdentifierExpressionNode.objectIdentifierName;
        }

        private generateSelfExpression(selfExpressionNode: SelfExpressionNode, indentLevel: number): string {
            return this.indent(indentLevel) + 'this';
        }

        private generateNewExpression(newExpressionNode: NewExpressionNode, indentLevel: number): string {
            return this.indent(indentLevel) + 'new ' + newExpressionNode.typeName + '("' + newExpressionNode.typeName + '")';
        }

        private indentCache: Array<string> = [];
        private singleIndent: string = '    ';
        private indent(indentCount: number): string {
            if (typeof this.indentCache[indentCount] === 'undefined') {
                var returnIndent = '';
                for (var i = 0; i < indentCount; i++) {
                    returnIndent += this.singleIndent;
                }
                this.indentCache[indentCount] = returnIndent;
            }

            return this.indentCache[indentCount];
        }
    }
} 