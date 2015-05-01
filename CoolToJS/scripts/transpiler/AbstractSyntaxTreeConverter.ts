module CoolToJS.AST {
    'use strict';

    export class AbstractSyntaxTreeConverter {
        Convert = (syntaxTree: SyntaxTree): AST.Node => {
            var convertedNode: Node;

            // use a shallow copy of the provided tree so we
            // don't alter the original
            syntaxTree = Utility.ShallowCopySyntaxTree(syntaxTree);

            if (this.isRecursiveSyntaxKind(syntaxTree.syntaxKind)) {
                this.flattenRecursion(syntaxTree);
            }

            if (syntaxTree.syntaxKind === SyntaxKind.Program) {
                convertedNode = new ProgramNode();

                // create Class nodes for each class in this program
                for (var i = 0; i < syntaxTree.children.length; i++) {
                    if (syntaxTree.children[i].syntaxKind === SyntaxKind.Class) {
                        var childClassNode = this.Convert(syntaxTree.children[i]);
                        childClassNode.parent = convertedNode;
                        convertedNode.children.push(childClassNode);
                    }
                }
            } else if (syntaxTree.syntaxKind === SyntaxKind.Class) {
                var classNode = new ClassNode(syntaxTree.children[1].token.match);
                if (syntaxTree.children[2].syntaxKind === SyntaxKind.InheritsKeyword) {
                    classNode.superClassName = syntaxTree.children[3].token.match;
                }

                // find the FeatureList child, and use its children to construct
                // this class's methods and properties
                for (var i = 0; i < syntaxTree.children.length; i++) {
                    if (syntaxTree.children[i].syntaxKind === SyntaxKind.FeatureList) {
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
            } else if (syntaxTree.syntaxKind === SyntaxKind.Feature) {

                //TODO
                convertedNode = new MethodNode();
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

        private isRecursiveSyntaxKind(syntaxKind: SyntaxKind) {
            return (syntaxKind === SyntaxKind.Program
                || syntaxKind === SyntaxKind.FeatureList
                || syntaxKind === SyntaxKind.FormalList
                || syntaxKind === SyntaxKind.ExpressionList
                || syntaxKind === SyntaxKind.ExpressionSeries);
        }
    }
} 