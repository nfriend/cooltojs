module CoolToJS {

    interface TokenMatch {
        token: TokenType;
        match: string
    }

    export class LexicalAnalyzer {

        private tokenLookup = [
            {
                token: TokenType.Integer,
                regex: /^([0-9]+)\b/,
            },
            {
                token: TokenType.Keyword,
                regex: /^(class|else|false|fi|if|in|inherits|isvoid|let|loop|pool|then|while|case|esac|new|of|not|true)\b/,
            },
            {
                token: TokenType.ObjectIdentifier,
                regex: /^([a-zA-Z][a-zA-Z0-9_-]+)\b/,
            },
            {
                token: TokenType.WhiteSpace,
                regex: /^(\s+)/,
            },
        ];

        public Analyze = (coolProgramSource: string) => {
            var tokenizedSource: TokenMatch[] = [];
            while (coolProgramSource.length > 0) {
                var longestMatch: TokenMatch = null;
                for (var i = 0; i < this.tokenLookup.length; i++) {
                    var currentTokenOption = this.tokenLookup[i];
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