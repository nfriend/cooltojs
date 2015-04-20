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
            this.Analyze = function (coolProgramSource) {
                var tokenizedSource = [];
                while (coolProgramSource.length > 0) {
                    var longestMatch = null;
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
        TokenType[TokenType["Integer"] = 0] = "Integer";
        TokenType[TokenType["String"] = 1] = "String";
        TokenType[TokenType["ObjectIdentifier"] = 2] = "ObjectIdentifier";
        TokenType[TokenType["TypeIdentifier"] = 3] = "TypeIdentifier";
        TokenType[TokenType["WhiteSpace"] = 4] = "WhiteSpace";
        TokenType[TokenType["ClassKeyword"] = 5] = "ClassKeyword";
        TokenType[TokenType["ElseKeyword"] = 6] = "ElseKeyword";
        TokenType[TokenType["FalseKeyword"] = 7] = "FalseKeyword";
        TokenType[TokenType["FiKeyword"] = 8] = "FiKeyword";
        TokenType[TokenType["IfKeyword"] = 9] = "IfKeyword";
        TokenType[TokenType["InheritsKeyword"] = 10] = "InheritsKeyword";
        TokenType[TokenType["IsvoidKeyword"] = 11] = "IsvoidKeyword";
        TokenType[TokenType["LetKeyword"] = 12] = "LetKeyword";
        TokenType[TokenType["LoopKeyword"] = 13] = "LoopKeyword";
        TokenType[TokenType["PoolKeyword"] = 14] = "PoolKeyword";
        TokenType[TokenType["ThenKeyword"] = 15] = "ThenKeyword";
        TokenType[TokenType["WhileKeyword"] = 16] = "WhileKeyword";
        TokenType[TokenType["CaseKeyword"] = 17] = "CaseKeyword";
        TokenType[TokenType["EsacKeyword"] = 18] = "EsacKeyword";
        TokenType[TokenType["NewKeyword"] = 19] = "NewKeyword";
        TokenType[TokenType["OfKeyword"] = 20] = "OfKeyword";
        TokenType[TokenType["NotKeyword"] = 21] = "NotKeyword";
        TokenType[TokenType["TrueKeyword"] = 22] = "TrueKeyword";
    })(CoolToJS.TokenType || (CoolToJS.TokenType = {}));
    var TokenType = CoolToJS.TokenType;
    CoolToJS.TokenLookup = [
        {
            token: 0 /* Integer */,
            regex: /^([0-9]+)\b/,
        },
        {
            token: 2 /* ObjectIdentifier */,
            regex: /^([a-z][a-zA-Z0-9_]*)\b/,
        },
        {
            token: 3 /* TypeIdentifier */,
            regex: /^([A-Z][a-zA-Z0-9_]*)\b/,
        },
        {
            token: 4 /* WhiteSpace */,
            regex: /^(\s+)/,
        },
        {
            token: 5 /* ClassKeyword */,
            regex: /^(class)\b/i,
        },
        {
            token: 6 /* ElseKeyword */,
            regex: /^(else)\b/i,
        },
        {
            token: 7 /* FalseKeyword */,
            regex: /^(f[aA][lL][sS][eE])\b/,
        },
        {
            token: 22 /* TrueKeyword */,
            regex: /^(t[rR][uU][eE])\b/,
        },
        {
            token: 8 /* FiKeyword */,
            regex: /^(fi)\b/i,
        },
        {
            token: 9 /* IfKeyword */,
            regex: /^(if)\b/i,
        },
        {
            token: 10 /* InheritsKeyword */,
            regex: /^(inherits)\b/i,
        },
        {
            token: 11 /* IsvoidKeyword */,
            regex: /^(isvoid)\b/i,
        },
        {
            token: 12 /* LetKeyword */,
            regex: /^(let)\b/i,
        },
        {
            token: 13 /* LoopKeyword */,
            regex: /^(loop)\b/i,
        },
        {
            token: 14 /* PoolKeyword */,
            regex: /^(pool)\b/i,
        },
        {
            token: 15 /* ThenKeyword */,
            regex: /^(then)\b/i,
        },
        {
            token: 16 /* WhileKeyword */,
            regex: /^(while)\b/i,
        },
        {
            token: 17 /* CaseKeyword */,
            regex: /^(case)\b/i,
        },
        {
            token: 18 /* EsacKeyword */,
            regex: /^(esac)\b/i,
        },
        {
            token: 19 /* NewKeyword */,
            regex: /^(new)\b/i,
        },
        {
            token: 20 /* OfKeyword */,
            regex: /^(of)\b/i,
        },
        {
            token: 21 /* NotKeyword */,
            regex: /^(not)\b/i,
        },
    ];
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    // temporary
    var generatedJavaScriptExample = '\
// note that this generated code (and its output)\n\
// is currently hardcoded while the transpiler\n\
// is being built\n\
\n\
function __outputFunction(output) {\n\
    document.getElementById(\'output\').innerHTML += output;\n\
}\n\
\n\
__outputFunction("Hello, world.\\n");\
';
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
        var lexicalAnalyzer = new CoolToJS.LexicalAnalyzer();
        lexicalAnalyzer.Analyze(concatenatedCoolProgram);
        return {
            success: true,
            generatedJavaScript: generatedJavaScriptExample
        };
    }
    CoolToJS.Transpile = Transpile;
})(CoolToJS || (CoolToJS = {}));
//# sourceMappingURL=cooltojs-0.0.1.js.map