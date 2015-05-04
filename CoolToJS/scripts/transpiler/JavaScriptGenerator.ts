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

            output.push('(function () {\n');
            output.push(this.indent(1) + '"use strict";\n\n');

            output.push(this.generateIOClass(ioFunctions, 1));

            (<ProgramNode>ast).classList.forEach(classNode => {
                if (['Object', 'IO', 'Int', 'String', 'Bool'].indexOf(classNode.className) === -1) {
                    output.push(this.generateClass(classNode, 1));
                }
            });

            output.push(this.indent(1) + 'new Main().main();\n');
            output.push('})();');
            return output.join('');
        }

        private generateIOClass(ioFunctions: IOFunctionDefinitions, indentLevel: number): string {
            var output: Array<string> = [];
            output.push(this.indent(indentLevel) + 'var IO = (function() {\n');
            output.push(this.indent(indentLevel + 1) + 'function IO() {\n');
            output.push(this.indent(indentLevel + 1) + '}\n');

            output.push(this.indent(indentLevel + 1) + 'IO.prototype.out_string = ' + ioFunctions.out_string + ';\n');
            output.push(this.indent(indentLevel + 1) + 'IO.prototype.out_int = ' + ioFunctions.out_int + ';\n');
            output.push(this.indent(indentLevel + 1) + 'IO.prototype.in_string = ' + ioFunctions.in_string + ';\n');
            output.push(this.indent(indentLevel + 1) + 'IO.prototype.in_int = ' + ioFunctions.in_int + ';\n');

            output.push(this.indent(indentLevel + 1) + 'return IO;\n');
            output.push(this.indent(indentLevel) + '})();\n\n');
            return output.join('');
        }

        private generateClass(classNode: ClassNode, indentLevel: number): string {
            var output: Array<string> = [];
            output.push(this.indent(indentLevel) + 'var ' + classNode.className + ' = (function() {\n');
            output.push(this.indent(indentLevel + 1) + 'function ' + classNode.className + '() {\n');

            classNode.propertyList.forEach(propertyNode => {
                output.push(this.generateClassProperty(propertyNode, indentLevel + 2));
            });

            output.push(this.indent(indentLevel + 1) + '}\n');

            classNode.methodList.forEach(methodNode => {
                output.push(this.generateClassMethod(methodNode, classNode, indentLevel + 1));
            });

            output.push(this.indent(indentLevel + 1) + 'return ' + classNode.className + ';\n');
            output.push(this.indent(indentLevel) + '})();\n\n');

            return output.join('');
        }

        private generateClassProperty(propertyNode: PropertyNode, indentLevel: number): string {
            var output: Array<string> = [];
            output.push(this.indent(indentLevel) + 'this.' + propertyNode.propertyName + ';\n');
            return output.join('');
        }

        private generateClassMethod(methodNode: MethodNode, classNode: ClassNode, indentLevel: number): string {

            // temporary - for the demo site, while we're still working on the code generation
            if (classNode.className === 'Main' && methodNode.methodName === 'main') {
                return '\
        Main.prototype.main = function () {\n\
            // this function is currently hardcoded \n\
            // while the code generator is being built\n\
            var hello = "Hello, ", \n\
	            name = "",\n\
                ending = "!\\n";\n\
            \n\
            var io = new IO();\n\
            io.out_string("Please enter your name:\\n");\n\
            io.in_string(function(input) {\n\
                name = input;\n\
                io.out_string(hello + name + ending);\n\
            });\n\
        };\n';
            }

            var output: Array<string> = [];
            output.push(this.indent(indentLevel) + classNode.className + '.prototype.' + methodNode.methodName + ' = function () {\n');
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