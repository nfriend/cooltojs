module CoolToJS.AST {
    'use strict';

    export class AbstractSyntaxTreeConverter {
        Convert = (syntaxTree: SyntaxTree): AST.Node => {
            var convertedNode: Node;

            if (this.isRecursiveSyntaxKind(syntaxTree.syntaxKind)) {
                this.flattenRecursion(syntaxTree);
            }

            if (syntaxTree.syntaxKind === SyntaxKind.Program) {
                convertedNode = new ProgramNode();
                for (var i = 0; i < syntaxTree.children.length; i++) {
                    if (syntaxTree.children[i].syntaxKind === SyntaxKind.Class) {
                        var classNode = this.Convert(syntaxTree.children[i]);
                        classNode.parent = convertedNode;
                        convertedNode.children.push(classNode);
                    }
                }
            } else if (syntaxTree.syntaxKind === SyntaxKind.Class) {
                convertedNode = new ClassNode(syntaxTree.children[1].token.match);
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