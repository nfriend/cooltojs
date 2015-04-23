module CoolToJS {

    export interface TokenMatch {
        token: TokenType;
        match: string;
        location: SourceLocation;
    }

    export class LexicalAnalyzer {

        private tabLength = 4;

        public Analyze = (coolProgramSource: string): LexicalAnalyzerOutput => {
            var tokens: TokenMatch[] = [],
                currentLineNumber: number = 1,
                currentColumnNumber: number = 1,
                errorMessages: Array<ErrorMessage> = [];

            while (coolProgramSource.length > 0) {
                var longestMatch: TokenMatch = null;
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

                    if (longestMatch.token === TokenType.NewLine) {
                        currentLineNumber++;
                        currentColumnNumber = 1;
                    } else if (longestMatch.token === TokenType.String) {
                        // strings call also have newlines in them, if they're
                        // a multi-line string
                        var lines = longestMatch.match.split('\n');
                        currentLineNumber += lines.length - 1;
                        if (lines.length > 1) {
                            currentColumnNumber = lines[lines.length - 1].length + 1;
                        }

                    } else if (longestMatch.token === TokenType.Tab) {
                        currentColumnNumber += this.tabLength;
                    } else if (longestMatch.token !== TokenType.CarriageReturn) {
                        // update the column counter
                        currentColumnNumber += longestMatch.match.length;
                    }

                    tokens.push(longestMatch);
                    coolProgramSource = coolProgramSource.slice(longestMatch.match.length);

                } else {
                    // we weren't able to find a match

                    var errorMessage = 'Line '
                        + currentLineNumber
                        + ', column '
                        + currentColumnNumber
                        + ':\tSyntax error: Unexpected character sequence near "'
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

            for (var i = 0; i < tokens.length; i++) {
                console.log(TokenType[tokens[i].token] + ': "' + tokens[i].match + '", line: ' + tokens[i].location.line + ', column: ' + tokens[i].location.column);
            }

            return {
                success: errorMessages.length === 0,
                tokens: tokens,
                errorMessages: errorMessages
            };
        }
    }
}