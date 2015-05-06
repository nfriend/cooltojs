module CoolToJS {

    export interface IOFunctionDefinitions {
        out_string: (output: string) => void;
        out_int: (output: number) => void;
        in_string: (onInput: (input: string) => any) => void;
        in_int: (onInput: (input: string) => any) => void;
    }

    export class JavaScriptGenerator {
        Generate = (semanticAnalysisOutput: SemanticAnalyzerOutput, ioFunctions: IOFunctionDefinitions): JavaScriptGeneratorOutput => {

            var errorMessages = semanticAnalysisOutput.errorMessages || [],
                warningMessages = semanticAnalysisOutput.warningMessages || [],
                success = errorMessages.length === 0,
                output = this.generate(semanticAnalysisOutput.abstractSyntaxTree, ioFunctions, errorMessages, warningMessages);

            return {
                success: success,
                errorMessages: errorMessages,
                warningMessages: warningMessages,
                generatedJavaScript: output
            }
        }

        private generate(ast: Node, ioFunctions: IOFunctionDefinitions, errorMessages: Array<ErrorMessage>, warningMessages: Array<WarningMessage>): string {
            var output: Array<string> = [];
            output.push('let inputGenerators = [];\n\n')
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
                output.push('let mainGenerator = new Main().main();\n');
                output.push('inputGenerators.push(mainGenerator)\n');
                output.push('mainGenerator.next();\n');
            } else {
                output.push('new Main().main();\n');
            }
            return output.join('');
        }

        private generateIOClass(ioFunctions: IOFunctionDefinitions, indentLevel: number): string {
            var output: Array<string> = [];
            output.push(this.indent(indentLevel) + 'class IO {\n');
            output.push(this.indent(indentLevel + 1) + 'out_string = ' + ioFunctions.out_string + ';\n');
            output.push(this.indent(indentLevel + 1) + 'out_int = ' + ioFunctions.out_int + ';\n');
            output.push(this.indent(indentLevel + 1) + 'in_string = ' + ioFunctions.in_string + ';\n');
            output.push(this.indent(indentLevel + 1) + 'in_int = ' + ioFunctions.in_int + ';\n');
            output.push(this.indent(indentLevel) + '}\n');
            return output.join('');
        }

        private generateClass(classNode: ClassNode, indentLevel: number): string {
            var output: Array<string> = [];

            var extendsPhrase = classNode.isSubClass ? (' extends ' + classNode.superClassName) : '';
            output.push(this.indent(indentLevel) + 'class ' + classNode.className + extendsPhrase + ' {\n');

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
            /*if ((<ClassNode>methodNode.parent).className === 'Main' && methodNode.methodName === 'main') {
                var output: Array<string> = [];
                output.push(this.indent(indentLevel) + (methodNode.isAsync ? '*' : '') + 'main() {\n');
                output.push(this.indent(indentLevel + 1) + '{\n');
                output.push(this.indent(indentLevel + 2) + '// the following is hardcoded while the\n');
                output.push(this.indent(indentLevel + 2) + '// transpiler is being built\n');
                output.push(this.indent(indentLevel + 2) + 'let hello = "Hello, ";\n');
                output.push(this.indent(indentLevel + 2) + 'let name = "";\n');
                output.push(this.indent(indentLevel + 2) + 'let ending = "!\\n";\n');
                output.push(this.indent(indentLevel + 2) + 'out_string("Please enter your name:\\n");\n');
                output.push(this.indent(indentLevel + 2) + 'name = yield in_string(inputGenerator);\n');
                output.push(this.indent(indentLevel + 2) + 'out_string(hello + name + ending);\n');
                output.push(this.indent(indentLevel + 1) + '}\n');

                output.push(this.indent(indentLevel) + '};\n');
                return output.join('');
            }*/

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
                default:
                    throw 'Unrecognized ExpressionNode type!';
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

                output.push(this.indent(indentLevel) + (isFirst ? 'var ' : this.indent(1)) + lvdn.identifierName);
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

            if (methodCallExpression.isAsync) {
                output.push(this.indent(indentLevel) + 'yield ');
            }

            if (methodCallExpression.targetExpression) {
                output.push(this.generateExpression(methodCallExpression.targetExpression, 0));
            }

            if (methodCallExpression.isCallToSelf) {
                // no output
            } else if (methodCallExpression.isCallToParent) {
                throw 'Explicit parent calls not yet implemented';
            } else {
                output.push('.');
            }

            output.push(methodCallExpression.methodName + '(');
            methodCallExpression.parameterExpressionList.forEach((p, index) => {
                output.push(this.generateExpression(p, 0));
                if (index !== methodCallExpression.parameterExpressionList.length - 1) {
                    output.push(',');
                }
            });

            // TODO: what if this is a different in_string method?
            if (methodCallExpression.methodName === 'in_string') {
                output.push('inputGenerators[inputGenerators.length - 1]');
            }

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