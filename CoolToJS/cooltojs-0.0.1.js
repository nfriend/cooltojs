var CoolToJS;
(function (CoolToJS) {
    // finds all Cool program references, transpiles the source to JavaScript, 
    // and runs the final product in the page
    function Run() {
        // get all <script> elements of type "text/cool" and get the script's source as a string
        var coolProgramReferences = document.querySelectorAll('script[type="text/cool"]');
        var coolPrograms = [];
        for (var i = 0; i < coolProgramReferences.length; i++) {
            var filename = coolProgramReferences[i].attributes['src'].value;
            // call a separate function here to avoid closure problem
            getCoolProgramText(i, filename);
        }
        function getCoolProgramText(index, filename) {
            makeAjaxRequest(filename, function (responseText) {
                coolPrograms[index] = ({ filename: filename, program: responseText });
                if (coolPrograms.length == coolProgramReferences.length) {
                    allCoolProgramsFetchedSuccessfully();
                }
            });
        }
        // generic function to make AJAX call
        function makeAjaxRequest(url, successCallback, errorCallback) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                    if (xmlhttp.status == 200) {
                        successCallback(xmlhttp.responseText);
                    }
                    else {
                        if (errorCallback) {
                            errorCallback();
                        }
                    }
                }
            };
            xmlhttp.open('GET', url, true);
            xmlhttp.send();
        }
        // displays the source of all referenced Cool programs on the screen
        function allCoolProgramsFetchedSuccessfully() {
            CoolToJS.Transpile({
                coolProgramSources: coolPrograms.map(function (x) {
                    return x.program;
                }),
                outputFunction: function (output) {
                    document.getElementById('output').innerHTML += output;
                }
            });
        }
    }
    CoolToJS.Run = Run;
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    var LexicalAnalyzer = (function () {
        function LexicalAnalyzer() {
            var _this = this;
            this.tokenLookup = [
                {
                    token: 1 /* Integer */,
                    regex: /^([0-9]+)\b/,
                },
                {
                    token: 6 /* Keyword */,
                    regex: /^(class|else|false|fi|if|in|inherits|isvoid|let|loop|pool|then|while|case|esac|new|of|not|true)\b/,
                },
                {
                    token: 3 /* ObjectIdentifier */,
                    regex: /^([a-zA-Z][a-zA-Z0-9_-]+)\b/,
                },
                {
                    token: 7 /* WhiteSpace */,
                    regex: /^(\s+)/,
                },
            ];
            this.Analyze = function (coolProgramSource) {
                var tokenizedSource = [];
                while (coolProgramSource.length > 0) {
                    var longestMatch = null;
                    for (var i = 0; i < _this.tokenLookup.length; i++) {
                        var currentTokenOption = _this.tokenLookup[i];
                        var match = currentTokenOption.regex.exec(coolProgramSource);
                        if (match === null || typeof match[1] === 'undefined') {
                            continue;
                        }
                        if (!longestMatch || match[1].length > longestMatch.match.length) {
                            longestMatch = {
                                token: currentTokenOption.token,
                                match: match[1]
                            };
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
                    console.log(CoolToJS.TokenType[tokenizedSource[i].token] + ': "' + tokenizedSource[i].match + '"');
                }
            };
        }
        return LexicalAnalyzer;
    })();
    CoolToJS.LexicalAnalyzer = LexicalAnalyzer;
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    var Parser = (function () {
        function Parser() {
            this.Parse = function () {
            };
        }
        return Parser;
    })();
    CoolToJS.Parser = Parser;
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    (function (TokenType) {
        TokenType[TokenType["Integer"] = 1] = "Integer";
        TokenType[TokenType["TypeIdentifier"] = 2] = "TypeIdentifier";
        TokenType[TokenType["ObjectIdentifier"] = 3] = "ObjectIdentifier";
        TokenType[TokenType["SpecialNotation"] = 4] = "SpecialNotation";
        TokenType[TokenType["String"] = 5] = "String";
        TokenType[TokenType["Keyword"] = 6] = "Keyword";
        TokenType[TokenType["WhiteSpace"] = 7] = "WhiteSpace";
    })(CoolToJS.TokenType || (CoolToJS.TokenType = {}));
    var TokenType = CoolToJS.TokenType;
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    function Transpile(transpilerOptions) {
        var coolProgramSources = transpilerOptions.coolProgramSources;
        if (typeof coolProgramSources === 'string') {
            var concatenatedCoolProgram = coolProgramSources;
        }
        else {
            var concatenatedCoolProgram = coolProgramSources.join('\n');
        }
        if (transpilerOptions.outputFunction) {
            var outputFunction = transpilerOptions.outputFunction;
        }
        else {
            var outputFunction = function (output) {
                console.log(output);
            };
        }
        outputFunction('Testing output function.');
        var lexicalAnalyzer = new CoolToJS.LexicalAnalyzer();
        //lexicalAnalyzer.Analyze(concatenatedCoolProgram);
        var testString = '987 else if case esac sdHU9 \
        \
        sd33_4 ';
        lexicalAnalyzer.Analyze(testString);
    }
    CoolToJS.Transpile = Transpile;
})(CoolToJS || (CoolToJS = {}));
//# sourceMappingURL=cooltojs-0.0.1.js.map