module CoolToJS {

    export interface SyntaxTree {
        syntaxKind: SyntaxKind;
        token?: Token;
        parent: SyntaxTree;
        children: Array<SyntaxTree>;
    }

    interface SyntaxTreeWithState extends SyntaxTree {
        state: number;
    }

    export class Parser {
        public Parse = (tokens: Array<Token>): ParserOutput => {
            var stack: Array<SyntaxTreeWithState> = [],
                inputPointer: number = 0,
                isAtEndOfInput = () => {
                    return inputPointer === tokens.length - 1;
                }

            tokens = this.cleanseTokenArray(tokens);

            // #region for debugging
            var printStack = () => {
                var output = [];
                for (var i = 0; i < stack.length; i++) {
                    output.push(SyntaxKind[stack[i].syntaxKind]);
                }
                return output;
            }
            // #endregion     

            while (!(stack.length === 1 && stack[0].syntaxKind === StartSyntaxKind && isAtEndOfInput())) {

                var state: number = stack.length > 0 ? stack[0].state : 0,
                    tableEntry: ParseTableEntry = slr1ParseTable[state][stack[i].syntaxKind];

                var nextTableEntry: ParseTableEntry = slr1ParseTable[state][tokens[inputPointer].token];
                if (nextTableEntry === null || (nextTableEntry.action === Action.Accept && isAtEndOfInput()))
                    nextTableEntry = slr1ParseTable[state][SyntaxKind.EndOfInput];
                
                if (nextTableEntry.action === Action.Shift) {
                    stack.push({
                        syntaxKind: tokens[inputPointer].token,
                        token: tokens[inputPointer],
                        parent: null,
                        children: [],
                        state: state
                    });

                    inputPointer++;
                } else if (nextTableEntry.action === Action.Reduce) {
                    var production = productions[nextTableEntry.productionIndex];
                    var removedItems = stack.splice(-1 * production.popCount, production.popCount);
                    var newStackItem = {
                        syntaxKind: production.reduceResult,
                        state: state,
                        children: removedItems,
                        parent: null,
                    };

                    for (var i = 0; i < newStackItem.children.length; i++) {
                        newStackItem.children[i].parent = newStackItem;
                    }

                    stack.push(newStackItem);
                    inputPointer++;
                } else {
                    throw 'Do we ever get here?';
                }
            }

            return {
                success: true,
                syntaxTree: stack[0]
            }

        }

        // returns a copy of the provided array with whitespace,
        // newlines, comments, etc. removed
        private cleanseTokenArray(tokens: Array<Token>): Array<Token> {
            var cleanArray: Array<Token> = [];
            for (var i = 0; i < tokens.length; i++) {
                if (tokens[i].token !== SyntaxKind.CarriageReturn
                    && tokens[i].token !== SyntaxKind.Comment
                    && tokens[i].token !== SyntaxKind.NewLine
                    && tokens[i].token !== SyntaxKind.String
                    && tokens[i].token !== SyntaxKind.Tab
                    && tokens[i].token !== SyntaxKind.WhiteSpace) {

                    cleanArray.push(tokens[i]);
                }
            }

            return cleanArray;
        }
    }
}