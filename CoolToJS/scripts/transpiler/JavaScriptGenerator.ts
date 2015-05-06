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
            output.push('let inputGenerator;\n\n')
            output.push(this.generateIOClass(ioFunctions, 0));
            output.push('\n');

            (<ProgramNode>ast).classList.forEach(classNode => {
                if (['Object', 'IO', 'Int', 'String', 'Bool'].indexOf(classNode.className) === -1) {
                    output.push(this.generateClass(classNode, 0));
                    output.push('\n');
                }
            });
            output.push('inputGenerator = (new Main()).main();\n');
            output.push('inputGenerator.next()\n');
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
                output.push(this.generateClassMethod(methodNode, classNode, indentLevel + 1));
            });

            output.push(this.indent(indentLevel) + '}\n');

            return output.join('');
        }

        private generateClassProperty(propertyNode: PropertyNode, indentLevel: number): string {
            var output: Array<string> = [];
            output.push(this.indent(indentLevel) + propertyNode.propertyName + ';\n');
            return output.join('');
        }

        private generateClassMethod(methodNode: MethodNode, classNode: ClassNode, indentLevel: number): string {
            if (classNode.className === 'Main' && methodNode.methodName === 'main') {
                var output: Array<string> = [];
                output.push(this.indent(indentLevel) + '*main() {\n');
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
            }

            var output: Array<string> = [];
            output.push(this.indent(indentLevel) + methodNode.methodName + '() {\n');
            output.push(this.indent(indentLevel) + '};\n');
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
    }
} 