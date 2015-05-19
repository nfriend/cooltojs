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
            this.usageRecord = semanticAnalysisOutput.usageRecord;

            var output = this.generate(semanticAnalysisOutput.abstractSyntaxTree, ioFunctions, this.errorMessages, this.warningMessages);

            return {
                success: this.errorMessages.length === 0,
                errorMessages: this.errorMessages,
                warningMessages: this.warningMessages,
                generatedJavaScript: output
            }
        }

        usageRecord: UsageRecord;

        private generate(ast: Node, ioFunctions: IOFunctionDefinitions, errorMessages: Array<ErrorMessage>, warningMessages: Array<WarningMessage>): string {
            var output: Array<string> = [];
            output.push('let _inputGenerator');

            Utility.binaryOperationFunctions.forEach(binOp => {
                if (this.usageRecord.binaryOperations.indexOf(binOp.operation) !== -1) {
                    output.push(',\n');
                    output.push(this.indent(1) + binOp.func);
                }
            });

            Utility.unaryOperationFunctions.forEach(unaryOp => {
                if (this.usageRecord.unaryOperations.indexOf(unaryOp.operation) !== -1) {
                    output.push(',\n');
                    output.push(this.indent(1) + unaryOp.func);
                }
            });

            if (this.usageRecord.caseExpression) {
                output.push(',\n');
                output.push(this.indent(1) + Utility.caseFunction);
            }

            output.push(';\n\n');

            Utility.baseObjectClasses.forEach(c => { output.push(c); });
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

            //if (isInputNeeded) {
            //    output.push('_inputGenerator = new Main("Main").main();\n');
            //    output.push('_inputGenerator.next()\n');
            //} else {
            //    output.push('new Main("Main").main();\n');
            //}

            output.push('_inputGenerator = new Main("Main").main();\n');
            output.push('_inputGenerator.next()\n');

            return output.join('');
        }

        private generateIOClass(ioFunctions: IOFunctionDefinitions, indentLevel: number): string {
            var output: Array<string> = [];
            output.push(this.indent(indentLevel) + 'class IO extends _Object {\n');

            output.push(this.indent(indentLevel + 1) + 'constructor(typeName) {\n');
            output.push(this.indent(indentLevel + 2) + 'super(typeName);\n');
            output.push(this.indent(indentLevel + 1) + '}\n\n');

            ['out_string', 'out_int', 'in_string', 'in_int'].forEach(methodname => {
                var methodDetails = Utility.getFunctionDetails(ioFunctions[methodname]);
                output.push(this.indent(indentLevel + 1) + (methodname === 'in_string' || methodname === 'in_int' ? '*' : ''));
                output.push(methodname + '(');
                var firstParamName: string;
                methodDetails.parameters.forEach((p, index) => {
                    var isLast = methodDetails.parameters.length - 1 === index;
                    if (index === 0) {
                        firstParamName = p;
                    }
                    output.push(p + (isLast ? '' : ', '))
                });
                if (methodname === 'out_string' || methodname === 'out_int') {
                    output.push(') {\n');
                    output.push(this.indent(indentLevel + 2) + firstParamName + ' = ' + firstParamName + '._value;');
                    output.push(methodDetails.body);
                    output.push('\n' + this.indent(indentLevel + 2) + 'return this;\n')
                    output.push(this.indent(indentLevel + 1) + '};\n');
                } else {
                    output.push(') {');
                    output.push(methodDetails.body)
                    output.push('\n' + this.indent(indentLevel + 2) + 'return yield;\n');
                    output.push(this.indent(indentLevel + 1) + '};\n');
                }
            });
            output.push(this.indent(indentLevel) + '}\n');
            return output.join('');
        }

        private generateClass(classNode: ClassNode, indentLevel: number): string {
            var output: Array<string> = [];

            var extendsPhrase = ' extends ' + (classNode.isSubClass ? classNode.superClassName : '_Object');
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
            if (propertyNode.hasInitializer) {
                output.push(this.indent(indentLevel) + propertyNode.propertyName + ' = ');
                if (this.expressionReturnsItself(propertyNode.propertyInitializerExpression)) {
                    output.push(this.generateExpression(propertyNode.propertyInitializerExpression, false, indentLevel + 1));
                } else {
                    output.push(this.wrapInSelfExecutingFunction(propertyNode.propertyInitializerExpression, indentLevel));
                }
                output.push(';\n');
            } else if (propertyNode.typeName === 'Bool') {
                output.push(this.indent(indentLevel) + propertyNode.propertyName + ' = new _Bool(false);\n');
            } else if (propertyNode.typeName === 'String') {
                output.push(this.indent(indentLevel) + propertyNode.propertyName + ' = new _String("");\n');
            } else if (propertyNode.typeName === 'Int') {
                output.push(this.indent(indentLevel) + propertyNode.propertyName + ' = new _Int(0);\n');
            } else {
                output.push(this.indent(indentLevel) + propertyNode.propertyName + ';\n');
            }
            return output.join('');
        }

        private generateClassMethod(methodNode: MethodNode, indentLevel: number): string {
            var output: Array<string> = [];
            output.push(this.indent(indentLevel) + (methodNode.isAsync ? '*' : '') + methodNode.methodName + '(');
            methodNode.parameters.forEach((p, index) => {
                var isLast = index === methodNode.parameters.length - 1;
                output.push(p.parameterName + (isLast ? '' : ', '));
            });
            output.push(') {\n');
            output.push(this.indent(indentLevel + 1) + 'let _returnValue;\n');
            output.push(this.generateExpression(methodNode.methodBodyExpression, true, indentLevel + 1) + '\n');

            // print a success message to the screen at the end of program execution
            if (methodNode.methodName === 'main' && (<ClassNode>methodNode.parent).className === 'Main') {
                output.push(this.indent(indentLevel + 1) + 'yield* new IO("IO").out_string(new _String("COOL program successfully executed\\n"));\n');
            }

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
                    return this.generateTrueKeywordExpression(<TrueKeywordExpressionNode>expressionNode, returnResult, indentLevel);
                    break;
                case NodeType.FalseKeywordExpression:
                    return this.generateFalseKeywordExpression(<FalseKeywordExpressionNode>expressionNode, returnResult, indentLevel);
                    break;
                case NodeType.IfThenElseExpression:
                    return this.generateIfThenElseExpression(<IfThenElseExpressionNode>expressionNode, returnResult, indentLevel);
                case NodeType.WhileExpression:
                    return this.generateWhileExpression(<WhileExpressionNode>expressionNode, returnResult, indentLevel);
                case NodeType.CaseExpression:
                    return this.generateCaseExpression(<CaseExpressionNode>expressionNode, returnResult, indentLevel);
                case NodeType.IsvoidExpression:
                    return this.generateIsVoidExpression(<IsVoidExpressionNode>expressionNode, returnResult, indentLevel);
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
                        output.push(' = ' + this.wrapInSelfExecutingFunction(lvdn.initializerExpression, indentLevel));
                    }
                } else if (lvdn.typeName === 'Bool') {
                    output.push(' = new _Bool(false)');
                } else if (lvdn.typeName === 'String') {
                    output.push(' = new _String("")');
                } else if (lvdn.typeName === 'Int') {
                    output.push(' = new _Int(0)');
                }

                output.push((isLast ? ';' : ',') + '\n');
            });

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
                output.push((returnResult ? '_returnValue = ' : '') + 'new _String(yield* this.' + methodCallExpression.methodName + '(_inputGenerator))');
                return output.join('');
            }

            if (returnResult) {
                output.push('_returnValue = ');
            }

            output.push('yield* ');

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
                output.push(this.generateExpression(en, isLast && returnResult, indentLevel));
                if (blockExpressionNode.expressionList.length !== 1) {
                    output.push(';\n');
                }
            });
            return output.join('');
        }

        private generateAssignmentExpression(assignmentExpressionNode: AssignmentExpressionNode, returnResult: boolean, indentLevel: number): string {
            var output: Array<string> = [];
            output.push(this.indent(indentLevel) + (assignmentExpressionNode.isAssignmentToSelfVariable ? 'this.' : '') + assignmentExpressionNode.identifierName + ' = ');
            output.push(this.generateExpression(assignmentExpressionNode.assignmentExpression, returnResult, 0));
            return output.join('');
        }

        private generateObjectIdentifierExpression(objectIdentifierExpressionNode: ObjectIdentifierExpressionNode, returnResult: boolean, indentLevel: number): string {
            return this.indent(indentLevel) + (returnResult ? '_returnValue = ' : '') + (objectIdentifierExpressionNode.isCallToSelf ? 'this.' : '') + objectIdentifierExpressionNode.objectIdentifierName;
        }

        private generateSelfExpression(selfExpressionNode: SelfExpressionNode, returnResult: boolean, indentLevel: number): string {
            return this.indent(indentLevel) + (returnResult ? '_returnValue = ' : '') + 'this';
        }

        private generateNewExpression(newExpressionNode: NewExpressionNode, returnResult: boolean, indentLevel: number): string {
            return this.indent(indentLevel) + 'new ' + this.translateTypeNameIfPrimitiveType(newExpressionNode.typeName) + '("' + newExpressionNode.typeName + '")';
        }

        private generateStringLiteralExpression(stringLiteralExpressionNode: StringLiteralExpressionNode, returnResult: boolean, indentLevel: number): string {
            return this.indent(indentLevel) + (returnResult ? '_returnValue = ' : '') + 'new _String("' + stringLiteralExpressionNode.value + '")';
        }

        private generateIntegerLiteralExpression(integerLiteralExpressionNode: IntegerLiteralExpressionNode, returnResult: boolean, indentLevel: number): string {
            return this.indent(indentLevel) + (returnResult ? '_returnValue = ' : '') + 'new _Int(' + integerLiteralExpressionNode.value + ')';
        }

        private generateParentheticalExpressionNode(parentheticalExpressionNode: ParentheticalExpressionNode, returnResult: boolean, indentLevel: number): string {
            // parenthetical expressions aren't necessary - just generate its child expression
            return this.generateExpression(parentheticalExpressionNode.innerExpression, returnResult, indentLevel);
        }

        private generateTrueKeywordExpression(trueKeywordExpressionNode: TrueKeywordExpressionNode, returnResult: boolean, indentLevel: number): string {
            return this.indent(indentLevel) + (returnResult ? '_returnValue = ' : '') + 'new _Bool(true)';
        }

        private generateFalseKeywordExpression(falseKeywordExpressionNode: FalseKeywordExpressionNode, returnResult: boolean, indentLevel: number): string {
            return this.indent(indentLevel) + (returnResult ? '_returnValue = ' : '') + 'new _Bool(false)';
        }

        private generateBinaryOperationExpression(binOpExpressionNode: BinaryOperationExpressionNode, returnResult: boolean, indentLevel: number): string {
            var output: Array<string> = [],
                operand1: string,
                operand2: string;

            if (this.expressionReturnsItself(binOpExpressionNode.operand1)) {
                operand1 = this.generateExpression(this.unwrapSelfReturningExpression(binOpExpressionNode.operand1), false, 0);
            } else {
                operand1 = this.wrapInSelfExecutingFunction(binOpExpressionNode.operand1, indentLevel);
            }

            if (this.expressionReturnsItself(binOpExpressionNode.operand2)) {
                operand2 = this.generateExpression(this.unwrapSelfReturningExpression(binOpExpressionNode.operand2), false, 0);
            } else {
                operand2 = this.wrapInSelfExecutingFunction(binOpExpressionNode.operand2, indentLevel);
            }

            output.push(this.indent(indentLevel) + (returnResult ? '_returnValue = ' : ''));

            switch (binOpExpressionNode.operationType) {
                case BinaryOperationType.Addition:
                    output.push('_add');
                    break;
                case BinaryOperationType.Subtraction:
                    output.push('_subtract');
                    break;
                case BinaryOperationType.Multiplication:
                    output.push('_multiply');
                    break;
                case BinaryOperationType.Division:
                    output.push('_divide');
                    break;
                case BinaryOperationType.Comparison:
                    output.push('_equals');
                    break;
                case BinaryOperationType.LessThan:
                    output.push('_lessThan');
                    break;
                case BinaryOperationType.LessThanOrEqualTo:
                    output.push('_lessThanOrEqualTo');
                    break;
                default:
                    throw 'Unrecognized BinaryOperationType: ' + binOpExpressionNode[binOpExpressionNode.operationType];
            }
            output.push('(' + operand1 + ', ' + operand2 + ')');

            return output.join('');
        }

        private generateUnaryOperationExpression(unOpExpressionNode: UnaryOperationExpressionNode, returnResult: boolean, indentLevel: number): string {
            var output: Array<string> = [];
            output.push(this.indent(indentLevel) + (returnResult ? '_returnValue = ' : ''));
            switch (unOpExpressionNode.operationType) {
                case UnaryOperationType.Complement:
                    output.push('_complement')
                    break;
                case UnaryOperationType.Not:
                    output.push('_not');
                    break;
                default:
                    throw 'Unrecognized UnaryOperationType: ' + unOpExpressionNode[unOpExpressionNode.operationType];
            }
            output.push('(');
            if (this.expressionReturnsItself(unOpExpressionNode)) {
                output.push(this.generateExpression(this.unwrapSelfReturningExpression(unOpExpressionNode.operand), false, 0));
            } else {
                output.push(this.wrapInSelfExecutingFunction(unOpExpressionNode.operand, indentLevel));
            }
            output.push(')');
            return output.join('');
        }

        private generateIfThenElseExpression(ifExpressionNode: IfThenElseExpressionNode, returnResult: boolean, indentLevel: number): string {
            var output: Array<string> = [];
            output.push(this.indent(indentLevel) + 'if ((');
            if (this.expressionReturnsItself(ifExpressionNode.predicate)) {
                output.push(this.generateExpression(this.unwrapSelfReturningExpression(ifExpressionNode.predicate), false, 0));
            } else {
                output.push(this.wrapInSelfExecutingFunction(ifExpressionNode.predicate, indentLevel));
            }
            output.push(')._value) {\n');
            output.push(this.generateExpression(ifExpressionNode.consequent, returnResult, indentLevel + 1) + '\n');
            output.push(this.indent(indentLevel) + '} else {\n');
            output.push(this.generateExpression(ifExpressionNode.alternative, returnResult, indentLevel + 1) + '\n');
            output.push(this.indent(indentLevel) + '}\n');
            return output.join('');
        }

        private generateWhileExpression(whileExpressionNode: WhileExpressionNode, returnResult: boolean, indentLevel: number): string {
            var output: Array<string> = [];
            output.push(this.indent(indentLevel) + 'while ((');
            if (this.expressionReturnsItself(whileExpressionNode.whileConditionExpression)) {
                output.push(this.generateExpression(this.unwrapSelfReturningExpression(whileExpressionNode.whileConditionExpression), false, 0));
            } else {
                output.push(this.wrapInSelfExecutingFunction(whileExpressionNode.whileConditionExpression, indentLevel));
            }
            output.push(')._value) {\n');
            output.push(this.generateExpression(whileExpressionNode.whileBodyExpression, returnResult, indentLevel + 1) + '\n');
            output.push(this.indent(indentLevel) + '}\n');
            return output.join('');
        }

        private generateCaseExpression(caseExpressionNode: CaseExpressionNode, returnResult: boolean, indentLevel: number): string {
            var output: Array<string> = [];
            output.push(this.indent(indentLevel) + (returnResult ? '_returnValue = ' : '') + '_case(');
            if (this.expressionReturnsItself(caseExpressionNode.condition)) {
                output.push(this.generateExpression(this.unwrapSelfReturningExpression(caseExpressionNode.condition), false, 0));
            } else {
                output.push(this.wrapInSelfExecutingFunction(caseExpressionNode.condition, indentLevel));
            }
            output.push(', [\n');
            caseExpressionNode.caseOptionList.forEach((option, index) => {
                var isLast = index === caseExpressionNode.caseOptionList.length - 1;
                output.push(this.indent(indentLevel + 1) + '[' + this.translateTypeNameIfPrimitiveType(option.typeName) + ', ');
                output.push('(' + option.identiferName + ') => { return (');

                if (this.expressionReturnsItself(option.caseOptionExpression)) {
                    output.push(this.generateExpression(this.unwrapSelfReturningExpression(option.caseOptionExpression), false, 0));
                } else {
                    output.push(this.wrapInSelfExecutingFunction(option.caseOptionExpression, indentLevel));
                }

                output.push('); }');
                output.push(']' + (isLast ? '' : ',') + '\n');
            });
            output.push(this.indent(indentLevel) + '], this.type_name()._value)');
            return output.join('');
        }

        private generateIsVoidExpression(isVoidExpressionNode: IsVoidExpressionNode, returnResult: boolean, indentLevel: number): string {
            var output: Array<string> = [];
            output.push(this.indent(indentLevel) + '(');
            output.push(this.generateExpression(isVoidExpressionNode.isVoidCondition, returnResult, indentLevel));
            output.push(' ? new _Bool(false) : new _Bool(true))');
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
                //|| node.type === NodeType.BinaryOperationExpression
                //|| node.type === NodeType.UnaryOperationExpression
                //|| node.type === NodeType.MethodCallExpression
                || node.type === NodeType.TrueKeywordExpression
                || node.type === NodeType.FalseKeywordExpression
                || node.type === NodeType.NewExpression
                //|| node.type === NodeType.IsvoidExpression
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
                || node.type === NodeType.FalseKeywordExpression
                || node.type === NodeType.NewExpression
                || node.type === NodeType.IsvoidExpression) {

                return node;
            } else if (node.type === NodeType.BlockExpression) {
                return this.unwrapSelfReturningExpression((<BlockExpressionNode>node).expressionList[0]);
            } else {
                throw 'unwrapSelfReturningExpression() should not be called without testing whether the expression is self returning using expressionReturnsItself()'
            }
        }

        private wrapInSelfExecutingFunction(node: Node, indentLevel: number) {
            var output: Array<string> = [];
            output.push('(yield* (function *() {\n');
            output.push(this.indent(indentLevel + 2) + 'let _returnValue;\n');
            output.push(this.generateExpression(node, true, indentLevel + 2) + '\n');
            output.push(this.indent(indentLevel + 2) + 'return _returnValue;\n');
            output.push(this.indent(indentLevel + 1) + '}).apply(this))');
            return output.join('');
        }

        private translateTypeNameIfPrimitiveType(typeName: string): string {
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
        }
    }
} 
