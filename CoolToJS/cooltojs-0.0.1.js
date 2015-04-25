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
                                tokenName: CoolToJS.SyntaxKind[currentTokenOption.token],
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
                        if (longestMatch.token === 102 /* NewLine */) {
                            currentLineNumber++;
                            currentColumnNumber = 1;
                        }
                        else if (longestMatch.token === 1000 /* String */ || longestMatch.token === 1001 /* Comment */) {
                            // strings and comments can also have newlines 
                            // in them, if they're multi-line
                            var lines = longestMatch.match.split('\n');
                            currentLineNumber += lines.length - 1;
                            if (lines.length > 1) {
                                currentColumnNumber = lines[lines.length - 1].length + 1;
                            }
                            else {
                                currentColumnNumber += longestMatch.match.length;
                            }
                        }
                        else if (longestMatch.token === 103 /* Tab */) {
                            currentColumnNumber += _this.tabLength;
                        }
                        else if (longestMatch.token !== 101 /* CarriageReturn */) {
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
                //    console.log(SyntaxKind[tokens[i].token] + ': "' + tokens[i].match + '", line: ' + tokens[i].location.line + ', column: ' + tokens[i].location.column);
                //}
                // put an EndOfInput on the end of the token array
                tokens.push({
                    token: 0 /* EndOfInput */,
                    tokenName: CoolToJS.SyntaxKind[0 /* EndOfInput */],
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
            var _this = this;
            this.Parse = function (tokens) {
                var stack = [], inputPointer = 0, isAtEndOfInput = function () {
                    return inputPointer === tokens.length - 1;
                };
                tokens = _this.cleanseTokenArray(tokens);
                // #region for debugging
                var printStack = function () {
                    var output = [];
                    for (var i = 0; i < stack.length; i++) {
                        output.push(CoolToJS.SyntaxKind[stack[i].syntaxKind]);
                    }
                    console.log('[' + output.join(', ') + ']');
                    return output;
                };
                while (!(stack.length === 1 && stack[0].syntaxKind === CoolToJS.StartSyntaxKind && isAtEndOfInput())) {
                    var state = 0, tableEntry;
                    for (var i = 0; i < stack.length; i++) {
                        tableEntry = CoolToJS.slr1ParseTable[state][stack[i].syntaxKind];
                        state = tableEntry.nextState;
                    }
                    tableEntry = CoolToJS.slr1ParseTable[state][tokens[inputPointer].token];
                    if (tableEntry === null || (tableEntry.action === 2 /* Accept */ && isAtEndOfInput())) {
                        tableEntry = CoolToJS.slr1ParseTable[state][0 /* EndOfInput */];
                    }
                    // if tableEntry is STILL null, we have a parse error.
                    if (tableEntry === null) {
                        // TODO: better error reporting
                        var errorMessage = '';
                        if (tokens[inputPointer].token === 0 /* EndOfInput */) {
                            errorMessage = 'Line ' + tokens[inputPointer].location.line + ', column ' + tokens[inputPointer].location.column + ':\tParse error: unexpected end of input';
                        }
                        else {
                            errorMessage = 'Line ' + tokens[inputPointer].location.line + ', column ' + tokens[inputPointer].location.column + ':\tParse error: unexpected token: "' + tokens[inputPointer].match + '"';
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
                    if (tableEntry.action === 0 /* Shift */) {
                        stack.push({
                            syntaxKind: tokens[inputPointer].token,
                            token: tokens[inputPointer],
                            parent: null,
                            children: [],
                            state: tableEntry.nextState
                        });
                        inputPointer++;
                    }
                    else if (tableEntry.action === 1 /* Reduce */) {
                        var production = CoolToJS.productions[tableEntry.productionIndex];
                        var removedItems = stack.splice(-1 * production.popCount, production.popCount);
                        var newStackItem = {
                            syntaxKind: production.reduceResult,
                            state: null,
                            children: removedItems,
                            parent: null,
                        };
                        for (var i = 0; i < newStackItem.children.length; i++) {
                            newStackItem.children[i].parent = newStackItem;
                        }
                        stack.push(newStackItem);
                    }
                    else {
                        // Parse error!
                        var errorMessage = 'Line ' + tokens[inputPointer].location.line + ', column ' + tokens[inputPointer].location.column + ':\tParse error: expected end of program, but instead saw "' + tokens[inputPointer].match + '"';
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
                    printStack();
                }
                return {
                    success: true,
                    syntaxTree: stack[0]
                };
            };
        }
        // returns a copy of the provided array with whitespace,
        // newlines, comments, etc. removed
        Parser.prototype.cleanseTokenArray = function (tokens) {
            var cleanArray = [];
            for (var i = 0; i < tokens.length; i++) {
                if (tokens[i].token !== 101 /* CarriageReturn */ && tokens[i].token !== 1001 /* Comment */ && tokens[i].token !== 102 /* NewLine */ && tokens[i].token !== 1000 /* String */ && tokens[i].token !== 103 /* Tab */ && tokens[i].token !== 100 /* WhiteSpace */) {
                    cleanArray.push(tokens[i]);
                }
            }
            return cleanArray;
        };
        return Parser;
    })();
    CoolToJS.Parser = Parser;
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    (function (Action) {
        Action[Action["Shift"] = 0] = "Shift";
        Action[Action["Reduce"] = 1] = "Reduce";
        Action[Action["Accept"] = 2] = "Accept";
        Action[Action["None"] = 3] = "None";
    })(CoolToJS.Action || (CoolToJS.Action = {}));
    var Action = CoolToJS.Action;
    CoolToJS.slr1ParseTable = [
        [null, { action: 0 /* Shift */, nextState: 2 }, null, null, null, { action: 0 /* Shift */, nextState: 3 }, { action: 3 /* None */, nextState: 1 }],
        [{ action: 2 /* Accept */ }, null, null, { action: 0 /* Shift */, nextState: 5 }, { action: 0 /* Shift */, nextState: 4 }, null, null],
        [null, { action: 0 /* Shift */, nextState: 2 }, null, null, null, { action: 0 /* Shift */, nextState: 3 }, { action: 3 /* None */, nextState: 6 }],
        [{ action: 1 /* Reduce */, productionIndex: 4 }, null, { action: 1 /* Reduce */, productionIndex: 4 }, { action: 0 /* Shift */, nextState: 4 }, { action: 1 /* Reduce */, productionIndex: 4 }, null, null],
        [null, { action: 0 /* Shift */, nextState: 2 }, null, null, null, { action: 0 /* Shift */, nextState: 3 }, { action: 0 /* Shift */, nextState: 7 }],
        [null, { action: 0 /* Shift */, nextState: 2 }, null, null, null, { action: 0 /* Shift */, nextState: 3 }, { action: 3 /* None */, nextState: 8 }],
        [null, null, { action: 0 /* Shift */, nextState: 9 }, { action: 0 /* Shift */, nextState: 5 }, { action: 0 /* Shift */, nextState: 4 }, null, null],
        [{ action: 1 /* Reduce */, productionIndex: 1 }, null, { action: 1 /* Reduce */, productionIndex: 1 }, { action: 0 /* Shift */, nextState: 5 }, { action: 1 /* Reduce */, productionIndex: 1 }, null, null],
        [{ action: 1 /* Reduce */, productionIndex: 2 }, null, { action: 1 /* Reduce */, productionIndex: 2 }, { action: 1 /* Reduce */, productionIndex: 2 }, { action: 1 /* Reduce */, productionIndex: 2 }, null, null],
        [{ action: 1 /* Reduce */, productionIndex: 3 }, null, { action: 1 /* Reduce */, productionIndex: 3 }, { action: 1 /* Reduce */, productionIndex: 3 }, { action: 1 /* Reduce */, productionIndex: 3 }, null, null],
    ];
    CoolToJS.slr1ParseTableOld = [
        [null, 's2', null, null, null, 's3', '1 '],
        ['a ', null, null, 's5', 's4', null, null],
        [null, 's2', null, null, null, 's3', '6'],
        ['r4', null, 'r4', 's4', 'r4', null, null],
        [null, 's2', null, null, null, 's3', '7 '],
        [null, 's2', null, null, null, 's3', '8 '],
        [null, null, 's9', 's5', 's4', null, null],
        ['r1', null, 'r1', 's5', 'r1', null, null],
        ['r2', null, 'r2', 'r2', 'r2', null, null],
        ['r3', null, 'r3', 'r3', 'r3', null, null],
    ];
    CoolToJS.productions = [
        { popCount: 2, reduceResult: null },
        { popCount: 3, reduceResult: 6 /* E */ },
        { popCount: 3, reduceResult: 6 /* E */ },
        { popCount: 3, reduceResult: 6 /* E */ },
        { popCount: 1, reduceResult: 6 /* E */ },
    ];
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    (function (SyntaxKind) {
        SyntaxKind[SyntaxKind["EndOfInput"] = 0] = "EndOfInput";
        SyntaxKind[SyntaxKind["OpenParenthesis"] = 1] = "OpenParenthesis";
        SyntaxKind[SyntaxKind["ClosedParenthesis"] = 2] = "ClosedParenthesis";
        SyntaxKind[SyntaxKind["MultiplicationOperator"] = 3] = "MultiplicationOperator";
        SyntaxKind[SyntaxKind["AdditionOperator"] = 4] = "AdditionOperator";
        SyntaxKind[SyntaxKind["Integer"] = 5] = "Integer";
        SyntaxKind[SyntaxKind["E"] = 6] = "E";
        SyntaxKind[SyntaxKind["WhiteSpace"] = 100] = "WhiteSpace";
        SyntaxKind[SyntaxKind["CarriageReturn"] = 101] = "CarriageReturn";
        SyntaxKind[SyntaxKind["NewLine"] = 102] = "NewLine";
        SyntaxKind[SyntaxKind["Tab"] = 103] = "Tab";
        // not used in this grammar - only added here so we can compile
        SyntaxKind[SyntaxKind["String"] = 1000] = "String";
        SyntaxKind[SyntaxKind["Comment"] = 1001] = "Comment";
    })(CoolToJS.SyntaxKind || (CoolToJS.SyntaxKind = {}));
    var SyntaxKind = CoolToJS.SyntaxKind;
    CoolToJS.StartSyntaxKind = 6 /* E */;
    // order signifies priority (keywords are listed first)
    CoolToJS.TokenLookup = [
        {
            token: 5 /* Integer */,
            regex: /^([0-9]+)\b/,
        },
        {
            token: 3 /* MultiplicationOperator */,
            regex: /^(\*)/
        },
        {
            token: 4 /* AdditionOperator */,
            regex: /^(\+)/
        },
        {
            token: 1 /* OpenParenthesis */,
            regex: /^(\()/
        },
        {
            token: 2 /* ClosedParenthesis */,
            regex: /^(\))/
        },
        {
            token: 100 /* WhiteSpace */,
            regex: /^( +)/,
        },
        {
            token: 101 /* CarriageReturn */,
            regex: /^(\r)/,
        },
        {
            token: 102 /* NewLine */,
            regex: /^(\n)/,
        },
        {
            token: 103 /* Tab */,
            regex: /^(\t)/,
        },
    ];
    function isKeyword(tokenType) {
        return false;
    }
    CoolToJS.isKeyword = isKeyword;
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    var DontCompile;
    (function (DontCompile) {
        (function (SyntaxKind) {
            SyntaxKind[SyntaxKind["ClassKeyword"] = 0] = "ClassKeyword";
            SyntaxKind[SyntaxKind["ElseKeyword"] = 1] = "ElseKeyword";
            SyntaxKind[SyntaxKind["FalseKeyword"] = 2] = "FalseKeyword";
            SyntaxKind[SyntaxKind["FiKeyword"] = 3] = "FiKeyword";
            SyntaxKind[SyntaxKind["IfKeyword"] = 4] = "IfKeyword";
            SyntaxKind[SyntaxKind["InheritsKeyword"] = 5] = "InheritsKeyword";
            SyntaxKind[SyntaxKind["IsvoidKeyword"] = 6] = "IsvoidKeyword";
            SyntaxKind[SyntaxKind["LetKeyword"] = 7] = "LetKeyword";
            SyntaxKind[SyntaxKind["LoopKeyword"] = 8] = "LoopKeyword";
            SyntaxKind[SyntaxKind["PoolKeyword"] = 9] = "PoolKeyword";
            SyntaxKind[SyntaxKind["ThenKeyword"] = 10] = "ThenKeyword";
            SyntaxKind[SyntaxKind["WhileKeyword"] = 11] = "WhileKeyword";
            SyntaxKind[SyntaxKind["CaseKeyword"] = 12] = "CaseKeyword";
            SyntaxKind[SyntaxKind["EsacKeyword"] = 13] = "EsacKeyword";
            SyntaxKind[SyntaxKind["NewKeyword"] = 14] = "NewKeyword";
            SyntaxKind[SyntaxKind["OfKeyword"] = 15] = "OfKeyword";
            SyntaxKind[SyntaxKind["NotKeyword"] = 16] = "NotKeyword";
            SyntaxKind[SyntaxKind["TrueKeyword"] = 17] = "TrueKeyword";
            SyntaxKind[SyntaxKind["Integer"] = 18] = "Integer";
            SyntaxKind[SyntaxKind["String"] = 19] = "String";
            SyntaxKind[SyntaxKind["ObjectIdentifier"] = 20] = "ObjectIdentifier";
            SyntaxKind[SyntaxKind["TypeIdentifier"] = 21] = "TypeIdentifier";
            SyntaxKind[SyntaxKind["WhiteSpace"] = 22] = "WhiteSpace";
            SyntaxKind[SyntaxKind["CarriageReturn"] = 23] = "CarriageReturn";
            SyntaxKind[SyntaxKind["NewLine"] = 24] = "NewLine";
            SyntaxKind[SyntaxKind["Tab"] = 25] = "Tab";
            SyntaxKind[SyntaxKind["Comment"] = 26] = "Comment";
            SyntaxKind[SyntaxKind["DotOperator"] = 27] = "DotOperator";
            SyntaxKind[SyntaxKind["AtSignOperator"] = 28] = "AtSignOperator";
            SyntaxKind[SyntaxKind["TildeOperator"] = 29] = "TildeOperator";
            SyntaxKind[SyntaxKind["MultiplationOperator"] = 30] = "MultiplationOperator";
            SyntaxKind[SyntaxKind["DivisionOperator"] = 31] = "DivisionOperator";
            SyntaxKind[SyntaxKind["AdditionOperator"] = 32] = "AdditionOperator";
            SyntaxKind[SyntaxKind["SubtrationOperator"] = 33] = "SubtrationOperator";
            SyntaxKind[SyntaxKind["LessThanOrEqualsOperator"] = 34] = "LessThanOrEqualsOperator";
            SyntaxKind[SyntaxKind["LessThanOperator"] = 35] = "LessThanOperator";
            SyntaxKind[SyntaxKind["EqualsOperator"] = 36] = "EqualsOperator";
            SyntaxKind[SyntaxKind["AssignmentOperator"] = 37] = "AssignmentOperator";
            SyntaxKind[SyntaxKind["FatArrowOperator"] = 38] = "FatArrowOperator";
            SyntaxKind[SyntaxKind["OpenParenthesis"] = 39] = "OpenParenthesis";
            SyntaxKind[SyntaxKind["ClosedParenthesis"] = 40] = "ClosedParenthesis";
            SyntaxKind[SyntaxKind["OpenCurlyBracket"] = 41] = "OpenCurlyBracket";
            SyntaxKind[SyntaxKind["ClosedCurlyBracket"] = 42] = "ClosedCurlyBracket";
            SyntaxKind[SyntaxKind["Colon"] = 43] = "Colon";
            SyntaxKind[SyntaxKind["SemiColon"] = 44] = "SemiColon";
            SyntaxKind[SyntaxKind["Comma"] = 45] = "Comma";
            // higher-level constructs, not used in lexical analysis
            SyntaxKind[SyntaxKind["Program"] = 46] = "Program";
            SyntaxKind[SyntaxKind["Class"] = 47] = "Class";
            SyntaxKind[SyntaxKind["Feature"] = 48] = "Feature";
            SyntaxKind[SyntaxKind["Formal"] = 49] = "Formal";
            SyntaxKind[SyntaxKind["Expression"] = 50] = "Expression";
        })(DontCompile.SyntaxKind || (DontCompile.SyntaxKind = {}));
        var SyntaxKind = DontCompile.SyntaxKind;
        // order signifies priority (keywords are listed first)
        DontCompile.TokenLookup = [
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
        DontCompile.isKeyword = isKeyword;
        function stringContainsUnescapedQuotes(input, ignoreFinalQuote) {
            if (ignoreFinalQuote === void 0) { ignoreFinalQuote = false; }
            if (ignoreFinalQuote) {
                return /[^\\]".+/.test(input);
            }
            else {
                return /[^\\]"/.test(input);
            }
        }
    })(DontCompile = CoolToJS.DontCompile || (CoolToJS.DontCompile = {}));
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