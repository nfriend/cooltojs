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
                console.log('[' + output.join(', ') + ']');
                return output;
            }
            // #endregion     

            while (!(stack.length === 1 && stack[0].syntaxKind === StartSyntaxKind && isAtEndOfInput())) {
                var state: number = 0,
                    tableEntry: ParseTableEntry;

                for (var i = 0; i < stack.length; i++) {
                    tableEntry = slr1ParseTable[state][stack[i].syntaxKind];
                    state = tableEntry.nextState;
                }

                tableEntry = slr1ParseTable[state][tokens[inputPointer].token];

                if (tableEntry === null || (tableEntry.action === Action.Accept && isAtEndOfInput())) {
                    tableEntry = slr1ParseTable[state][SyntaxKind.EndOfInput];
                }

                // if tableEntry is STILL null, we have a parse error.
                if (tableEntry === null) {
                    // TODO: better error reporting
                    var errorMessage = '';
                    if (tokens[inputPointer].token === SyntaxKind.EndOfInput) {
                        errorMessage = 'Line '
                        + tokens[inputPointer].location.line
                        + ', column '
                        + tokens[inputPointer].location.column
                        + ':\tParse error: unexpected end of input';
                    } else {
                        errorMessage = 'Line '
                        + tokens[inputPointer].location.line
                        + ', column '
                        + tokens[inputPointer].location.column
                        + ':\tParse error: unexpected token: "'
                        + tokens[inputPointer].match
                        + '"';
                    }

                    return {
                        success: false,
                        errorMessages: [{
                            message: errorMessage,
                            location: {
                                line: tokens[inputPointer].location.line,
                                column: tokens[inputPointer].location.column,
                                length: tokens[inputPointer].match ? tokens[inputPointer].match.length : 1
                            }
                        }]
                    };
                }

                if (tableEntry.action === Action.Shift) {
                    stack.push({
                        syntaxKind: tokens[inputPointer].token,
                        token: tokens[inputPointer],
                        parent: null,
                        children: [],
                        state: tableEntry.nextState
                    });

                    inputPointer++;
                } else if (tableEntry.action === Action.Reduce) {
                    var production = productions[tableEntry.productionIndex];
                    var removedItems = stack.splice(-1 * production.popCount, production.popCount);
                    var newStackItem = {
                        syntaxKind: production.reduceResult,
                        state: null,
                        children: removedItems,
                        parent: null,
                    };

                    for (var i = 0; i < newStackItem.children.length; i++) {
                        newStackItem.children[i].parent = newStackItem;
                    }

                    stack.push(newStackItem);
                } else {
                    // Parse error!
                    // TODO: does this always mean "unexpected end of program"?
                    var errorMessage = 'Line '
                        + tokens[inputPointer].location.line
                        + ', column '
                        + tokens[inputPointer].location.column
                        + ':\tParse error: expected end of program, but instead saw "'
                        + tokens[inputPointer].match
                        + '"';

                    return {
                        success: false,
                        errorMessages: [{
                            message: errorMessage,
                            location: {
                                line: tokens[inputPointer].location.line,
                                column: tokens[inputPointer].location.column,
                                length: tokens[inputPointer].match ? tokens[inputPointer].match.length : 1
                            }
                        }]
                    };
                }

                printStack();
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