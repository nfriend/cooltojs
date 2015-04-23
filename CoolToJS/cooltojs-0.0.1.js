var CoolToJS;
(function (CoolToJS) {
    // finds all Cool program sources referenced in 
    // <script type="text/cool"> elements and returns 
    // them asynchonously via the completedCallback
    function GetReferencedCoolSources(completedCallback) {
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
                // if all ajax calls have returned, execute the callback with the Cool source 
                if (coolPrograms.length == coolProgramReferences.length) {
                    completedCallback(coolPrograms.map(function (x) {
                        return x.program;
                    }));
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
    }
    CoolToJS.GetReferencedCoolSources = GetReferencedCoolSources;
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    var LexicalAnalyzer = (function () {
        function LexicalAnalyzer() {
            var _this = this;
            this.tabLength = 4;
            this.Analyze = function (coolProgramSource) {
                var tokens = [], currentLineNumber = 1, currentColumnNumber = 1, errorMessages = [];
                while (coolProgramSource.length > 0) {
                    var longestMatch = null;
                    for (var i = 0; i < CoolToJS.TokenLookup.length; i++) {
                        var currentTokenOption = CoolToJS.TokenLookup[i], matchIsKeyword = CoolToJS.isKeyword(currentTokenOption.token), matchString = null;
                        if (currentTokenOption.matchFunction) {
                            matchString = currentTokenOption.matchFunction(coolProgramSource);
                        }
                        else {
                            var match = currentTokenOption.regex.exec(coolProgramSource);
                            if (match !== null && typeof match[1] !== 'undefined') {
                                matchString = match[1];
                            }
                            else {
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
                            };
                        }
                    }
                    if (longestMatch) {
                        // we successfully found a match
                        if (longestMatch.token === 24 /* NewLine */) {
                            currentLineNumber++;
                            currentColumnNumber = 1;
                        }
                        else if (longestMatch.token === 19 /* String */ || longestMatch.token === 26 /* Comment */) {
                            // strings and comments can also have newlines 
                            // in them, if they're multi-line
                            var lines = longestMatch.match.split('\n');
                            currentLineNumber += lines.length - 1;
                            if (lines.length > 1) {
                                currentColumnNumber = lines[lines.length - 1].length + 1;
                            }
                        }
                        else if (longestMatch.token === 25 /* Tab */) {
                            currentColumnNumber += _this.tabLength;
                        }
                        else if (longestMatch.token !== 23 /* CarriageReturn */) {
                            // update the column counter
                            currentColumnNumber += longestMatch.match.length;
                        }
                        tokens.push(longestMatch);
                        coolProgramSource = coolProgramSource.slice(longestMatch.match.length);
                    }
                    else {
                        // we weren't able to find a match
                        var errorMessage = 'Line ' + currentLineNumber + ', column ' + currentColumnNumber + ':\tSyntax error: Unexpected character sequence near "' + coolProgramSource.slice(0, 20).replace(/\r\n|\r|\n|\t|[\s]+/g, ' ') + '..."';
                        // figure out an approximate length of the error token
                        var untilWhitespaceMatch = /^([^\s]*)/.exec(coolProgramSource);
                        if (untilWhitespaceMatch === null || typeof untilWhitespaceMatch[1] === 'undefined') {
                            var length = 1;
                        }
                        else {
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
                //    console.log(TokenType[tokens[i].token] + ': "' + tokens[i].match + '", line: ' + tokens[i].location.line + ', column: ' + tokens[i].location.column);
                //}
                return {
                    success: errorMessages.length === 0,
                    tokens: tokens,
                    errorMessages: errorMessages
                };
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
            this.Parse = function (tokens) {
                return {
                    success: true,
                    parseTree: {}
                };
            };
        }
        return Parser;
    })();
    CoolToJS.Parser = Parser;
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    (function (TokenType) {
        TokenType[TokenType["ClassKeyword"] = 0] = "ClassKeyword";
        TokenType[TokenType["ElseKeyword"] = 1] = "ElseKeyword";
        TokenType[TokenType["FalseKeyword"] = 2] = "FalseKeyword";
        TokenType[TokenType["FiKeyword"] = 3] = "FiKeyword";
        TokenType[TokenType["IfKeyword"] = 4] = "IfKeyword";
        TokenType[TokenType["InheritsKeyword"] = 5] = "InheritsKeyword";
        TokenType[TokenType["IsvoidKeyword"] = 6] = "IsvoidKeyword";
        TokenType[TokenType["LetKeyword"] = 7] = "LetKeyword";
        TokenType[TokenType["LoopKeyword"] = 8] = "LoopKeyword";
        TokenType[TokenType["PoolKeyword"] = 9] = "PoolKeyword";
        TokenType[TokenType["ThenKeyword"] = 10] = "ThenKeyword";
        TokenType[TokenType["WhileKeyword"] = 11] = "WhileKeyword";
        TokenType[TokenType["CaseKeyword"] = 12] = "CaseKeyword";
        TokenType[TokenType["EsacKeyword"] = 13] = "EsacKeyword";
        TokenType[TokenType["NewKeyword"] = 14] = "NewKeyword";
        TokenType[TokenType["OfKeyword"] = 15] = "OfKeyword";
        TokenType[TokenType["NotKeyword"] = 16] = "NotKeyword";
        TokenType[TokenType["TrueKeyword"] = 17] = "TrueKeyword";
        TokenType[TokenType["Integer"] = 18] = "Integer";
        TokenType[TokenType["String"] = 19] = "String";
        TokenType[TokenType["ObjectIdentifier"] = 20] = "ObjectIdentifier";
        TokenType[TokenType["TypeIdentifier"] = 21] = "TypeIdentifier";
        TokenType[TokenType["WhiteSpace"] = 22] = "WhiteSpace";
        TokenType[TokenType["CarriageReturn"] = 23] = "CarriageReturn";
        TokenType[TokenType["NewLine"] = 24] = "NewLine";
        TokenType[TokenType["Tab"] = 25] = "Tab";
        TokenType[TokenType["Comment"] = 26] = "Comment";
        TokenType[TokenType["DotOperator"] = 27] = "DotOperator";
        TokenType[TokenType["AtSignOperator"] = 28] = "AtSignOperator";
        TokenType[TokenType["TildeOperator"] = 29] = "TildeOperator";
        TokenType[TokenType["MultiplationOperator"] = 30] = "MultiplationOperator";
        TokenType[TokenType["DivisionOperator"] = 31] = "DivisionOperator";
        TokenType[TokenType["AdditionOperator"] = 32] = "AdditionOperator";
        TokenType[TokenType["SubtrationOperator"] = 33] = "SubtrationOperator";
        TokenType[TokenType["LessThanOrEqualsOperator"] = 34] = "LessThanOrEqualsOperator";
        TokenType[TokenType["LessThanOperator"] = 35] = "LessThanOperator";
        TokenType[TokenType["EqualsOperator"] = 36] = "EqualsOperator";
        TokenType[TokenType["AssignmentOperator"] = 37] = "AssignmentOperator";
        TokenType[TokenType["FatArrowOperator"] = 38] = "FatArrowOperator";
        TokenType[TokenType["OpenParenthesis"] = 39] = "OpenParenthesis";
        TokenType[TokenType["ClosedParenthesis"] = 40] = "ClosedParenthesis";
        TokenType[TokenType["OpenCurlyBracket"] = 41] = "OpenCurlyBracket";
        TokenType[TokenType["ClosedCurlyBracket"] = 42] = "ClosedCurlyBracket";
        TokenType[TokenType["Colon"] = 43] = "Colon";
        TokenType[TokenType["SemiColon"] = 44] = "SemiColon";
        TokenType[TokenType["Comma"] = 45] = "Comma";
    })(CoolToJS.TokenType || (CoolToJS.TokenType = {}));
    var TokenType = CoolToJS.TokenType;
    // order signifies priority (keywords are listed first)
    CoolToJS.TokenLookup = [
        {
            token: 0 /* ClassKeyword */,
            regex: /^(class)\b/i,
        },
        {
            token: 1 /* ElseKeyword */,
            regex: /^(else)\b/i,
        },
        {
            token: 2 /* FalseKeyword */,
            regex: /^(f[aA][lL][sS][eE])\b/,
        },
        {
            token: 17 /* TrueKeyword */,
            regex: /^(t[rR][uU][eE])\b/,
        },
        {
            token: 3 /* FiKeyword */,
            regex: /^(fi)\b/i,
        },
        {
            token: 4 /* IfKeyword */,
            regex: /^(if)\b/i,
        },
        {
            token: 5 /* InheritsKeyword */,
            regex: /^(inherits)\b/i,
        },
        {
            token: 6 /* IsvoidKeyword */,
            regex: /^(isvoid)\b/i,
        },
        {
            token: 7 /* LetKeyword */,
            regex: /^(let)\b/i,
        },
        {
            token: 8 /* LoopKeyword */,
            regex: /^(loop)\b/i,
        },
        {
            token: 9 /* PoolKeyword */,
            regex: /^(pool)\b/i,
        },
        {
            token: 10 /* ThenKeyword */,
            regex: /^(then)\b/i,
        },
        {
            token: 11 /* WhileKeyword */,
            regex: /^(while)\b/i,
        },
        {
            token: 12 /* CaseKeyword */,
            regex: /^(case)\b/i,
        },
        {
            token: 13 /* EsacKeyword */,
            regex: /^(esac)\b/i,
        },
        {
            token: 14 /* NewKeyword */,
            regex: /^(new)\b/i,
        },
        {
            token: 15 /* OfKeyword */,
            regex: /^(of)\b/i,
        },
        {
            token: 16 /* NotKeyword */,
            regex: /^(not)\b/i,
        },
        {
            token: 18 /* Integer */,
            regex: /^([0-9]+)\b/,
        },
        {
            token: 19 /* String */,
            matchFunction: function (input) {
                if (input.indexOf('"Hello') === 0) {
                    console.log('sdfsd');
                }
                // for a single-line string
                var singleLineMatch = /^("(?:[^\\]|\\.)*?")/.exec(input);
                if (singleLineMatch !== null && typeof singleLineMatch[1] !== 'undefined') {
                    return singleLineMatch[1];
                }
                // for a multi-line string
                var fullMatch = null;
                var firstLineMatch = /^(".*\\[\s]*\n)/.exec(input);
                if (firstLineMatch !== null && typeof firstLineMatch[1] !== 'undefined') {
                    if (stringContainsUnescapedQuotes(firstLineMatch[1])) {
                        return null;
                    }
                    fullMatch = firstLineMatch[1];
                    input = input.slice(firstLineMatch[1].length);
                    var middleLineRegex = /^(.*\\[\s]*\n)/;
                    var middleLineMatch = middleLineRegex.exec(input);
                    while (middleLineMatch !== null && typeof middleLineMatch[1] !== 'undefined' && !(stringContainsUnescapedQuotes(middleLineMatch[1]))) {
                        fullMatch += middleLineMatch[1];
                        input = input.slice(middleLineMatch[1].length);
                        middleLineMatch = middleLineRegex.exec(input);
                    }
                    var lastLineMatch = /^(.*?[^\\]")/.exec(input);
                    if (lastLineMatch !== null && lastLineMatch[1] !== 'undefined') {
                        fullMatch += lastLineMatch[1];
                        return fullMatch;
                    }
                    else {
                        return null;
                    }
                }
                else {
                    return null;
                }
            }
        },
        {
            token: 20 /* ObjectIdentifier */,
            regex: /^([a-z][a-zA-Z0-9_]*)\b/,
        },
        {
            token: 21 /* TypeIdentifier */,
            regex: /^([A-Z][a-zA-Z0-9_]*)\b/,
        },
        {
            token: 22 /* WhiteSpace */,
            regex: /^( +)/,
        },
        {
            token: 23 /* CarriageReturn */,
            regex: /^(\r)/,
        },
        {
            token: 24 /* NewLine */,
            regex: /^(\n)/,
        },
        {
            token: 25 /* Tab */,
            regex: /^(\t)/,
        },
        {
            token: 26 /* Comment */,
            regex: /^((?:--.*)|(?:\(\*(?:(?!\*\))[\s\S])*\*\)))/,
        },
        {
            token: 27 /* DotOperator */,
            regex: /^(\.)/
        },
        {
            token: 28 /* AtSignOperator */,
            regex: /^(\@)/
        },
        {
            token: 29 /* TildeOperator */,
            regex: /^(~)/
        },
        {
            token: 30 /* MultiplationOperator */,
            regex: /^(\*)/
        },
        {
            token: 31 /* DivisionOperator */,
            regex: /^(\/)/
        },
        {
            token: 32 /* AdditionOperator */,
            regex: /^(\+)/
        },
        {
            token: 33 /* SubtrationOperator */,
            regex: /^(-)/
        },
        {
            token: 34 /* LessThanOrEqualsOperator */,
            regex: /^(<=)/
        },
        {
            token: 35 /* LessThanOperator */,
            regex: /^(<)/
        },
        {
            token: 36 /* EqualsOperator */,
            regex: /^(=)/
        },
        {
            token: 37 /* AssignmentOperator */,
            regex: /^(<-)/
        },
        {
            token: 38 /* FatArrowOperator */,
            regex: /^(=>)/
        },
        {
            token: 39 /* OpenParenthesis */,
            regex: /^(\()/
        },
        {
            token: 40 /* ClosedParenthesis */,
            regex: /^(\))/
        },
        {
            token: 41 /* OpenCurlyBracket */,
            regex: /^(\{)/
        },
        {
            token: 42 /* ClosedCurlyBracket */,
            regex: /^(\})/
        },
        {
            token: 43 /* Colon */,
            regex: /^(:)/
        },
        {
            token: 44 /* SemiColon */,
            regex: /^(;)/
        },
        {
            token: 45 /* Comma */,
            regex: /^(,)/
        }
    ];
    function isKeyword(tokenType) {
        return (tokenType == 0 /* ClassKeyword */ || tokenType == 1 /* ElseKeyword */ || tokenType == 2 /* FalseKeyword */ || tokenType == 3 /* FiKeyword */ || tokenType == 4 /* IfKeyword */ || tokenType == 5 /* InheritsKeyword */ || tokenType == 6 /* IsvoidKeyword */ || tokenType == 7 /* LetKeyword */ || tokenType == 8 /* LoopKeyword */ || tokenType == 9 /* PoolKeyword */ || tokenType == 10 /* ThenKeyword */ || tokenType == 11 /* WhileKeyword */ || tokenType == 12 /* CaseKeyword */ || tokenType == 13 /* EsacKeyword */ || tokenType == 14 /* NewKeyword */ || tokenType == 15 /* OfKeyword */ || tokenType == 16 /* NotKeyword */ || tokenType == 17 /* TrueKeyword */);
    }
    CoolToJS.isKeyword = isKeyword;
    function stringContainsUnescapedQuotes(input, ignoreFinalQuote) {
        if (ignoreFinalQuote === void 0) { ignoreFinalQuote = false; }
        if (ignoreFinalQuote) {
            return /[^\\]".+/.test(input);
        }
        else {
            return /[^\\]"/.test(input);
        }
    }
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    // temporary
    var generatedJavaScriptExample = '\
// note that this generated code is currently hardcoded\n\
// while the transpiler is being built\n\
\n\
function _out_string(output) {\n\
    window.consoleController.report([{\n\
        msg: output,\n\
        className: "jquery-console-output"\n\
    }]);\n\
}\n\
\n\
function _in_string(callback) {\n\
    window.inputFunction = function(input) {\n\
        callback(input);\n\
    };\n\
}\n\
\n\
var hello = "Hello, ",\n\
	name = "",\n\
    ending = "!\\n";\n\
\n\
_out_string("Please enter your name:\\n");\n\
_in_string(function(input) {\n\
    name = input;\n\
    _out_string(hello + name + ending);\n\
});\n\
';
    function Transpile(transpilerOptions) {
        var coolProgramSources = transpilerOptions.coolProgramSources;
        if (typeof coolProgramSources === 'string') {
            var concatenatedCoolProgram = coolProgramSources;
        }
        else {
            var concatenatedCoolProgram = coolProgramSources.join('\n');
        }
        if (transpilerOptions.out_string) {
            var out_string = transpilerOptions.out_string;
        }
        else {
            var out_string = function (output) {
                console.log(output);
            };
        }
        if (transpilerOptions.out_int) {
            var out_int = transpilerOptions.out_int;
        }
        else {
            var out_int = function (output) {
                console.log(output);
            };
        }
        if (transpilerOptions.in_string) {
            var in_string = transpilerOptions.in_string;
        }
        else {
            var in_string = function (onInput) {
            };
        }
        if (transpilerOptions.in_int) {
            var in_int = transpilerOptions.in_int;
        }
        else {
            var in_int = function (onInput) {
            };
        }
        var lexicalAnalyzer = new CoolToJS.LexicalAnalyzer();
        var lexicalAnalyzerOutput = lexicalAnalyzer.Analyze(concatenatedCoolProgram);
        if (!lexicalAnalyzerOutput.success) {
            return {
                success: false,
                errorMessages: lexicalAnalyzerOutput.errorMessages
            };
        }
        var parser = new CoolToJS.Parser();
        var parserOutput = parser.Parse(lexicalAnalyzerOutput.tokens);
        if (!parserOutput.success) {
            return {
                success: false,
                errorMessages: parserOutput.errorMessages
            };
        }
        return {
            success: true,
            generatedJavaScript: generatedJavaScriptExample
        };
    }
    CoolToJS.Transpile = Transpile;
})(CoolToJS || (CoolToJS = {}));
//# sourceMappingURL=cooltojs-0.0.1.js.map