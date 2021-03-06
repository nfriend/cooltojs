﻿module CoolToJS {

    export interface Token {
        token: SyntaxKind;
        match: string;
        location: SourceLocation;

        // for debugging purposes, so we can see the name
        // of the token without looking it up in the enum definition
        tokenName: string;
    }

    export class LexicalAnalyzer {

        private tabLength = 4;

        public Analyze = (coolProgramSource: string): LexicalAnalyzerOutput => {
            var tokens: Token[] = [],
                currentLineNumber: number = 1,
                currentColumnNumber: number = 1,
                errorMessages: Array<ErrorMessage> = [];

            while (coolProgramSource.length > 0) {
                var longestMatch: Token = null;
                for (var i = 0; i < CoolToJS.TokenLookup.length; i++) {
                    var currentTokenOption = CoolToJS.TokenLookup[i],
                        matchIsKeyword = CoolToJS.isKeyword(currentTokenOption.token),
                        matchString = null;

                    if (currentTokenOption.matchFunction) {
                        matchString = currentTokenOption.matchFunction(coolProgramSource);
                    } else {
                        var match = currentTokenOption.regex.exec(coolProgramSource);
                        if (match !== null && typeof match[1] !== 'undefined') {
                            matchString = match[1];
                        } else {
                            matchString = null;
                        }
                    }

                    if (!matchString) {
                        continue;
                    }

                    if (!longestMatch || matchString.length > longestMatch.match.length) {
                        longestMatch = {
                            token: currentTokenOption.token,
                            tokenName: SyntaxKind[currentTokenOption.token],
                            match: matchString,
                            location: {
                                line: currentLineNumber,
                                column: currentColumnNumber,
                                length: matchString.length
                            }
                        }
                    }
                }

                if (longestMatch) {
                    // we successfully found a match

                    if (longestMatch.token === SyntaxKind.NewLine) {
                        currentLineNumber++;
                        currentColumnNumber = 1;
                    } else if (longestMatch.token === SyntaxKind.String || longestMatch.token === SyntaxKind.Comment) {
                        // strings and comments can also have newlines 
                        // in them, if they're multi-line
                        var lines = longestMatch.match.split('\n');
                        currentLineNumber += lines.length - 1;
                        if (lines.length > 1) {
                            currentColumnNumber = lines[lines.length - 1].length + 1;
                        } else {
                            currentColumnNumber += longestMatch.match.length;
                        }

                    } else if (longestMatch.token === SyntaxKind.Tab) {
                        currentColumnNumber += this.tabLength;
                    } else if (longestMatch.token !== SyntaxKind.CarriageReturn) {
                        // update the column counter
                        currentColumnNumber += longestMatch.match.length;
                    }

                    tokens.push(longestMatch);
                    coolProgramSource = coolProgramSource.slice(longestMatch.match.length);

                } else {
                    // we weren't able to find a match

                    var errorMessage = 'Syntax error: Unexpected character sequence near "'
                        + coolProgramSource.slice(0, 20).replace(/\r\n|\r|\n|\t|[\s]+/g, ' ')
                        + '..."';

                    // figure out an approximate length of the error token
                    var untilWhitespaceMatch = /^([^\s]*)/.exec(coolProgramSource);
                    if (untilWhitespaceMatch === null || typeof untilWhitespaceMatch[1] === 'undefined') {
                        var length = 1;
                    } else {
                        var length = untilWhitespaceMatch[1].length;
                    }

                    errorMessages.push({
                        message: errorMessage,
                        location: {
                            line: currentLineNumber,
                            column: currentColumnNumber,
                            length: length
                        }
                    });

                    // chop off the problematic chunk of input and try to keep analyzing
                    coolProgramSource = coolProgramSource.slice(length);
                    currentColumnNumber += length;
                }
            }

            //for (var i = 0; i < tokens.length; i++) {
            //    console.log(SyntaxKind[tokens[i].token] + ': "' + tokens[i].match + '", line: ' + tokens[i].location.line + ', column: ' + tokens[i].location.column);
            //}

            // put an EndOfInput on the end of the token array
            tokens.push({
                token: SyntaxKind.EndOfInput,
                tokenName: SyntaxKind[SyntaxKind.EndOfInput],
                match: null,
                location: {
                    column: currentColumnNumber,
                    line: currentLineNumber,
                    length: 1
                }
            });

            return {
                success: errorMessages.length === 0,
                tokens: tokens,
                errorMessages: errorMessages,
            };
        }
    }
}