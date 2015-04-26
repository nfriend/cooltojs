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
                        if (longestMatch.token === 56 /* NewLine */) {
                            currentLineNumber++;
                            currentColumnNumber = 1;
                        }
                        else if (longestMatch.token === 35 /* String */ || longestMatch.token === 58 /* Comment */) {
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
                        else if (longestMatch.token === 57 /* Tab */) {
                            currentColumnNumber += _this.tabLength;
                        }
                        else if (longestMatch.token !== 55 /* CarriageReturn */) {
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
                }, hasWarnedAboutAmbiguousEntry = false, ambiguousErrorMessage = 'Warning!  Ambiguous shift/reduce detected in parse table.  Automatically took shift option.  ' + 'To remove abiguity and ensure proper parsing, ensure all "let" blocks surround their contents in curly brackets.';
                // remove any characters we don't care about while parsing
                tokens = _this.cleanseTokenArray(tokens);
                // #region for debugging
                // prints the current stack to the console
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
                        // ambiguous entries appear as Arrays.
                        if (tableEntry instanceof Array) {
                            tableEntry = tableEntry[0];
                            if (!hasWarnedAboutAmbiguousEntry) {
                                console.log(ambiguousErrorMessage);
                                hasWarnedAboutAmbiguousEntry = true;
                            }
                        }
                        state = tableEntry.nextState;
                    }
                    tableEntry = CoolToJS.slr1ParseTable[state][tokens[inputPointer].token];
                    if (tableEntry instanceof Array) {
                        tableEntry = tableEntry[0];
                        // ambiguous entries appear as Arrays.
                        if (!hasWarnedAboutAmbiguousEntry) {
                            console.log(ambiguousErrorMessage);
                            hasWarnedAboutAmbiguousEntry = true;
                        }
                    }
                    if (tableEntry === null || (tableEntry.action === 2 /* Accept */ && isAtEndOfInput())) {
                        tableEntry = CoolToJS.slr1ParseTable[state][0 /* EndOfInput */];
                        if (tableEntry instanceof Array) {
                            tableEntry = tableEntry[0];
                            // ambiguous entries appear as Arrays.
                            if (!hasWarnedAboutAmbiguousEntry) {
                                console.log(ambiguousErrorMessage);
                                hasWarnedAboutAmbiguousEntry = true;
                            }
                        }
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
                        });
                        inputPointer++;
                    }
                    else if (tableEntry.action === 1 /* Reduce */) {
                        var production = CoolToJS.productions[tableEntry.productionIndex];
                        var removedItems = stack.splice(-1 * production.popCount, production.popCount);
                        var newStackItem = {
                            syntaxKind: production.reduceResult,
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
                        // TODO: does this always mean "unexpected end of program"?
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
                }
                //this.printSyntaxTree(stack[0]);
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
                if (tokens[i].token !== 55 /* CarriageReturn */ && tokens[i].token !== 58 /* Comment */ && tokens[i].token !== 56 /* NewLine */ && tokens[i].token !== 57 /* Tab */ && tokens[i].token !== 54 /* WhiteSpace */) {
                    cleanArray.push(tokens[i]);
                }
            }
            return cleanArray;
        };
        Parser.prototype.printSyntaxTree = function (syntaxTree, indent, last) {
            if (indent === void 0) { indent = ''; }
            if (last === void 0) { last = true; }
            var stringToWrite = indent;
            if (last) {
                stringToWrite += '\\-';
                indent += '  ';
            }
            else {
                stringToWrite += '|-';
                indent += '| ';
            }
            console.log(stringToWrite + CoolToJS.SyntaxKind[syntaxTree.syntaxKind]);
            for (var i = 0; i < syntaxTree.children.length; i++) {
                this.printSyntaxTree(syntaxTree.children[i], indent, i === syntaxTree.children.length - 1);
            }
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
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 3 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 3 /* None */, nextState: 2 }, null, null, null, null, null, null, null, null, { action: 3 /* None */, nextState: 1 }],
        [{ action: 2 /* Accept */ }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 4 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 5 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [{ action: 1 /* Reduce */, productionIndex: 1 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 3 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 3 /* None */, nextState: 2 }, null, null, null, null, null, null, null, null, { action: 3 /* None */, nextState: 6 }],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 7 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 8 }, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [{ action: 1 /* Reduce */, productionIndex: 2 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 9 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 12 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 3 /* None */, nextState: 11 }, { action: 3 /* None */, nextState: 10 }, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 13 }, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 14 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 15 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 16 }, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 17 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 12 }, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 19 }, null, null, null, null, null, null, { action: 3 /* None */, nextState: 11 }, { action: 3 /* None */, nextState: 18 }, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 7 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 12 }, null, null, null, null, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 3 }, null, null, null, null, null, null, { action: 3 /* None */, nextState: 11 }, { action: 3 /* None */, nextState: 20 }, null, null, null, null],
        [null, null, { action: 0 /* Shift */, nextState: 22 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 24 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 3 /* None */, nextState: 23 }, { action: 3 /* None */, nextState: 21 }, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 25 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 26 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 6 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 4 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 0 /* Shift */, nextState: 27 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 28 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 8 }, null, null, { action: 0 /* Shift */, nextState: 29 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 30 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 13 }, null, { action: 0 /* Shift */, nextState: 31 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 5 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 32 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 33 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 24 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 3 /* None */, nextState: 23 }, { action: 3 /* None */, nextState: 34 }, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 35 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 36 }, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 52 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 53 }, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 9 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 14 }, null, null, { action: 1 /* Reduce */, productionIndex: 14 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, null, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, { action: 1 /* Reduce */, productionIndex: 12 }, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 64 }, { action: 1 /* Reduce */, productionIndex: 50 }, { action: 1 /* Reduce */, productionIndex: 50 }, { action: 1 /* Reduce */, productionIndex: 50 }, { action: 1 /* Reduce */, productionIndex: 50 }, { action: 1 /* Reduce */, productionIndex: 50 }, { action: 1 /* Reduce */, productionIndex: 50 }, { action: 1 /* Reduce */, productionIndex: 50 }, null, { action: 1 /* Reduce */, productionIndex: 50 }, { action: 1 /* Reduce */, productionIndex: 50 }, { action: 0 /* Shift */, nextState: 63 }, { action: 1 /* Reduce */, productionIndex: 50 }, { action: 1 /* Reduce */, productionIndex: 50 }, null, { action: 1 /* Reduce */, productionIndex: 50 }, null, null, { action: 1 /* Reduce */, productionIndex: 50 }, null, null, { action: 1 /* Reduce */, productionIndex: 50 }, null, { action: 1 /* Reduce */, productionIndex: 50 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 50 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 50 }, { action: 1 /* Reduce */, productionIndex: 50 }, null, { action: 1 /* Reduce */, productionIndex: 50 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 50 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 65 }, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 66 }, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 67 }, null, { action: 3 /* None */, nextState: 68 }, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 70 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 3 /* None */, nextState: 69 }, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 71 }, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 72 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 73 }, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 74 }, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 75 }, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 76 }, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 51 }, { action: 1 /* Reduce */, productionIndex: 51 }, { action: 1 /* Reduce */, productionIndex: 51 }, { action: 1 /* Reduce */, productionIndex: 51 }, { action: 1 /* Reduce */, productionIndex: 51 }, { action: 1 /* Reduce */, productionIndex: 51 }, { action: 1 /* Reduce */, productionIndex: 51 }, null, { action: 1 /* Reduce */, productionIndex: 51 }, { action: 1 /* Reduce */, productionIndex: 51 }, null, { action: 1 /* Reduce */, productionIndex: 51 }, { action: 1 /* Reduce */, productionIndex: 51 }, null, { action: 1 /* Reduce */, productionIndex: 51 }, null, null, { action: 1 /* Reduce */, productionIndex: 51 }, null, null, { action: 1 /* Reduce */, productionIndex: 51 }, null, { action: 1 /* Reduce */, productionIndex: 51 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 51 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 51 }, { action: 1 /* Reduce */, productionIndex: 51 }, null, { action: 1 /* Reduce */, productionIndex: 51 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 51 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 52 }, { action: 1 /* Reduce */, productionIndex: 52 }, { action: 1 /* Reduce */, productionIndex: 52 }, { action: 1 /* Reduce */, productionIndex: 52 }, { action: 1 /* Reduce */, productionIndex: 52 }, { action: 1 /* Reduce */, productionIndex: 52 }, { action: 1 /* Reduce */, productionIndex: 52 }, null, { action: 1 /* Reduce */, productionIndex: 52 }, { action: 1 /* Reduce */, productionIndex: 52 }, null, { action: 1 /* Reduce */, productionIndex: 52 }, { action: 1 /* Reduce */, productionIndex: 52 }, null, { action: 1 /* Reduce */, productionIndex: 52 }, null, null, { action: 1 /* Reduce */, productionIndex: 52 }, null, null, { action: 1 /* Reduce */, productionIndex: 52 }, null, { action: 1 /* Reduce */, productionIndex: 52 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 52 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 52 }, { action: 1 /* Reduce */, productionIndex: 52 }, null, { action: 1 /* Reduce */, productionIndex: 52 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 52 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 53 }, { action: 1 /* Reduce */, productionIndex: 53 }, { action: 1 /* Reduce */, productionIndex: 53 }, { action: 1 /* Reduce */, productionIndex: 53 }, { action: 1 /* Reduce */, productionIndex: 53 }, { action: 1 /* Reduce */, productionIndex: 53 }, { action: 1 /* Reduce */, productionIndex: 53 }, null, { action: 1 /* Reduce */, productionIndex: 53 }, { action: 1 /* Reduce */, productionIndex: 53 }, null, { action: 1 /* Reduce */, productionIndex: 53 }, { action: 1 /* Reduce */, productionIndex: 53 }, null, { action: 1 /* Reduce */, productionIndex: 53 }, null, null, { action: 1 /* Reduce */, productionIndex: 53 }, null, null, { action: 1 /* Reduce */, productionIndex: 53 }, null, { action: 1 /* Reduce */, productionIndex: 53 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 53 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 53 }, { action: 1 /* Reduce */, productionIndex: 53 }, null, { action: 1 /* Reduce */, productionIndex: 53 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 53 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 54 }, { action: 1 /* Reduce */, productionIndex: 54 }, { action: 1 /* Reduce */, productionIndex: 54 }, { action: 1 /* Reduce */, productionIndex: 54 }, { action: 1 /* Reduce */, productionIndex: 54 }, { action: 1 /* Reduce */, productionIndex: 54 }, { action: 1 /* Reduce */, productionIndex: 54 }, null, { action: 1 /* Reduce */, productionIndex: 54 }, { action: 1 /* Reduce */, productionIndex: 54 }, null, { action: 1 /* Reduce */, productionIndex: 54 }, { action: 1 /* Reduce */, productionIndex: 54 }, null, { action: 1 /* Reduce */, productionIndex: 54 }, null, null, { action: 1 /* Reduce */, productionIndex: 54 }, null, null, { action: 1 /* Reduce */, productionIndex: 54 }, null, { action: 1 /* Reduce */, productionIndex: 54 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 54 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 54 }, { action: 1 /* Reduce */, productionIndex: 54 }, null, { action: 1 /* Reduce */, productionIndex: 54 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 54 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 77 }, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 78 }, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 79 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 80 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 81 }, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 82 }, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 83 }, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 84 }, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 85 }, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 86 }, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 87 }, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 88 }, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, { action: 0 /* Shift */, nextState: 89 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 91 }, { action: 3 /* None */, nextState: 90 }, null, null, null, null, null, null, null],
        [null, null, null, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, null, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, null, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 92 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, null, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, null, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 93 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, null, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, { action: 0 /* Shift */, nextState: 95 }, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 94 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 96 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 97 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 98 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, null, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, null, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 99 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 38 }, { action: 1 /* Reduce */, productionIndex: 38 }, { action: 1 /* Reduce */, productionIndex: 38 }, { action: 1 /* Reduce */, productionIndex: 38 }, { action: 1 /* Reduce */, productionIndex: 38 }, { action: 1 /* Reduce */, productionIndex: 38 }, { action: 1 /* Reduce */, productionIndex: 38 }, null, { action: 1 /* Reduce */, productionIndex: 38 }, { action: 1 /* Reduce */, productionIndex: 38 }, null, { action: 1 /* Reduce */, productionIndex: 38 }, { action: 1 /* Reduce */, productionIndex: 38 }, null, { action: 1 /* Reduce */, productionIndex: 38 }, null, null, { action: 1 /* Reduce */, productionIndex: 38 }, null, null, { action: 1 /* Reduce */, productionIndex: 38 }, null, { action: 1 /* Reduce */, productionIndex: 38 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 38 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 38 }, { action: 1 /* Reduce */, productionIndex: 38 }, null, { action: 1 /* Reduce */, productionIndex: 38 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 38 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 39 }, { action: 1 /* Reduce */, productionIndex: 39 }, { action: 1 /* Reduce */, productionIndex: 39 }, { action: 1 /* Reduce */, productionIndex: 39 }, { action: 1 /* Reduce */, productionIndex: 39 }, { action: 0 /* Shift */, nextState: 54 }, { action: 1 /* Reduce */, productionIndex: 39 }, null, { action: 1 /* Reduce */, productionIndex: 39 }, { action: 1 /* Reduce */, productionIndex: 39 }, null, { action: 1 /* Reduce */, productionIndex: 39 }, { action: 1 /* Reduce */, productionIndex: 39 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, { action: 1 /* Reduce */, productionIndex: 39 }, null, null, { action: 1 /* Reduce */, productionIndex: 39 }, null, { action: 1 /* Reduce */, productionIndex: 39 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 39 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 39 }, { action: 1 /* Reduce */, productionIndex: 39 }, null, { action: 1 /* Reduce */, productionIndex: 39 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 39 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 44 }, { action: 1 /* Reduce */, productionIndex: 44 }, { action: 1 /* Reduce */, productionIndex: 44 }, { action: 1 /* Reduce */, productionIndex: 44 }, { action: 1 /* Reduce */, productionIndex: 44 }, { action: 0 /* Shift */, nextState: 54 }, { action: 1 /* Reduce */, productionIndex: 44 }, null, { action: 1 /* Reduce */, productionIndex: 44 }, { action: 1 /* Reduce */, productionIndex: 44 }, null, { action: 1 /* Reduce */, productionIndex: 44 }, { action: 1 /* Reduce */, productionIndex: 44 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, { action: 1 /* Reduce */, productionIndex: 44 }, null, null, { action: 1 /* Reduce */, productionIndex: 44 }, null, { action: 1 /* Reduce */, productionIndex: 44 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 44 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 44 }, { action: 1 /* Reduce */, productionIndex: 44 }, null, { action: 1 /* Reduce */, productionIndex: 44 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 44 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 48 }, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, { action: 1 /* Reduce */, productionIndex: 48 }, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, { action: 1 /* Reduce */, productionIndex: 48 }, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, { action: 1 /* Reduce */, productionIndex: 48 }, null, null, { action: 1 /* Reduce */, productionIndex: 48 }, null, { action: 1 /* Reduce */, productionIndex: 48 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 48 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 48 }, { action: 1 /* Reduce */, productionIndex: 48 }, null, { action: 1 /* Reduce */, productionIndex: 48 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 48 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 0 /* Shift */, nextState: 100 }, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, null, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, null, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 101 }, null, null, null, null, null, null, null, null],
        [null, null, null, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, null, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, null, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 102 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 103 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 104 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 40 }, { action: 0 /* Shift */, nextState: 58 }, { action: 1 /* Reduce */, productionIndex: 40 }, { action: 1 /* Reduce */, productionIndex: 40 }, { action: 1 /* Reduce */, productionIndex: 40 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, { action: 1 /* Reduce */, productionIndex: 40 }, { action: 1 /* Reduce */, productionIndex: 40 }, null, { action: 1 /* Reduce */, productionIndex: 40 }, { action: 1 /* Reduce */, productionIndex: 40 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, { action: 1 /* Reduce */, productionIndex: 40 }, null, null, { action: 1 /* Reduce */, productionIndex: 40 }, null, { action: 1 /* Reduce */, productionIndex: 40 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 40 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 40 }, { action: 1 /* Reduce */, productionIndex: 40 }, null, { action: 1 /* Reduce */, productionIndex: 40 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 40 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 41 }, { action: 0 /* Shift */, nextState: 58 }, { action: 1 /* Reduce */, productionIndex: 41 }, { action: 1 /* Reduce */, productionIndex: 41 }, { action: 1 /* Reduce */, productionIndex: 41 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, { action: 1 /* Reduce */, productionIndex: 41 }, { action: 1 /* Reduce */, productionIndex: 41 }, null, { action: 1 /* Reduce */, productionIndex: 41 }, { action: 1 /* Reduce */, productionIndex: 41 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, { action: 1 /* Reduce */, productionIndex: 41 }, null, null, { action: 1 /* Reduce */, productionIndex: 41 }, null, { action: 1 /* Reduce */, productionIndex: 41 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 41 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 41 }, { action: 1 /* Reduce */, productionIndex: 41 }, null, { action: 1 /* Reduce */, productionIndex: 41 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 41 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 42 }, { action: 1 /* Reduce */, productionIndex: 42 }, { action: 1 /* Reduce */, productionIndex: 42 }, { action: 1 /* Reduce */, productionIndex: 42 }, { action: 1 /* Reduce */, productionIndex: 42 }, { action: 0 /* Shift */, nextState: 54 }, { action: 1 /* Reduce */, productionIndex: 42 }, null, { action: 1 /* Reduce */, productionIndex: 42 }, { action: 1 /* Reduce */, productionIndex: 42 }, null, { action: 1 /* Reduce */, productionIndex: 42 }, { action: 1 /* Reduce */, productionIndex: 42 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, { action: 1 /* Reduce */, productionIndex: 42 }, null, null, { action: 1 /* Reduce */, productionIndex: 42 }, null, { action: 1 /* Reduce */, productionIndex: 42 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 42 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 42 }, { action: 1 /* Reduce */, productionIndex: 42 }, null, { action: 1 /* Reduce */, productionIndex: 42 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 42 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 43 }, { action: 1 /* Reduce */, productionIndex: 43 }, { action: 1 /* Reduce */, productionIndex: 43 }, { action: 1 /* Reduce */, productionIndex: 43 }, { action: 1 /* Reduce */, productionIndex: 43 }, { action: 0 /* Shift */, nextState: 54 }, { action: 1 /* Reduce */, productionIndex: 43 }, null, { action: 1 /* Reduce */, productionIndex: 43 }, { action: 1 /* Reduce */, productionIndex: 43 }, null, { action: 1 /* Reduce */, productionIndex: 43 }, { action: 1 /* Reduce */, productionIndex: 43 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, { action: 1 /* Reduce */, productionIndex: 43 }, null, null, { action: 1 /* Reduce */, productionIndex: 43 }, null, { action: 1 /* Reduce */, productionIndex: 43 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 43 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 43 }, { action: 1 /* Reduce */, productionIndex: 43 }, null, { action: 1 /* Reduce */, productionIndex: 43 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 43 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 45 }, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, { action: 1 /* Reduce */, productionIndex: 45 }, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, { action: 1 /* Reduce */, productionIndex: 45 }, { action: 1 /* Reduce */, productionIndex: 45 }, null, { action: 1 /* Reduce */, productionIndex: 45 }, { action: 1 /* Reduce */, productionIndex: 45 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, { action: 1 /* Reduce */, productionIndex: 45 }, null, null, { action: 1 /* Reduce */, productionIndex: 45 }, null, { action: 1 /* Reduce */, productionIndex: 45 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 45 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 45 }, { action: 1 /* Reduce */, productionIndex: 45 }, null, { action: 1 /* Reduce */, productionIndex: 45 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 45 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 46 }, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, { action: 1 /* Reduce */, productionIndex: 46 }, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, { action: 1 /* Reduce */, productionIndex: 46 }, { action: 1 /* Reduce */, productionIndex: 46 }, null, { action: 1 /* Reduce */, productionIndex: 46 }, { action: 1 /* Reduce */, productionIndex: 46 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, { action: 1 /* Reduce */, productionIndex: 46 }, null, null, { action: 1 /* Reduce */, productionIndex: 46 }, null, { action: 1 /* Reduce */, productionIndex: 46 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 46 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 46 }, { action: 1 /* Reduce */, productionIndex: 46 }, null, { action: 1 /* Reduce */, productionIndex: 46 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 46 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 47 }, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, { action: 1 /* Reduce */, productionIndex: 47 }, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, { action: 1 /* Reduce */, productionIndex: 47 }, { action: 1 /* Reduce */, productionIndex: 47 }, null, { action: 1 /* Reduce */, productionIndex: 47 }, { action: 1 /* Reduce */, productionIndex: 47 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, { action: 1 /* Reduce */, productionIndex: 47 }, null, null, { action: 1 /* Reduce */, productionIndex: 47 }, null, { action: 1 /* Reduce */, productionIndex: 47 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 47 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 47 }, { action: 1 /* Reduce */, productionIndex: 47 }, null, { action: 1 /* Reduce */, productionIndex: 47 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 47 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 25 }, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, { action: 1 /* Reduce */, productionIndex: 25 }, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, { action: 1 /* Reduce */, productionIndex: 25 }, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, { action: 1 /* Reduce */, productionIndex: 25 }, null, null, { action: 1 /* Reduce */, productionIndex: 25 }, null, { action: 1 /* Reduce */, productionIndex: 25 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 25 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 25 }, { action: 1 /* Reduce */, productionIndex: 25 }, null, { action: 1 /* Reduce */, productionIndex: 25 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 25 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 30 }, { action: 1 /* Reduce */, productionIndex: 30 }, { action: 1 /* Reduce */, productionIndex: 30 }, { action: 1 /* Reduce */, productionIndex: 30 }, { action: 1 /* Reduce */, productionIndex: 30 }, { action: 1 /* Reduce */, productionIndex: 30 }, { action: 1 /* Reduce */, productionIndex: 30 }, null, { action: 1 /* Reduce */, productionIndex: 30 }, { action: 1 /* Reduce */, productionIndex: 30 }, null, { action: 1 /* Reduce */, productionIndex: 30 }, { action: 1 /* Reduce */, productionIndex: 30 }, null, { action: 1 /* Reduce */, productionIndex: 30 }, null, null, { action: 1 /* Reduce */, productionIndex: 30 }, null, null, { action: 1 /* Reduce */, productionIndex: 30 }, null, { action: 1 /* Reduce */, productionIndex: 30 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 30 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 30 }, { action: 1 /* Reduce */, productionIndex: 30 }, null, { action: 1 /* Reduce */, productionIndex: 30 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 30 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 0 /* Shift */, nextState: 105 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 15 }, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, { action: 0 /* Shift */, nextState: 106 }, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, null, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 107 }, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 108 }, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 34 }, { action: 1 /* Reduce */, productionIndex: 34 }, { action: 1 /* Reduce */, productionIndex: 34 }, { action: 1 /* Reduce */, productionIndex: 34 }, { action: 1 /* Reduce */, productionIndex: 34 }, { action: 1 /* Reduce */, productionIndex: 34 }, { action: 1 /* Reduce */, productionIndex: 34 }, null, { action: 1 /* Reduce */, productionIndex: 34 }, { action: 1 /* Reduce */, productionIndex: 34 }, null, { action: 1 /* Reduce */, productionIndex: 34 }, { action: 1 /* Reduce */, productionIndex: 34 }, null, { action: 1 /* Reduce */, productionIndex: 34 }, null, null, { action: 1 /* Reduce */, productionIndex: 34 }, null, null, { action: 1 /* Reduce */, productionIndex: 34 }, null, { action: 1 /* Reduce */, productionIndex: 34 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 34 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 34 }, { action: 1 /* Reduce */, productionIndex: 34 }, null, { action: 1 /* Reduce */, productionIndex: 34 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 34 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, { action: 1 /* Reduce */, productionIndex: 17 }, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 110 }, null, { action: 3 /* None */, nextState: 109 }, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 35 }, { action: 1 /* Reduce */, productionIndex: 35 }, { action: 1 /* Reduce */, productionIndex: 35 }, { action: 1 /* Reduce */, productionIndex: 35 }, { action: 1 /* Reduce */, productionIndex: 35 }, { action: 1 /* Reduce */, productionIndex: 35 }, { action: 1 /* Reduce */, productionIndex: 35 }, null, { action: 1 /* Reduce */, productionIndex: 35 }, { action: 1 /* Reduce */, productionIndex: 35 }, null, { action: 1 /* Reduce */, productionIndex: 35 }, { action: 1 /* Reduce */, productionIndex: 35 }, null, { action: 1 /* Reduce */, productionIndex: 35 }, null, null, { action: 1 /* Reduce */, productionIndex: 35 }, null, null, { action: 1 /* Reduce */, productionIndex: 35 }, null, { action: 1 /* Reduce */, productionIndex: 35 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 35 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 35 }, { action: 1 /* Reduce */, productionIndex: 35 }, null, { action: 1 /* Reduce */, productionIndex: 35 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 35 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 111 }, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 112 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 114 }, null, null, null, null, null, null, null, null, null, null, { action: 3 /* None */, nextState: 113 }, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 49 }, { action: 1 /* Reduce */, productionIndex: 49 }, { action: 1 /* Reduce */, productionIndex: 49 }, { action: 1 /* Reduce */, productionIndex: 49 }, { action: 1 /* Reduce */, productionIndex: 49 }, { action: 1 /* Reduce */, productionIndex: 49 }, { action: 1 /* Reduce */, productionIndex: 49 }, null, { action: 1 /* Reduce */, productionIndex: 49 }, { action: 1 /* Reduce */, productionIndex: 49 }, null, { action: 1 /* Reduce */, productionIndex: 49 }, { action: 1 /* Reduce */, productionIndex: 49 }, null, { action: 1 /* Reduce */, productionIndex: 49 }, null, null, { action: 1 /* Reduce */, productionIndex: 49 }, null, null, { action: 1 /* Reduce */, productionIndex: 49 }, null, { action: 1 /* Reduce */, productionIndex: 49 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 49 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 49 }, { action: 1 /* Reduce */, productionIndex: 49 }, null, { action: 1 /* Reduce */, productionIndex: 49 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 49 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, null, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, null, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 115 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 11 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, { action: 0 /* Shift */, nextState: 116 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 91 }, { action: 3 /* None */, nextState: 117 }, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 118 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 31 }, { action: 1 /* Reduce */, productionIndex: 31 }, { action: 1 /* Reduce */, productionIndex: 31 }, { action: 1 /* Reduce */, productionIndex: 31 }, { action: 1 /* Reduce */, productionIndex: 31 }, { action: 1 /* Reduce */, productionIndex: 31 }, { action: 1 /* Reduce */, productionIndex: 31 }, null, { action: 1 /* Reduce */, productionIndex: 31 }, { action: 1 /* Reduce */, productionIndex: 31 }, null, { action: 1 /* Reduce */, productionIndex: 31 }, { action: 1 /* Reduce */, productionIndex: 31 }, null, { action: 1 /* Reduce */, productionIndex: 31 }, null, null, { action: 1 /* Reduce */, productionIndex: 31 }, null, null, { action: 1 /* Reduce */, productionIndex: 31 }, null, { action: 1 /* Reduce */, productionIndex: 31 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 31 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 31 }, { action: 1 /* Reduce */, productionIndex: 31 }, null, { action: 1 /* Reduce */, productionIndex: 31 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 31 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 91 }, { action: 3 /* None */, nextState: 119 }, null, null, null, null, null, null, null],
        [null, null, null, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, null, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, null, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, { action: 0 /* Shift */, nextState: 120 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, null, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, null, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 121 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 18 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, null, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, { action: 0 /* Shift */, nextState: 95 }, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 36 }, [{ action: 0 /* Shift */, nextState: 58 }, { action: 1 /* Reduce */, productionIndex: 36 }], [{ action: 0 /* Shift */, nextState: 56 }, { action: 1 /* Reduce */, productionIndex: 36 }], { action: 1 /* Reduce */, productionIndex: 36 }, [{ action: 0 /* Shift */, nextState: 57 }, { action: 1 /* Reduce */, productionIndex: 36 }], [{ action: 0 /* Shift */, nextState: 54 }, { action: 1 /* Reduce */, productionIndex: 36 }], [{ action: 0 /* Shift */, nextState: 59 }, { action: 1 /* Reduce */, productionIndex: 36 }], null, { action: 1 /* Reduce */, productionIndex: 36 }, [{ action: 0 /* Shift */, nextState: 60 }, { action: 1 /* Reduce */, productionIndex: 36 }], null, [{ action: 0 /* Shift */, nextState: 61 }, { action: 1 /* Reduce */, productionIndex: 36 }], [{ action: 0 /* Shift */, nextState: 62 }, { action: 1 /* Reduce */, productionIndex: 36 }], null, [{ action: 0 /* Shift */, nextState: 55 }, { action: 1 /* Reduce */, productionIndex: 36 }], null, null, { action: 1 /* Reduce */, productionIndex: 36 }, null, null, { action: 1 /* Reduce */, productionIndex: 36 }, null, { action: 1 /* Reduce */, productionIndex: 36 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 36 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 36 }, { action: 1 /* Reduce */, productionIndex: 36 }, null, { action: 1 /* Reduce */, productionIndex: 36 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 36 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, { action: 0 /* Shift */, nextState: 123 }, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 122 }, null, null, null, null, null, null, null, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 19 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 124 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 125 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 10 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 26 }, { action: 1 /* Reduce */, productionIndex: 26 }, { action: 1 /* Reduce */, productionIndex: 26 }, { action: 1 /* Reduce */, productionIndex: 26 }, { action: 1 /* Reduce */, productionIndex: 26 }, { action: 1 /* Reduce */, productionIndex: 26 }, { action: 1 /* Reduce */, productionIndex: 26 }, null, { action: 1 /* Reduce */, productionIndex: 26 }, { action: 1 /* Reduce */, productionIndex: 26 }, null, { action: 1 /* Reduce */, productionIndex: 26 }, { action: 1 /* Reduce */, productionIndex: 26 }, null, { action: 1 /* Reduce */, productionIndex: 26 }, null, null, { action: 1 /* Reduce */, productionIndex: 26 }, null, null, { action: 1 /* Reduce */, productionIndex: 26 }, null, { action: 1 /* Reduce */, productionIndex: 26 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 26 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 26 }, { action: 1 /* Reduce */, productionIndex: 26 }, null, { action: 1 /* Reduce */, productionIndex: 26 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 26 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 0 /* Shift */, nextState: 126 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 127 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 16 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 128 }, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 33 }, { action: 1 /* Reduce */, productionIndex: 33 }, { action: 1 /* Reduce */, productionIndex: 33 }, { action: 1 /* Reduce */, productionIndex: 33 }, { action: 1 /* Reduce */, productionIndex: 33 }, { action: 1 /* Reduce */, productionIndex: 33 }, { action: 1 /* Reduce */, productionIndex: 33 }, null, { action: 1 /* Reduce */, productionIndex: 33 }, { action: 1 /* Reduce */, productionIndex: 33 }, null, { action: 1 /* Reduce */, productionIndex: 33 }, { action: 1 /* Reduce */, productionIndex: 33 }, null, { action: 1 /* Reduce */, productionIndex: 33 }, null, null, { action: 1 /* Reduce */, productionIndex: 33 }, null, null, { action: 1 /* Reduce */, productionIndex: 33 }, null, { action: 1 /* Reduce */, productionIndex: 33 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 33 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 33 }, { action: 1 /* Reduce */, productionIndex: 33 }, null, { action: 1 /* Reduce */, productionIndex: 33 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 33 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 129 }, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 70 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 3 /* None */, nextState: 130 }, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 37 }, { action: 1 /* Reduce */, productionIndex: 37 }, { action: 1 /* Reduce */, productionIndex: 37 }, { action: 1 /* Reduce */, productionIndex: 37 }, { action: 1 /* Reduce */, productionIndex: 37 }, { action: 1 /* Reduce */, productionIndex: 37 }, { action: 1 /* Reduce */, productionIndex: 37 }, null, { action: 1 /* Reduce */, productionIndex: 37 }, { action: 1 /* Reduce */, productionIndex: 37 }, null, { action: 1 /* Reduce */, productionIndex: 37 }, { action: 1 /* Reduce */, productionIndex: 37 }, null, { action: 1 /* Reduce */, productionIndex: 37 }, null, null, { action: 1 /* Reduce */, productionIndex: 37 }, null, null, { action: 1 /* Reduce */, productionIndex: 37 }, null, { action: 1 /* Reduce */, productionIndex: 37 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 37 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 37 }, { action: 1 /* Reduce */, productionIndex: 37 }, null, { action: 1 /* Reduce */, productionIndex: 37 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 37 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 131 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 27 }, { action: 1 /* Reduce */, productionIndex: 27 }, { action: 1 /* Reduce */, productionIndex: 27 }, { action: 1 /* Reduce */, productionIndex: 27 }, { action: 1 /* Reduce */, productionIndex: 27 }, { action: 1 /* Reduce */, productionIndex: 27 }, { action: 1 /* Reduce */, productionIndex: 27 }, null, { action: 1 /* Reduce */, productionIndex: 27 }, { action: 1 /* Reduce */, productionIndex: 27 }, null, { action: 1 /* Reduce */, productionIndex: 27 }, { action: 1 /* Reduce */, productionIndex: 27 }, null, { action: 1 /* Reduce */, productionIndex: 27 }, null, null, { action: 1 /* Reduce */, productionIndex: 27 }, null, null, { action: 1 /* Reduce */, productionIndex: 27 }, null, { action: 1 /* Reduce */, productionIndex: 27 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 27 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 27 }, { action: 1 /* Reduce */, productionIndex: 27 }, null, { action: 1 /* Reduce */, productionIndex: 27 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 27 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, { action: 0 /* Shift */, nextState: 132 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 91 }, { action: 3 /* None */, nextState: 133 }, null, null, null, null, null, null, null],
        [null, null, null, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, null, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, null, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, null, null, null, { action: 0 /* Shift */, nextState: 134 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, { action: 0 /* Shift */, nextState: 135 }, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, null, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, null, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 20 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 21 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 136 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 28 }, { action: 1 /* Reduce */, productionIndex: 28 }, { action: 1 /* Reduce */, productionIndex: 28 }, { action: 1 /* Reduce */, productionIndex: 28 }, { action: 1 /* Reduce */, productionIndex: 28 }, { action: 1 /* Reduce */, productionIndex: 28 }, { action: 1 /* Reduce */, productionIndex: 28 }, null, { action: 1 /* Reduce */, productionIndex: 28 }, { action: 1 /* Reduce */, productionIndex: 28 }, null, { action: 1 /* Reduce */, productionIndex: 28 }, { action: 1 /* Reduce */, productionIndex: 28 }, null, { action: 1 /* Reduce */, productionIndex: 28 }, null, null, { action: 1 /* Reduce */, productionIndex: 28 }, null, null, { action: 1 /* Reduce */, productionIndex: 28 }, null, { action: 1 /* Reduce */, productionIndex: 28 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 28 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 28 }, { action: 1 /* Reduce */, productionIndex: 28 }, null, { action: 1 /* Reduce */, productionIndex: 28 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 28 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 0 /* Shift */, nextState: 137 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 32 }, { action: 1 /* Reduce */, productionIndex: 32 }, { action: 1 /* Reduce */, productionIndex: 32 }, { action: 1 /* Reduce */, productionIndex: 32 }, { action: 1 /* Reduce */, productionIndex: 32 }, { action: 1 /* Reduce */, productionIndex: 32 }, { action: 1 /* Reduce */, productionIndex: 32 }, null, { action: 1 /* Reduce */, productionIndex: 32 }, { action: 1 /* Reduce */, productionIndex: 32 }, null, { action: 1 /* Reduce */, productionIndex: 32 }, { action: 1 /* Reduce */, productionIndex: 32 }, null, { action: 1 /* Reduce */, productionIndex: 32 }, null, null, { action: 1 /* Reduce */, productionIndex: 32 }, null, null, { action: 1 /* Reduce */, productionIndex: 32 }, null, { action: 1 /* Reduce */, productionIndex: 32 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 32 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 32 }, { action: 1 /* Reduce */, productionIndex: 32 }, null, { action: 1 /* Reduce */, productionIndex: 32 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 32 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 70 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 3 /* None */, nextState: 138 }, null],
        [null, { action: 0 /* Shift */, nextState: 47 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 42 }, null, null, null, { action: 0 /* Shift */, nextState: 51 }, null, { action: 0 /* Shift */, nextState: 38 }, null, null, { action: 0 /* Shift */, nextState: 48 }, { action: 0 /* Shift */, nextState: 44 }, { action: 0 /* Shift */, nextState: 41 }, null, { action: 0 /* Shift */, nextState: 43 }, { action: 0 /* Shift */, nextState: 46 }, { action: 0 /* Shift */, nextState: 37 }, null, null, { action: 0 /* Shift */, nextState: 49 }, null, { action: 0 /* Shift */, nextState: 50 }, null, { action: 0 /* Shift */, nextState: 39 }, { action: 0 /* Shift */, nextState: 40 }, null, { action: 0 /* Shift */, nextState: 45 }, null, null, { action: 3 /* None */, nextState: 139 }, null, null, null, null, null, null, null, null],
        [null, null, { action: 1 /* Reduce */, productionIndex: 29 }, { action: 1 /* Reduce */, productionIndex: 29 }, { action: 1 /* Reduce */, productionIndex: 29 }, { action: 1 /* Reduce */, productionIndex: 29 }, { action: 1 /* Reduce */, productionIndex: 29 }, { action: 1 /* Reduce */, productionIndex: 29 }, { action: 1 /* Reduce */, productionIndex: 29 }, null, { action: 1 /* Reduce */, productionIndex: 29 }, { action: 1 /* Reduce */, productionIndex: 29 }, null, { action: 1 /* Reduce */, productionIndex: 29 }, { action: 1 /* Reduce */, productionIndex: 29 }, null, { action: 1 /* Reduce */, productionIndex: 29 }, null, null, { action: 1 /* Reduce */, productionIndex: 29 }, null, null, { action: 1 /* Reduce */, productionIndex: 29 }, null, { action: 1 /* Reduce */, productionIndex: 29 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 29 }, null, null, null, { action: 1 /* Reduce */, productionIndex: 29 }, { action: 1 /* Reduce */, productionIndex: 29 }, null, { action: 1 /* Reduce */, productionIndex: 29 }, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 29 }, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 22 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, { action: 0 /* Shift */, nextState: 58 }, { action: 0 /* Shift */, nextState: 56 }, null, { action: 0 /* Shift */, nextState: 57 }, { action: 0 /* Shift */, nextState: 54 }, { action: 0 /* Shift */, nextState: 59 }, null, { action: 0 /* Shift */, nextState: 140 }, { action: 0 /* Shift */, nextState: 60 }, null, { action: 0 /* Shift */, nextState: 61 }, { action: 0 /* Shift */, nextState: 62 }, null, { action: 0 /* Shift */, nextState: 55 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 23 }, null, null, null, null, null, null, null, null, null, null, null, { action: 0 /* Shift */, nextState: 114 }, null, null, null, null, null, null, null, null, null, null, { action: 3 /* None */, nextState: 141 }, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { action: 1 /* Reduce */, productionIndex: 24 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        [null]
    ];
    CoolToJS.productions = [
        { popCount: 2, reduceResult: null },
        { popCount: 2, reduceResult: 53 /* Program */ },
        { popCount: 3, reduceResult: 53 /* Program */ },
        { popCount: 2, reduceResult: 49 /* FeatureList */ },
        { popCount: 3, reduceResult: 49 /* FeatureList */ },
        { popCount: 7, reduceResult: 44 /* Class */ },
        { popCount: 6, reduceResult: 44 /* Class */ },
        { popCount: 5, reduceResult: 44 /* Class */ },
        { popCount: 1, reduceResult: 51 /* FormalList */ },
        { popCount: 3, reduceResult: 51 /* FormalList */ },
        { popCount: 9, reduceResult: 48 /* Feature */ },
        { popCount: 8, reduceResult: 48 /* Feature */ },
        { popCount: 5, reduceResult: 48 /* Feature */ },
        { popCount: 3, reduceResult: 48 /* Feature */ },
        { popCount: 3, reduceResult: 50 /* Formal */ },
        { popCount: 1, reduceResult: 46 /* ExpressionList */ },
        { popCount: 3, reduceResult: 46 /* ExpressionList */ },
        { popCount: 2, reduceResult: 47 /* ExpressionSeries */ },
        { popCount: 3, reduceResult: 47 /* ExpressionSeries */ },
        { popCount: 3, reduceResult: 52 /* LocalVariableDeclarationList */ },
        { popCount: 5, reduceResult: 52 /* LocalVariableDeclarationList */ },
        { popCount: 5, reduceResult: 52 /* LocalVariableDeclarationList */ },
        { popCount: 7, reduceResult: 52 /* LocalVariableDeclarationList */ },
        { popCount: 6, reduceResult: 43 /* CaseOption */ },
        { popCount: 7, reduceResult: 43 /* CaseOption */ },
        { popCount: 3, reduceResult: 45 /* Expression */ },
        { popCount: 5, reduceResult: 45 /* Expression */ },
        { popCount: 6, reduceResult: 45 /* Expression */ },
        { popCount: 7, reduceResult: 45 /* Expression */ },
        { popCount: 8, reduceResult: 45 /* Expression */ },
        { popCount: 3, reduceResult: 45 /* Expression */ },
        { popCount: 4, reduceResult: 45 /* Expression */ },
        { popCount: 7, reduceResult: 45 /* Expression */ },
        { popCount: 5, reduceResult: 45 /* Expression */ },
        { popCount: 3, reduceResult: 45 /* Expression */ },
        { popCount: 3, reduceResult: 45 /* Expression */ },
        { popCount: 4, reduceResult: 45 /* Expression */ },
        { popCount: 5, reduceResult: 45 /* Expression */ },
        { popCount: 2, reduceResult: 45 /* Expression */ },
        { popCount: 2, reduceResult: 45 /* Expression */ },
        { popCount: 3, reduceResult: 45 /* Expression */ },
        { popCount: 3, reduceResult: 45 /* Expression */ },
        { popCount: 3, reduceResult: 45 /* Expression */ },
        { popCount: 3, reduceResult: 45 /* Expression */ },
        { popCount: 2, reduceResult: 45 /* Expression */ },
        { popCount: 3, reduceResult: 45 /* Expression */ },
        { popCount: 3, reduceResult: 45 /* Expression */ },
        { popCount: 3, reduceResult: 45 /* Expression */ },
        { popCount: 2, reduceResult: 45 /* Expression */ },
        { popCount: 3, reduceResult: 45 /* Expression */ },
        { popCount: 1, reduceResult: 45 /* Expression */ },
        { popCount: 1, reduceResult: 45 /* Expression */ },
        { popCount: 1, reduceResult: 45 /* Expression */ },
        { popCount: 1, reduceResult: 45 /* Expression */ },
        { popCount: 1, reduceResult: 45 /* Expression */ },
    ];
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    var DontCompile;
    (function (DontCompile) {
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
        })(DontCompile.SyntaxKind || (DontCompile.SyntaxKind = {}));
        var SyntaxKind = DontCompile.SyntaxKind;
        DontCompile.StartSyntaxKind = 6 /* E */;
        // order signifies priority (keywords are listed first)
        DontCompile.TokenLookup = [
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
        DontCompile.isKeyword = isKeyword;
    })(DontCompile = CoolToJS.DontCompile || (CoolToJS.DontCompile = {}));
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    (function (SyntaxKind) {
        SyntaxKind[SyntaxKind["EndOfInput"] = 0] = "EndOfInput";
        SyntaxKind[SyntaxKind["OpenParenthesis"] = 1] = "OpenParenthesis";
        SyntaxKind[SyntaxKind["ClosedParenthesis"] = 2] = "ClosedParenthesis";
        SyntaxKind[SyntaxKind["MultiplationOperator"] = 3] = "MultiplationOperator";
        SyntaxKind[SyntaxKind["AdditionOperator"] = 4] = "AdditionOperator";
        SyntaxKind[SyntaxKind["Comma"] = 5] = "Comma";
        SyntaxKind[SyntaxKind["SubtractionOperator"] = 6] = "SubtractionOperator";
        SyntaxKind[SyntaxKind["DotOperator"] = 7] = "DotOperator";
        SyntaxKind[SyntaxKind["DivisionOperator"] = 8] = "DivisionOperator";
        SyntaxKind[SyntaxKind["Colon"] = 9] = "Colon";
        SyntaxKind[SyntaxKind["SemiColon"] = 10] = "SemiColon";
        SyntaxKind[SyntaxKind["LessThanOperator"] = 11] = "LessThanOperator";
        SyntaxKind[SyntaxKind["AssignmentOperator"] = 12] = "AssignmentOperator";
        SyntaxKind[SyntaxKind["LessThanOrEqualsOperator"] = 13] = "LessThanOrEqualsOperator";
        SyntaxKind[SyntaxKind["EqualsOperator"] = 14] = "EqualsOperator";
        SyntaxKind[SyntaxKind["FatArrowOperator"] = 15] = "FatArrowOperator";
        SyntaxKind[SyntaxKind["AtSignOperator"] = 16] = "AtSignOperator";
        SyntaxKind[SyntaxKind["CaseKeyword"] = 17] = "CaseKeyword";
        SyntaxKind[SyntaxKind["ClassKeyword"] = 18] = "ClassKeyword";
        SyntaxKind[SyntaxKind["ElseKeyword"] = 19] = "ElseKeyword";
        SyntaxKind[SyntaxKind["EsacKeyword"] = 20] = "EsacKeyword";
        SyntaxKind[SyntaxKind["FalseKeyword"] = 21] = "FalseKeyword";
        SyntaxKind[SyntaxKind["FiKeyword"] = 22] = "FiKeyword";
        SyntaxKind[SyntaxKind["IfKeyword"] = 23] = "IfKeyword";
        SyntaxKind[SyntaxKind["InKeyword"] = 24] = "InKeyword";
        SyntaxKind[SyntaxKind["InheritsKeyword"] = 25] = "InheritsKeyword";
        SyntaxKind[SyntaxKind["Integer"] = 26] = "Integer";
        SyntaxKind[SyntaxKind["IsvoidKeyword"] = 27] = "IsvoidKeyword";
        SyntaxKind[SyntaxKind["LetKeyword"] = 28] = "LetKeyword";
        SyntaxKind[SyntaxKind["LoopKeyword"] = 29] = "LoopKeyword";
        SyntaxKind[SyntaxKind["NewKeyword"] = 30] = "NewKeyword";
        SyntaxKind[SyntaxKind["NotKeyword"] = 31] = "NotKeyword";
        SyntaxKind[SyntaxKind["ObjectIdentifier"] = 32] = "ObjectIdentifier";
        SyntaxKind[SyntaxKind["OfKeyword"] = 33] = "OfKeyword";
        SyntaxKind[SyntaxKind["PoolKeyword"] = 34] = "PoolKeyword";
        SyntaxKind[SyntaxKind["String"] = 35] = "String";
        SyntaxKind[SyntaxKind["ThenKeyword"] = 36] = "ThenKeyword";
        SyntaxKind[SyntaxKind["TrueKeyword"] = 37] = "TrueKeyword";
        SyntaxKind[SyntaxKind["TypeIdentifier"] = 38] = "TypeIdentifier";
        SyntaxKind[SyntaxKind["WhileKeyword"] = 39] = "WhileKeyword";
        SyntaxKind[SyntaxKind["OpenCurlyBracket"] = 40] = "OpenCurlyBracket";
        SyntaxKind[SyntaxKind["ClosedCurlyBracket"] = 41] = "ClosedCurlyBracket";
        SyntaxKind[SyntaxKind["TildeOperator"] = 42] = "TildeOperator";
        SyntaxKind[SyntaxKind["CaseOption"] = 43] = "CaseOption";
        SyntaxKind[SyntaxKind["Class"] = 44] = "Class";
        SyntaxKind[SyntaxKind["Expression"] = 45] = "Expression";
        SyntaxKind[SyntaxKind["ExpressionList"] = 46] = "ExpressionList";
        SyntaxKind[SyntaxKind["ExpressionSeries"] = 47] = "ExpressionSeries";
        SyntaxKind[SyntaxKind["Feature"] = 48] = "Feature";
        SyntaxKind[SyntaxKind["FeatureList"] = 49] = "FeatureList";
        SyntaxKind[SyntaxKind["Formal"] = 50] = "Formal";
        SyntaxKind[SyntaxKind["FormalList"] = 51] = "FormalList";
        SyntaxKind[SyntaxKind["LocalVariableDeclarationList"] = 52] = "LocalVariableDeclarationList";
        SyntaxKind[SyntaxKind["Program"] = 53] = "Program";
        SyntaxKind[SyntaxKind["WhiteSpace"] = 54] = "WhiteSpace";
        SyntaxKind[SyntaxKind["CarriageReturn"] = 55] = "CarriageReturn";
        SyntaxKind[SyntaxKind["NewLine"] = 56] = "NewLine";
        SyntaxKind[SyntaxKind["Tab"] = 57] = "Tab";
        SyntaxKind[SyntaxKind["Comment"] = 58] = "Comment";
    })(CoolToJS.SyntaxKind || (CoolToJS.SyntaxKind = {}));
    var SyntaxKind = CoolToJS.SyntaxKind;
    CoolToJS.StartSyntaxKind = 53 /* Program */;
    // order signifies priority (keywords are listed first)
    CoolToJS.TokenLookup = [
        {
            token: 18 /* ClassKeyword */,
            regex: /^(class)\b/i,
        },
        {
            token: 19 /* ElseKeyword */,
            regex: /^(else)\b/i,
        },
        {
            token: 21 /* FalseKeyword */,
            regex: /^(f[aA][lL][sS][eE])\b/,
        },
        {
            token: 37 /* TrueKeyword */,
            regex: /^(t[rR][uU][eE])\b/,
        },
        {
            token: 22 /* FiKeyword */,
            regex: /^(fi)\b/i,
        },
        {
            token: 23 /* IfKeyword */,
            regex: /^(if)\b/i,
        },
        {
            token: 25 /* InheritsKeyword */,
            regex: /^(inherits)\b/i,
        },
        {
            token: 27 /* IsvoidKeyword */,
            regex: /^(isvoid)\b/i,
        },
        {
            token: 28 /* LetKeyword */,
            regex: /^(let)\b/i,
        },
        {
            token: 24 /* InKeyword */,
            regex: /^(in)\b/i,
        },
        {
            token: 29 /* LoopKeyword */,
            regex: /^(loop)\b/i,
        },
        {
            token: 34 /* PoolKeyword */,
            regex: /^(pool)\b/i,
        },
        {
            token: 36 /* ThenKeyword */,
            regex: /^(then)\b/i,
        },
        {
            token: 39 /* WhileKeyword */,
            regex: /^(while)\b/i,
        },
        {
            token: 17 /* CaseKeyword */,
            regex: /^(case)\b/i,
        },
        {
            token: 20 /* EsacKeyword */,
            regex: /^(esac)\b/i,
        },
        {
            token: 30 /* NewKeyword */,
            regex: /^(new)\b/i,
        },
        {
            token: 33 /* OfKeyword */,
            regex: /^(of)\b/i,
        },
        {
            token: 31 /* NotKeyword */,
            regex: /^(not)\b/i,
        },
        {
            token: 26 /* Integer */,
            regex: /^([0-9]+)\b/,
        },
        {
            token: 35 /* String */,
            matchFunction: function (input) {
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
            token: 32 /* ObjectIdentifier */,
            regex: /^([a-z][a-zA-Z0-9_]*)\b/,
        },
        {
            token: 38 /* TypeIdentifier */,
            regex: /^([A-Z][a-zA-Z0-9_]*)\b/,
        },
        {
            token: 54 /* WhiteSpace */,
            regex: /^( +)/,
        },
        {
            token: 55 /* CarriageReturn */,
            regex: /^(\r)/,
        },
        {
            token: 56 /* NewLine */,
            regex: /^(\n)/,
        },
        {
            token: 57 /* Tab */,
            regex: /^(\t)/,
        },
        {
            token: 58 /* Comment */,
            regex: /^((?:--.*)|(?:\(\*(?:(?!\*\))[\s\S])*\*\)))/,
        },
        {
            token: 7 /* DotOperator */,
            regex: /^(\.)/
        },
        {
            token: 16 /* AtSignOperator */,
            regex: /^(\@)/
        },
        {
            token: 42 /* TildeOperator */,
            regex: /^(~)/
        },
        {
            token: 3 /* MultiplationOperator */,
            regex: /^(\*)/
        },
        {
            token: 8 /* DivisionOperator */,
            regex: /^(\/)/
        },
        {
            token: 4 /* AdditionOperator */,
            regex: /^(\+)/
        },
        {
            token: 6 /* SubtractionOperator */,
            regex: /^(-)/
        },
        {
            token: 13 /* LessThanOrEqualsOperator */,
            regex: /^(<=)/
        },
        {
            token: 11 /* LessThanOperator */,
            regex: /^(<)/
        },
        {
            token: 14 /* EqualsOperator */,
            regex: /^(=)/
        },
        {
            token: 12 /* AssignmentOperator */,
            regex: /^(<-)/
        },
        {
            token: 15 /* FatArrowOperator */,
            regex: /^(=>)/
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
            token: 40 /* OpenCurlyBracket */,
            regex: /^(\{)/
        },
        {
            token: 41 /* ClosedCurlyBracket */,
            regex: /^(\})/
        },
        {
            token: 9 /* Colon */,
            regex: /^(:)/
        },
        {
            token: 10 /* SemiColon */,
            regex: /^(;)/
        },
        {
            token: 5 /* Comma */,
            regex: /^(,)/
        }
    ];
    function isKeyword(tokenType) {
        return (tokenType == 18 /* ClassKeyword */ || tokenType == 19 /* ElseKeyword */ || tokenType == 21 /* FalseKeyword */ || tokenType == 22 /* FiKeyword */ || tokenType == 23 /* IfKeyword */ || tokenType == 24 /* InKeyword */ || tokenType == 25 /* InheritsKeyword */ || tokenType == 27 /* IsvoidKeyword */ || tokenType == 28 /* LetKeyword */ || tokenType == 29 /* LoopKeyword */ || tokenType == 34 /* PoolKeyword */ || tokenType == 36 /* ThenKeyword */ || tokenType == 39 /* WhileKeyword */ || tokenType == 17 /* CaseKeyword */ || tokenType == 20 /* EsacKeyword */ || tokenType == 30 /* NewKeyword */ || tokenType == 33 /* OfKeyword */ || tokenType == 31 /* NotKeyword */ || tokenType == 37 /* TrueKeyword */);
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