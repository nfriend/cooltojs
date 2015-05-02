module CoolToJS.AST {
    'use strict';

    export class AbstractSyntaxTreeConverter {
        Convert = (syntaxTree: SyntaxTree): AST.Node => {
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
                        var childClassNode = this.Convert(syntaxTree.children[i]);
                        childClassNode.parent = convertedNode;
                        convertedNode.children.push(childClassNode);
                    }
                }
            }

            /* CLASS */
            else if (syntaxTree.syntaxKind === SyntaxKind.Class) {
                var classNode = new ClassNode(syntaxTree.children[1].token.match);
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
                                var childFeatureNode = this.Convert(syntaxTree.children[i].children[j]);
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

                    var methodNode = new MethodNode(syntaxTree.children[0].token.match);

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
                        var methodBodyNode = this.Convert(syntaxTree.children[7])
                        methodBodyNode.parent = methodNode;
                        methodNode.children.push(methodBodyNode);
                    } else {
                        // this method has no parameters
                        methodNode.returnTypeName = syntaxTree.children[4].token.match;

                        // convert the method body
                        var methodBodyNode = this.Convert(syntaxTree.children[6])
                        methodBodyNode.parent = methodNode;
                        methodNode.children.push(methodBodyNode);
                    }

                    convertedNode = methodNode;
                } else if (syntaxTree.children[1].syntaxKind === SyntaxKind.Colon) {
                    // we should convert into a property

                    var propertyNode = new PropertyNode(syntaxTree.children[0].token.match);
                    propertyNode.typeName = syntaxTree.children[2].token.match;

                    if (syntaxTree.children[4]) {
                        // if this property has an initializer

                        // convert the property initializer
                        var propertyInitializerNode = this.Convert(syntaxTree.children[4])
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
                if (syntaxTree.children[1].syntaxKind === SyntaxKind.AssignmentOperator) {
                    var assignmentExprNode = new AssignmentExpressionNode();
                    assignmentExprNode.identifierName = syntaxTree.children[0].token.match;

                    var assignmentExpression = this.Convert(syntaxTree.children[2]);
                    assignmentExpression.parent = assignmentExprNode;
                    assignmentExprNode.children.push(assignmentExpression);

                    convertedNode = assignmentExprNode;
                }

                /* METHOD CALL EXPRESSION */
                else if (syntaxTree.children[1].syntaxKind === SyntaxKind.DotOperator
                    || syntaxTree.children[1].syntaxKind === SyntaxKind.AtSignOperator
                    || (syntaxTree.children[0].syntaxKind === SyntaxKind.ObjectIdentifier
                        && syntaxTree.children[1].syntaxKind === SyntaxKind.OpenParenthesis)) {

                    var methodCallExprNode = new MethodCallExpressionNode(),
                        expressionListIndex: number;

                    if (syntaxTree.children[1].syntaxKind === SyntaxKind.DotOperator) {
                        // standard method call on an expression

                        methodCallExprNode.methodName = syntaxTree.children[2].token.match;
                        expressionListIndex = 4;

                    } else if (syntaxTree.children[1].syntaxKind === SyntaxKind.AtSignOperator) {
                        // method call to parent class
                        methodCallExprNode.methodName = syntaxTree.children[4].token.match;
                        methodCallExprNode.isCallToParent = true;
                        expressionListIndex = 6;

                    } else if (syntaxTree.children[1].syntaxKind === SyntaxKind.OpenParenthesis) {
                        // method call to implied "self"

                        methodCallExprNode.methodName = syntaxTree.children[0].token.match;
                        methodCallExprNode.isCallToSelf = true;
                        expressionListIndex = 3;
                    }

                    if (syntaxTree.children[expressionListIndex].syntaxKind === SyntaxKind.ExpressionList) {
                        this.flattenRecursion(syntaxTree.children[expressionListIndex]);

                        for (var i = 0; i < syntaxTree.children[expressionListIndex].children.length; i++) {
                            if (syntaxTree.children[4].children[i].syntaxKind === SyntaxKind.Expression) {
                                var parameterExprNode = this.Convert(syntaxTree.children[expressionListIndex].children[i]);
                                parameterExprNode.parent = methodCallExprNode;
                                methodCallExprNode.children.push(parameterExprNode);
                            }
                        }
                    }

                    convertedNode = methodCallExprNode;
                }
            }

            /*  */
            else {
                convertedNode = new ProgramNode();
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
    }
} 