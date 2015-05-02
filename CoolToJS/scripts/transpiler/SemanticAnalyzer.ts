module CoolToJS {
    export class SemanticAnalyzer {
        Analyze = (astConvertOutput: ASTConverterOutput): SemanticAnalyzerOutput => {
            var errorMessages = astConvertOutput.errorMessages || [];
            var warningMessages = astConvertOutput.warningMessages || [];
            this.analyze(astConvertOutput.abstractSyntaxTree, errorMessages, warningMessages);

            return {
                success: errorMessages.length === 0,
                errorMessages: errorMessages,
                warningMessages: warningMessages
            }
        };

        analyze = (ast: Node, errorMessages: Array<ErrorMessage>, warningMessages: Array<WarningMessage>): void => {

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
            }

            /* CLASS */
            else if (ast.type === NodeType.Class) {
                var classNode = <ClassNode>ast;

                // ensure that exactly all method names are unique
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

                // ensure that exactly all property names are unique
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
            }

            ast.children.forEach(node => {
                this.analyze(node, errorMessages, warningMessages);
            });
        }
    }
}