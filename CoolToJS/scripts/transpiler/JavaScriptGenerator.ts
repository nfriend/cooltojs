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
            output.push('let _inputGenerators = [],\n')
            output.push(this.indent(1) + '_divide = (a, b) => { return Math.floor(a / b); };\n\n')
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
                output.push('_inputGenerators.push(mainGenerator)\n');
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
            output.push(this.indent(indentLevel + 1) + 'let _returnValue;\n');
            output.push(this.generateExpression(methodNode.methodBodyExpression, true, indentLevel + 1));
            output.push(this.indent(indentLevel + 1) + 'return _returnValue;\n');
            output.push(this.indent(indentLevel) + '};\n');
            return output.join('');
        }

        private generateExpression(expressionNode: ExpressionNode, returnResult: boolean, indentLevel: number): string {
            switch (expressionNode.type) {
                case NodeType.LetExpression:
                    return this.generateLetExpression(<LetExpressionNode>expressionNode, returnResult, indentLevel);
                    break;
                case NodeType.StringLiteralExpression:
                    return this.generateStringLiteralExpression(<StringLiteralExpressionNode>expressionNode, returnResult, indentLevel);
                    break;
                case NodeType.IntegerLiteralExpression:
                    return this.generateIntegerLiteralExpression(<IntegerLiteralExpressionNode>expressionNode, returnResult, indentLevel);
                    break;
                case NodeType.MethodCallExpression:
                    return this.generateMethodCallExpression(<MethodCallExpressionNode>expressionNode, returnResult, indentLevel);
                    break;
                case NodeType.BlockExpression:
                    return this.generateBlockExpression(<BlockExpressionNode>expressionNode, returnResult, indentLevel);
                    break;
                case NodeType.AssignmentExpression:
                    return this.generateAssignmentExpression(<AssignmentExpressionNode>expressionNode, returnResult, indentLevel);
                    break;
                case NodeType.ObjectIdentifierExpression:
                    return this.generateObjectIdentifierExpression(<ObjectIdentifierExpressionNode>expressionNode, returnResult, indentLevel);
                    break;
                case NodeType.SelfExpression:
                    return this.generateSelfExpression(<ObjectIdentifierExpressionNode>expressionNode, returnResult, indentLevel);
                    break;
                case NodeType.NewExpression:
                    return this.generateNewExpression(<NewExpressionNode>expressionNode, returnResult, indentLevel);
                    break;
                case NodeType.BinaryOperationExpression:
                    return this.generateBinaryOperationExpression(<BinaryOperationExpressionNode>expressionNode, returnResult, indentLevel);
                    break;
                case NodeType.UnaryOperationExpression:
                    return this.generateUnaryOperationExpression(<UnaryOperationExpressionNode>expressionNode, returnResult, indentLevel);
                    break;
                case NodeType.ParentheticalExpression:
                    return this.generateParentheticalExpressionNode(<ParentheticalExpressionNode>expressionNode, returnResult, indentLevel);
                    break;
                case NodeType.TrueKeywordExpression:
                    return this.generateTrueKeywordExpressionNode(<TrueKeywordExpressionNode>expressionNode, returnResult, indentLevel);
                    break;
                case NodeType.FalseKeywordExpression:
                    return this.generateFalseKeywordExpressionNode(<FalseKeywordExpressionNode>expressionNode, returnResult, indentLevel);
                    break;
                default:
                    this.errorMessages.push({
                        location: null,
                        message: 'Node type "' + expressionNode.nodeTypeName + '" not yet implemented!'
                    });
            }
        }

        private generateLetExpression(letExpressionNode: LetExpressionNode, returnResult: boolean, indentLevel: number): string {
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
                    if (this.expressionReturnsItself(lvdn.initializerExpression)) {
                        output.push(' = ' + this.generateExpression(this.unwrapSelfReturningExpression(lvdn.initializerExpression), false, 0))
                    } else {
                        output.push(this.wrapInSelfExecutingFunction(lvdn.initializerExpression, indentLevel));
                    }
                }

                output.push((isLast ? ';' : ',') + '\n');
            }); (returnResult ? 'return ' : '') +

            output.push(this.generateExpression(letExpressionNode.letBodyExpression, returnResult, indentLevel));

            if (letExpressionNode.parent.type !== NodeType.Method) {
                indentLevel--;
                output.push(this.indent(indentLevel) + '}\n');
            }
            return output.join('');
        }

        private generateMethodCallExpression(methodCallExpression: MethodCallExpressionNode, returnResult: boolean, indentLevel: number): string {
            var output: Array<string> = [];

            output.push(this.indent(indentLevel));

            if (methodCallExpression.isInStringOrInInt) {
                output.push('yield in_string(_inputGenerators[_inputGenerators.length - 1])');
                return output.join('');
            }

            if (methodCallExpression.method.isAsync) {
                // TODO
                output.push('let newGenerator = ' + methodCallExpression + '();');
                output.push('_inputGenerators.push(newGenerator);');
                output.push('_inputGenerators.next();');
            }

            if (methodCallExpression.targetExpression && !methodCallExpression.isCallToParent) {
                output.push(this.generateExpression(methodCallExpression.targetExpression, returnResult, 0));
            }

            if (methodCallExpression.isCallToParent) {
                output.push(methodCallExpression.explicitParentCallTypeName + '.prototype.' + methodCallExpression.methodName + '.call(this, ');
            } else {
                output.push(methodCallExpression.isCallToSelf ? 'this.' : '.');
                output.push(methodCallExpression.methodName + '(');
            }

            methodCallExpression.parameterExpressionList.forEach((p, index) => {
                if (this.expressionReturnsItself(p)) {
                    output.push(this.generateExpression(this.unwrapSelfReturningExpression(p), false, 0));
                } else {
                    output.push(this.wrapInSelfExecutingFunction(p, indentLevel));
                }
                if (index !== methodCallExpression.parameterExpressionList.length - 1) {
                    output.push(',');
                }
            });

            output.push(')');

            return output.join('');
        }

        private generateBlockExpression(blockExpressionNode: BlockExpressionNode, returnResult: boolean, indentLevel: number): string {
            var output: Array<string> = [];
            blockExpressionNode.expressionList.forEach((en, index) => {
                var isLast: boolean = index === blockExpressionNode.expressionList.length - 1;
                output.push(this.indent(indentLevel) + this.generateExpression(en, isLast, 0) + ';\n');
            });
            return output.join('');
        }

        private generateAssignmentExpression(assignmentExpressionNode: AssignmentExpressionNode, returnResult: boolean, indentLevel: number): string {
            var output: Array<string> = [];
            output.push(this.indent(indentLevel) + assignmentExpressionNode.identifierName + ' = ');
            output.push(this.generateExpression(assignmentExpressionNode.assignmentExpression, returnResult, 0));
            return output.join('');
        }

        private generateObjectIdentifierExpression(objectIdentifierExpressionNode: ObjectIdentifierExpressionNode, returnResult: boolean, indentLevel: number): string {
            return this.indent(indentLevel) + objectIdentifierExpressionNode.objectIdentifierName;
        }

        private generateSelfExpression(selfExpressionNode: SelfExpressionNode, returnResult: boolean, indentLevel: number): string {
            return this.indent(indentLevel) + 'this';
        }

        private generateNewExpression(newExpressionNode: NewExpressionNode, returnResult: boolean, indentLevel: number): string {
            return this.indent(indentLevel) + 'new ' + newExpressionNode.typeName + '("' + newExpressionNode.typeName + '")';
        }

        private generateStringLiteralExpression(stringLiteralExpressionNode: StringLiteralExpressionNode, returnResult: boolean, indentLevel: number): string {
            return this.indent(indentLevel) + (returnResult ? '_returnValue = ' : '') + '"' + stringLiteralExpressionNode.value + '"';
        }

        private generateIntegerLiteralExpression(integerLiteralExpressionNode: IntegerLiteralExpressionNode, returnResult: boolean, indentLevel: number): string {
            return this.indent(indentLevel) + (returnResult ? '_returnValue = ' : '') + integerLiteralExpressionNode.value;
        }

        private generateParentheticalExpressionNode(parentheticalExpressionNode: ParentheticalExpressionNode, returnResult: boolean, indentLevel: number): string {
            return this.indent(indentLevel) + (returnResult ? '_returnValue = ' : '') + '(' + this.generateExpression(parentheticalExpressionNode.innerExpression, false, indentLevel) + ')';
        }

        private generateTrueKeywordExpressionNode(trueKeywordExpressionNode: TrueKeywordExpressionNode, returnResult: boolean, indentLevel: number): string {
            return this.indent(indentLevel) + (returnResult ? '_returnValue = ' : '') + 'true';
        }

        private generateFalseKeywordExpressionNode(falseKeywordExpressionNode: FalseKeywordExpressionNode, returnResult: boolean, indentLevel: number): string {
            return this.indent(indentLevel) + (returnResult ? '_returnValue = ' : '') + 'false';
        }

        private generateBinaryOperationExpression(binOpExpressionNode: BinaryOperationExpressionNode, returnResult: boolean, indentLevel: number): string {
            var output: Array<string> = [],
                operand1: string,
                operand2: string;

            if (this.expressionReturnsItself(binOpExpressionNode)) {
                operand1 = this.generateExpression(this.unwrapSelfReturningExpression(binOpExpressionNode.operand1), false, 0);
            } else {
                operand1 = this.wrapInSelfExecutingFunction(binOpExpressionNode.operand1, indentLevel);
            }

            if (this.expressionReturnsItself(binOpExpressionNode)) {
                operand2 = this.generateExpression(this.unwrapSelfReturningExpression(binOpExpressionNode.operand2), false, 0);
            } else {
                operand2 = this.wrapInSelfExecutingFunction(binOpExpressionNode.operand2, indentLevel);
            }

            output.push(this.indent(indentLevel) + (returnResult ? '_returnValue = ' : ''));

            // we treat division differently than other binary operations, because Cool assumes all division is integer division
            if (binOpExpressionNode.operationType === BinaryOperationType.Division) {
                output.push('_divide(' + operand1 + ', ' + operand2 + ')');
            } else {
                output.push(operand1);
                switch (binOpExpressionNode.operationType) {
                    case BinaryOperationType.Addition:
                        output.push(' + ')
                        break;
                    case BinaryOperationType.Subtraction:
                        output.push(' - ')
                        break;
                    case BinaryOperationType.Multiplication:
                        output.push(' * ')
                        break;
                    case BinaryOperationType.Comparison:
                        output.push(' === ')
                        break;
                    case BinaryOperationType.LessThan:
                        output.push(' < ')
                        break;
                    case BinaryOperationType.LessThanOrEqualTo:
                        output.push(' <= ')
                        break;
                    default:
                        throw 'Unrecognized BinaryOperationType: ' + binOpExpressionNode[binOpExpressionNode.operationType];
                }
                output.push(operand2);
            }
            return output.join('');
        }

        private generateUnaryOperationExpression(unOpExpressionNode: UnaryOperationExpressionNode, returnResult: boolean, indentLevel: number): string {
            var output: Array<string> = [];
            output.push(this.indent(indentLevel) + (returnResult ? '_returnValue = ' : ''));
            switch (unOpExpressionNode.operationType) {
                case UnaryOperationType.Complement:
                    output.push('~')
                    break;
                case UnaryOperationType.Not:
                    output.push('!')
                    break;
                default:
                    throw 'Unrecognized UnaryOperationType: ' + unOpExpressionNode[unOpExpressionNode.operationType];
            }
            if (this.expressionReturnsItself(unOpExpressionNode)) {
                output.push(this.generateExpression(this.unwrapSelfReturningExpression(unOpExpressionNode.operand), false, 0));
            } else {
                output.push(this.wrapInSelfExecutingFunction(unOpExpressionNode.operand, indentLevel));
            }
            return output.join('');
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

        private expressionReturnsItself(node: Node): boolean {
            return (node.type === NodeType.StringLiteralExpression
                || node.type === NodeType.IntegerLiteralExpression
                || node.type === NodeType.ObjectIdentifierExpression
                || node.type === NodeType.BinaryOperationExpression
                || node.type === NodeType.UnaryOperationExpression
                || node.type === NodeType.MethodCallExpression
                || node.type === NodeType.TrueKeywordExpression
                || node.type === NodeType.FalseKeywordExpression
                || (node.type === NodeType.BlockExpression
                    && (<BlockExpressionNode>node).expressionList.length === 1
                    && this.expressionReturnsItself((<BlockExpressionNode>node).expressionList[0]))
                || (node.type === NodeType.ParentheticalExpression
                    && this.expressionReturnsItself((<ParentheticalExpressionNode>node).innerExpression)));
        }

        private unwrapSelfReturningExpression(node: Node): ExpressionNode {
            if (node.type === NodeType.StringLiteralExpression
                || node.type === NodeType.IntegerLiteralExpression
                || node.type === NodeType.ObjectIdentifierExpression
                || node.type === NodeType.BinaryOperationExpression
                || node.type === NodeType.UnaryOperationExpression
                || node.type === NodeType.MethodCallExpression
                || node.type === NodeType.ParentheticalExpression
                || node.type === NodeType.TrueKeywordExpression
                || node.type === NodeType.FalseKeywordExpression) {

                return node;
            } else if (node.type === NodeType.BlockExpression) {
                return this.unwrapSelfReturningExpression((<BlockExpressionNode>node).expressionList[0]);
            } else {
                throw 'unwrapSelfReturningExpression() should not be called without testing whether the expression is self returning using expressionReturnsItself()'
            }
        }

        private wrapInSelfExecutingFunction(node: Node, indentLevel: number) {
            var output: Array<string> = [];
            output.push(' = (() => {\n');
            output.push(this.indent(indentLevel + 2) + 'let _returnValue;\n');
            output.push(this.generateExpression(node, true, indentLevel + 2));
            output.push(this.indent(indentLevel + 2) + 'return _returnValue;\n');
            output.push(this.indent(indentLevel + 1) + '})();\n');
            return output.join('');
        }
    }
} 