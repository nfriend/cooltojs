module CoolToJS {

    export interface SyntaxTree {
        syntaxKind: SyntaxKind;
        token?: Token;
        parent: SyntaxTree;
        children: Array<SyntaxTree>;
    }

    export class Parser {
        public Parse = (lexerOutput: LexicalAnalyzerOutput): ParserOutput => {
            var tokens = lexerOutput.tokens,
                warnings: Array<WarningMessage> = lexerOutput.warningMessages || [],
                stack: Array<SyntaxTree> = [],
                inputPointer: number = 0,
                isAtEndOfInput = () => {
                    return inputPointer === tokens.length - 1;
                },

                // records which tokens we've already added warnings for, 
                // to avoid duplicate warnings
                alreadyWarnedTokens: Array<Token> = [],
                recordAmbiguousParseWarning = () => {

                    var warningToken;
                    for (var i = inputPointer; i >= 0; i--) {
                        if (tokens[i].token === SyntaxKind.LetKeyword) {
                            warningToken = tokens[i];
                            break;
                        }
                    }

                    warningToken = warningToken || tokens[inputPointer];

                    if (alreadyWarnedTokens.indexOf(warningToken) !== -1) {
                        return;
                    }

                    var warningMessage = 'Line ' + warningToken.location.line + ', column ' + warningToken.location.column + ':\t'
                        + 'Ambiguous shift/reduce detected in parse table.  Automatically took shift option. '
                        + 'To remove abiguity and ensure proper parsing, ensure all "let" blocks surround their contents in curly brackets.'

                    warnings.push({
                        message: warningMessage,
                        location: {
                            line: warningToken.location.line,
                            column: warningToken.location.column,
                            length: warningToken.match ? warningToken.match.length : 1
                        }
                    });

                    alreadyWarnedTokens.push(warningToken);
                }

            // remove any characters we don't care about while parsing
            tokens = this.cleanseTokenArray(tokens);

            // #region for debugging
            
            // prints the current stack to the console
            var printStack = () => {
                var output = [];
                for (var i = 0; i < stack.length; i++) {
                    output.push(SyntaxKind[stack[i].syntaxKind]);
                }
                console.log('[' + output.join(', ') + ']');
                return output;
            }
            // #endregion     

            // keep looping until the only item on the stack is the start symbol and we have no more input to read
            while (!(stack.length === 1 && stack[0].syntaxKind === StartSyntaxKind && isAtEndOfInput())) {
                var state: number = 0,
                    tableEntry: ParseTableEntry|ParseTableEntry[];

                for (var i = 0; i < stack.length; i++) {
                    tableEntry = slr1ParseTable[state][stack[i].syntaxKind];

                    // ambiguous entries appear as Arrays.
                    if (tableEntry instanceof Array) {
                        tableEntry = tableEntry[0];
                        recordAmbiguousParseWarning();
                    }
                    state = (<ParseTableEntry>tableEntry).nextState;
                }

                tableEntry = slr1ParseTable[state][tokens[inputPointer].token];
                if (tableEntry instanceof Array) {
                    tableEntry = tableEntry[0];
                    recordAmbiguousParseWarning();
                }

                if (tableEntry === null || ((<ParseTableEntry>tableEntry).action === Action.Accept && isAtEndOfInput())) {
                    tableEntry = slr1ParseTable[state][SyntaxKind.EndOfInput];
                    if (tableEntry instanceof Array) {
                        tableEntry = tableEntry[0];
                        recordAmbiguousParseWarning();
                    }
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

                if ((<ParseTableEntry>tableEntry).action === Action.Shift) {
                    stack.push({
                        syntaxKind: tokens[inputPointer].token,
                        token: tokens[inputPointer],
                        parent: null,
                        children: [],
                    });

                    inputPointer++;
                } else if ((<ParseTableEntry>tableEntry).action === Action.Reduce) {
                    var production = productions[(<ParseTableEntry>tableEntry).productionIndex];
                    var removedItems = stack.splice(-1 * production.popCount, production.popCount);
                    var newStackItem = {
                        syntaxKind: production.reduceResult,
                        children: removedItems,
                        parent: null,
                    };

                    // set the new item as the parent of the removed items
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

                //printStack();
            }

            //this.printSyntaxTree(stack[0]);

            return {
                success: true,
                syntaxTree: stack[0],
                warningMessages: warnings
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
                    && tokens[i].token !== SyntaxKind.Tab
                    && tokens[i].token !== SyntaxKind.WhiteSpace) {

                    cleanArray.push(tokens[i]);
                }
            }

            return cleanArray;
        }

        private printSyntaxTree(syntaxTree: SyntaxTree, indent: string = '', last: boolean = true) {
            var stringToWrite = indent;
            if (last) {
                stringToWrite += '\\-';
                indent += '  ';
            } else {
                stringToWrite += '|-';
                indent += '| ';
            }
            console.log(stringToWrite + SyntaxKind[syntaxTree.syntaxKind]);

            for (var i = 0; i < syntaxTree.children.length; i++) {
                this.printSyntaxTree(syntaxTree.children[i], indent, i === syntaxTree.children.length - 1);
            }
        }
    }
}