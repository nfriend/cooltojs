module CoolToJS {

    interface TokenMatch {
        token: TokenType;
        match: string
    }

    export class LexicalAnalyzer {

        public Analyze = (coolProgramSource: string) => {
            var tokenizedSource: TokenMatch[] = [];
            while (coolProgramSource.length > 0) {
                var longestMatch: TokenMatch = null;
                for (var i = 0; i < CoolToJS.TokenLookup.length; i++) {
                    var currentTokenOption = CoolToJS.TokenLookup[i];
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
                    throw 'Syntax error';
                }

                tokenizedSource.push(longestMatch);
                coolProgramSource = coolProgramSource.slice(longestMatch.match.length);
                console.log('"' + coolProgramSource + '"');
            }

            for (var i = 0; i < tokenizedSource.length; i++) {
                console.log(TokenType[tokenizedSource[i].token] + ': "' + tokenizedSource[i].match + '"');
            }
        }
    }
}