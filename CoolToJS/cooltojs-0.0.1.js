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
        TokenType[TokenType["Comment"] = 5] = "Comment";
        TokenType[TokenType["ClassKeyword"] = 6] = "ClassKeyword";
        TokenType[TokenType["ElseKeyword"] = 7] = "ElseKeyword";
        TokenType[TokenType["FalseKeyword"] = 8] = "FalseKeyword";
        TokenType[TokenType["FiKeyword"] = 9] = "FiKeyword";
        TokenType[TokenType["IfKeyword"] = 10] = "IfKeyword";
        TokenType[TokenType["InheritsKeyword"] = 11] = "InheritsKeyword";
        TokenType[TokenType["IsvoidKeyword"] = 12] = "IsvoidKeyword";
        TokenType[TokenType["LetKeyword"] = 13] = "LetKeyword";
        TokenType[TokenType["LoopKeyword"] = 14] = "LoopKeyword";
        TokenType[TokenType["PoolKeyword"] = 15] = "PoolKeyword";
        TokenType[TokenType["ThenKeyword"] = 16] = "ThenKeyword";
        TokenType[TokenType["WhileKeyword"] = 17] = "WhileKeyword";
        TokenType[TokenType["CaseKeyword"] = 18] = "CaseKeyword";
        TokenType[TokenType["EsacKeyword"] = 19] = "EsacKeyword";
        TokenType[TokenType["NewKeyword"] = 20] = "NewKeyword";
        TokenType[TokenType["OfKeyword"] = 21] = "OfKeyword";
        TokenType[TokenType["NotKeyword"] = 22] = "NotKeyword";
        TokenType[TokenType["TrueKeyword"] = 23] = "TrueKeyword";
        TokenType[TokenType["DotOperator"] = 24] = "DotOperator";
        TokenType[TokenType["AtSignOperator"] = 25] = "AtSignOperator";
        TokenType[TokenType["TildeOperator"] = 26] = "TildeOperator";
        TokenType[TokenType["MultiplationOperator"] = 27] = "MultiplationOperator";
        TokenType[TokenType["DivisionOperator"] = 28] = "DivisionOperator";
        TokenType[TokenType["AdditionOperator"] = 29] = "AdditionOperator";
        TokenType[TokenType["SubtrationOperator"] = 30] = "SubtrationOperator";
        TokenType[TokenType["LessThanOrEqualsOperator"] = 31] = "LessThanOrEqualsOperator";
        TokenType[TokenType["LessThanOperator"] = 32] = "LessThanOperator";
        TokenType[TokenType["EqualsOperator"] = 33] = "EqualsOperator";
        TokenType[TokenType["AssignmentOperator"] = 34] = "AssignmentOperator";
        TokenType[TokenType["OpenParenthesis"] = 35] = "OpenParenthesis";
        TokenType[TokenType["ClosedParenthesis"] = 36] = "ClosedParenthesis";
        TokenType[TokenType["OpenCurlyBracket"] = 37] = "OpenCurlyBracket";
        TokenType[TokenType["ClosedCurlyBracket"] = 38] = "ClosedCurlyBracket";
        TokenType[TokenType["Colon"] = 39] = "Colon";
        TokenType[TokenType["SemiColon"] = 40] = "SemiColon";
    })(CoolToJS.TokenType || (CoolToJS.TokenType = {}));
    var TokenType = CoolToJS.TokenType;
    CoolToJS.TokenLookup = [
        {
            token: 0 /* Integer */,
            regex: /^([0-9]+)\b/,
        },
        {
            token: 1 /* String */,
            // this is too simple
            regex: /^(".*")/,
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
            token: 5 /* Comment */,
            regex: /^(--.*)|(\(\*.*\*\))/,
        },
        {
            token: 6 /* ClassKeyword */,
            regex: /^(class)\b/i,
        },
        {
            token: 7 /* ElseKeyword */,
            regex: /^(else)\b/i,
        },
        {
            token: 8 /* FalseKeyword */,
            regex: /^(f[aA][lL][sS][eE])\b/,
        },
        {
            token: 23 /* TrueKeyword */,
            regex: /^(t[rR][uU][eE])\b/,
        },
        {
            token: 9 /* FiKeyword */,
            regex: /^(fi)\b/i,
        },
        {
            token: 10 /* IfKeyword */,
            regex: /^(if)\b/i,
        },
        {
            token: 11 /* InheritsKeyword */,
            regex: /^(inherits)\b/i,
        },
        {
            token: 12 /* IsvoidKeyword */,
            regex: /^(isvoid)\b/i,
        },
        {
            token: 13 /* LetKeyword */,
            regex: /^(let)\b/i,
        },
        {
            token: 14 /* LoopKeyword */,
            regex: /^(loop)\b/i,
        },
        {
            token: 15 /* PoolKeyword */,
            regex: /^(pool)\b/i,
        },
        {
            token: 16 /* ThenKeyword */,
            regex: /^(then)\b/i,
        },
        {
            token: 17 /* WhileKeyword */,
            regex: /^(while)\b/i,
        },
        {
            token: 18 /* CaseKeyword */,
            regex: /^(case)\b/i,
        },
        {
            token: 19 /* EsacKeyword */,
            regex: /^(esac)\b/i,
        },
        {
            token: 20 /* NewKeyword */,
            regex: /^(new)\b/i,
        },
        {
            token: 21 /* OfKeyword */,
            regex: /^(of)\b/i,
        },
        {
            token: 22 /* NotKeyword */,
            regex: /^(not)\b/i,
        },
        {
            token: 24 /* DotOperator */,
            regex: /^(\.)/
        },
        {
            token: 25 /* AtSignOperator */,
            regex: /^(\@)/
        },
        {
            token: 26 /* TildeOperator */,
            regex: /^(~)/
        },
        {
            token: 27 /* MultiplationOperator */,
            regex: /^(\*)/
        },
        {
            token: 28 /* DivisionOperator */,
            regex: /^(\/)/
        },
        {
            token: 29 /* AdditionOperator */,
            regex: /^(\+)/
        },
        {
            token: 30 /* SubtrationOperator */,
            regex: /^(-)/
        },
        {
            token: 31 /* LessThanOrEqualsOperator */,
            regex: /^(<=)/
        },
        {
            token: 32 /* LessThanOperator */,
            regex: /^(<)/
        },
        {
            token: 33 /* EqualsOperator */,
            regex: /^(=)/
        },
        {
            token: 34 /* AssignmentOperator */,
            regex: /^(<-)/
        },
        {
            token: 35 /* OpenParenthesis */,
            regex: /^(\()/
        },
        {
            token: 36 /* ClosedParenthesis */,
            regex: /^(\))/
        },
        {
            token: 37 /* OpenCurlyBracket */,
            regex: /^(\{)/
        },
        {
            token: 38 /* ClosedCurlyBracket */,
            regex: /^(\})/
        },
        {
            token: 39 /* Colon */,
            regex: /^(:)/
        },
        {
            token: 40 /* SemiColon */,
            regex: /^(;)/
        }
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