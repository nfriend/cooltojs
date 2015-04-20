module CoolToJS {

    export interface TokenMatch {
        token: TokenType;
        match: string
    }

    export interface LexicalAnalyzerOutput {
        success: boolean;
        tokens?: TokenMatch[];
        errorMessages?: string[];
    }

    export class LexicalAnalyzer {

        public Analyze = (coolProgramSource: string): LexicalAnalyzerOutput => {
            var tokens: TokenMatch[] = [],
                currentLineNumber: number = 1,
                currentColumnNumber: number = 1;

            while (coolProgramSource.length > 0) {
                var longestMatch: TokenMatch = null;
                for (var i = 0; i < CoolToJS.TokenLookup.length; i++) {
                    var currentTokenOption = CoolToJS.TokenLookup[i],
                        matchIsKeyword = CoolToJS.isKeyword(currentTokenOption.token);
                    var match = currentTokenOption.regex.exec(coolProgramSource);
                    if (match === null || typeof match[1] === 'undefined') {
                        continue;
                    }
                    if (!longestMatch || match[1].length > longestMatch.match.length) {
                        longestMatch = {
                            token: currentTokenOption.token,
                            match: match[1]
                        }
                    }
                }

                if (!longestMatch) {
                    return {
                        success: false,
                        errorMessages: ['Syntax error: Unexpected character at line '
                            + currentLineNumber
                            + ', column '
                            + currentColumnNumber
                            + ', near "'
                            + coolProgramSource.slice(0, 20).replace(/\r\n|\r|\n|\t|[\s]+/g, ' ')
                            + '..."']
                    };
                }

                if (longestMatch.token === TokenType.WhiteSpace) {
                    // increment the line counter appropriately if
                    // the whitespace contains newline characters
                    var newlineCount = longestMatch.match.split(/\r\n|\r|\n|/).length - 1;
                    if (newlineCount > 0) {
                        currentLineNumber += newlineCount;
                        currentColumnNumber = 1;
                    }
                } else {
                    // update the column counter
                    currentColumnNumber += longestMatch.match.length;
                }

                tokens.push(longestMatch);
                coolProgramSource = coolProgramSource.slice(longestMatch.match.length);
            }

            for (var i = 0; i < tokens.length; i++) {
                console.log(TokenType[tokens[i].token] + ': "' + tokens[i].match + '"');
            }

            return {
                success: true,
                tokens: tokens
            };
        }
    }
}