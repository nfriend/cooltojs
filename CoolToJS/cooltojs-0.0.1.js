var CoolToJS;
(function (CoolToJS) {
    var CoolProgramSources;
    (function (CoolProgramSources) {
        CoolProgramSources.List = '(*\r\n *  This file shows how to implement a list data type for lists of integers.\r\n *  It makes use of INHERITANCE and DYNAMIC DISPATCH.\r\n *\r\n *  The List class has 4 operations defined on List objects. If \'l\' is\r\n *  a list, then the methods dispatched on \'l\' have the following effects:\r\n *\r\n *    isNil() : Bool\t\tReturns true if \'l\' is empty, false otherwise.\r\n *    head()  : Int\t\tReturns the integer at the head of \'l\'.\r\n *\t\t\t\tIf \'l\' is empty, execution aborts.\r\n *    tail()  : List\t\tReturns the remainder of the \'l\',\r\n *\t\t\t\ti.e. without the first element.\r\n *    cons(i : Int) : List\tReturn a new list containing i as the\r\n *\t\t\t\tfirst element, followed by the\r\n *\t\t\t\telements in \'l\'.\r\n *\r\n *  There are 2 kinds of lists, the empty list and a non-empty\r\n *  list. We can think of the non-empty list as a specialization of\r\n *  the empty list.\r\n *  The class List defines the operations on empty list. The class\r\n *  Cons inherits from List and redefines things to handle non-empty\r\n *  lists.\r\n *)\r\n\r\n\r\nclass List {\r\n   -- Define operations on empty lists.\r\n\r\n   isNil() : Bool { true };\r\n\r\n   -- Since abort() has return type Object and head() has return type\r\n   -- Int, we need to have an Int as the result of the method body,\r\n   -- even though abort() never returns.\r\n\r\n   head()  : Int { { abort(); 0; } };\r\n\r\n   -- As for head(), the self is just to make sure the return type of\r\n   -- tail() is correct.\r\n\r\n   tail()  : List { { abort(); self; } };\r\n\r\n   -- When we cons and element onto the empty list we get a non-empty\r\n   -- list. The (new Cons) expression creates a new list cell of class\r\n   -- Cons, which is initialized by a dispatch to init().\r\n   -- The result of init() is an element of class Cons, but it\r\n   -- conforms to the return type List, because Cons is a subclass of\r\n   -- List.\r\n\r\n   cons(i : Int) : List {\r\n      (new Cons).init(i, self)\r\n   };\r\n\r\n};\r\n\r\n\r\n(*\r\n *  Cons inherits all operations from List. We can reuse only the cons\r\n *  method though, because adding an element to the front of an emtpy\r\n *  list is the same as adding it to the front of a non empty\r\n *  list. All other methods have to be redefined, since the behaviour\r\n *  for them is different from the empty list.\r\n *\r\n *  Cons needs two attributes to hold the integer of this list\r\n *  cell and to hold the rest of the list.\r\n *\r\n *  The init() method is used by the cons() method to initialize the\r\n *  cell.\r\n *)\r\n\r\nclass Cons inherits List {\r\n\r\n   car : Int;\t-- The element in this list cell\r\n\r\n   cdr : List;\t-- The rest of the list\r\n\r\n   isNil() : Bool { false };\r\n\r\n   head()  : Int { car };\r\n\r\n   tail()  : List { cdr };\r\n\r\n   init(i : Int, rest : List) : List {\r\n      {\r\n\t car <- i;\r\n\t cdr <- rest;\r\n\t self;\r\n      }\r\n   };\r\n\r\n};\r\n\r\n\r\n\r\n(*\r\n *  The Main class shows how to use the List class. It creates a small\r\n *  list and then repeatedly prints out its elements and takes off the\r\n *  first element of the list.\r\n *)\r\n\r\nclass Main inherits IO {\r\n\r\n   mylist : List;\r\n\r\n   -- Print all elements of the list. Calls itself recursively with\r\n   -- the tail of the list, until the end of the list is reached.\r\n\r\n   print_list(l : List) : Object {\r\n      if l.isNil() then out_string(\"\\n\")\r\n                   else {\r\n\t\t\t   out_int(l.head());\r\n\t\t\t   out_string(\" \");\r\n\t\t\t   print_list(l.tail());\r\n\t\t        }\r\n      fi\r\n   };\r\n\r\n   -- Note how the dynamic dispatch mechanism is responsible to end\r\n   -- the while loop. As long as mylist is bound to an object of \r\n   -- dynamic type Cons, the dispatch to isNil calls the isNil method of\r\n   -- the Cons class, which returns false. However when we reach the\r\n   -- end of the list, mylist gets bound to the object that was\r\n   -- created by the (new List) expression. This object is of dynamic type\r\n   -- List, and thus the method isNil in the List class is called and\r\n   -- returns true.\r\n\r\n   main() : Object {\r\n      {\r\n\t mylist <- new List.cons(1).cons(2).cons(3).cons(4).cons(5);\r\n\t while (not mylist.isNil()) loop\r\n\t    {\r\n\t       print_list(mylist);\r\n\t       mylist <- mylist.tail();\r\n\t    }\r\n\t pool;\r\n      }\r\n   };\r\n\r\n};';
        CoolProgramSources.HelloWorld = 'class Main inherits IO {\r\n\tmain() : Object {\r\n\t\tout_string(\"Hello, world.\\n\")\r\n\t};\r\n};';
        CoolProgramSources.Atoi = '(*\r\n   The class A2I provides integer-to-string and string-to-integer\r\nconversion routines.  To use these routines, either inherit them\r\nin the class where needed, have a dummy variable bound to\r\nsomething of type A2I, or simpl write (new A2I).method(argument).\r\n*)\r\n\r\n\r\n(*\r\n   c2i   Converts a 1-character string to an integer.  Aborts\r\n         if the string is not \"0\" through \"9\"\r\n*)\r\nclass A2I {\r\n\r\n     c2i(char : String) : Int {\r\n\tif char = \"0\" then 0 else\r\n\tif char = \"1\" then 1 else\r\n\tif char = \"2\" then 2 else\r\n        if char = \"3\" then 3 else\r\n        if char = \"4\" then 4 else\r\n        if char = \"5\" then 5 else\r\n        if char = \"6\" then 6 else\r\n        if char = \"7\" then 7 else\r\n        if char = \"8\" then 8 else\r\n        if char = \"9\" then 9 else\r\n        { abort(); 0; }  -- the 0 is needed to satisfy the typchecker\r\n        fi fi fi fi fi fi fi fi fi fi\r\n     };\r\n\r\n(*\r\n   i2c is the inverse of c2i.\r\n*)\r\n     i2c(i : Int) : String {\r\n\tif i = 0 then \"0\" else\r\n\tif i = 1 then \"1\" else\r\n\tif i = 2 then \"2\" else\r\n\tif i = 3 then \"3\" else\r\n\tif i = 4 then \"4\" else\r\n\tif i = 5 then \"5\" else\r\n\tif i = 6 then \"6\" else\r\n\tif i = 7 then \"7\" else\r\n\tif i = 8 then \"8\" else\r\n\tif i = 9 then \"9\" else\r\n\t{ abort(); \"\"; }  -- the \"\" is needed to satisfy the typchecker\r\n        fi fi fi fi fi fi fi fi fi fi\r\n     };\r\n\r\n(*\r\n   a2i converts an ASCII string into an integer.  The empty string\r\nis converted to 0.  Signed and unsigned strings are handled.  The\r\nmethod aborts if the string does not represent an integer.  Very\r\nlong strings of digits produce strange answers because of arithmetic \r\noverflow.\r\n\r\n*)\r\n     a2i(s : String) : Int {\r\n        if s.length() = 0 then 0 else\r\n\tif s.substr(0,1) = \"-\" then ~a2i_aux(s.substr(1,s.length()-1)) else\r\n        if s.substr(0,1) = \"+\" then a2i_aux(s.substr(1,s.length()-1)) else\r\n           a2i_aux(s)\r\n        fi fi fi\r\n     };\r\n\r\n(*\r\n  a2i_aux converts the usigned portion of the string.  As a programming\r\nexample, this method is written iteratively.\r\n*)\r\n     a2i_aux(s : String) : Int {\r\n\t(let int : Int <- 0 in\t\r\n           {\t\r\n               (let j : Int <- s.length() in\r\n\t          (let i : Int <- 0 in\r\n\t\t    while i < j loop\r\n\t\t\t{\r\n\t\t\t    int <- int * 10 + c2i(s.substr(i,1));\r\n\t\t\t    i <- i + 1;\r\n\t\t\t}\r\n\t\t    pool\r\n\t\t  )\r\n\t       );\r\n              int;\r\n\t    }\r\n        )\r\n     };\r\n\r\n(*\r\n    i2a converts an integer to a string.  Positive and negative \r\nnumbers are handled correctly.  \r\n*)\r\n    i2a(i : Int) : String {\r\n\tif i = 0 then \"0\" else \r\n        if 0 < i then i2a_aux(i) else\r\n          \"-\".concat(i2a_aux(i * ~1)) \r\n        fi fi\r\n    };\r\n\t\r\n(*\r\n    i2a_aux is an example using recursion.\r\n*)\t\t\r\n    i2a_aux(i : Int) : String {\r\n        if i = 0 then \"\" else \r\n\t    (let next : Int <- i \/ 10 in\r\n\t\ti2a_aux(next).concat(i2c(i - next * 10))\r\n\t    )\r\n        fi\r\n    };\r\n\r\n};';
    })(CoolProgramSources = CoolToJS.CoolProgramSources || (CoolToJS.CoolProgramSources = {}));
})(CoolToJS || (CoolToJS = {}));
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
            this.Analyze = function (coolProgramSource) {
                var tokens = [], currentLineNumber = 1, currentColumnNumber = 1;
                while (coolProgramSource.length > 0) {
                    var longestMatch = null;
                    for (var i = 0; i < CoolToJS.TokenLookup.length; i++) {
                        var currentTokenOption = CoolToJS.TokenLookup[i], matchIsKeyword = CoolToJS.isKeyword(currentTokenOption.token);
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
                        return {
                            success: false,
                            errorMessages: ['Syntax error: Unexpected character at line ' + currentLineNumber + ', column ' + currentColumnNumber + ', near "' + coolProgramSource.slice(0, 20).replace(/\r\n|\r|\n|\t|[\s]+/g, ' ') + '..."']
                        };
                    }
                    if (longestMatch.token === 22 /* WhiteSpace */) {
                        // increment the line counter appropriately if
                        // the whitespace contains newline characters
                        var newlineCount = longestMatch.match.split(/\r\n|\r|\n|/).length - 1;
                        if (newlineCount > 0) {
                            currentLineNumber += newlineCount;
                            currentColumnNumber = 1;
                        }
                    }
                    else {
                        // update the column counter
                        currentColumnNumber += longestMatch.match.length;
                    }
                    tokens.push(longestMatch);
                    coolProgramSource = coolProgramSource.slice(longestMatch.match.length);
                }
                for (var i = 0; i < tokens.length; i++) {
                    console.log(CoolToJS.TokenType[tokens[i].token] + ': "' + tokens[i].match + '"');
                }
                return {
                    success: true,
                    tokens: tokens
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
        TokenType[TokenType["Comment"] = 23] = "Comment";
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
        TokenType[TokenType["FatArrowOperator"] = 35] = "FatArrowOperator";
        TokenType[TokenType["OpenParenthesis"] = 36] = "OpenParenthesis";
        TokenType[TokenType["ClosedParenthesis"] = 37] = "ClosedParenthesis";
        TokenType[TokenType["OpenCurlyBracket"] = 38] = "OpenCurlyBracket";
        TokenType[TokenType["ClosedCurlyBracket"] = 39] = "ClosedCurlyBracket";
        TokenType[TokenType["Colon"] = 40] = "Colon";
        TokenType[TokenType["SemiColon"] = 41] = "SemiColon";
        TokenType[TokenType["Comma"] = 42] = "Comma";
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
            // this is too simple
            regex: /^(".*")/,
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
            regex: /^(\s+)/,
        },
        {
            token: 23 /* Comment */,
            regex: /^((?:--.*)|(?:\(\*(?:(?!\*\))[\s\S])*\*\)))/,
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
            token: 35 /* FatArrowOperator */,
            regex: /^(=>)/
        },
        {
            token: 36 /* OpenParenthesis */,
            regex: /^(\()/
        },
        {
            token: 37 /* ClosedParenthesis */,
            regex: /^(\))/
        },
        {
            token: 38 /* OpenCurlyBracket */,
            regex: /^(\{)/
        },
        {
            token: 39 /* ClosedCurlyBracket */,
            regex: /^(\})/
        },
        {
            token: 40 /* Colon */,
            regex: /^(:)/
        },
        {
            token: 41 /* SemiColon */,
            regex: /^(;)/
        },
        {
            token: 42 /* Comma */,
            regex: /^(,)/
        }
    ];
    function isKeyword(tokenType) {
        return (tokenType == 0 /* ClassKeyword */ || tokenType == 1 /* ElseKeyword */ || tokenType == 2 /* FalseKeyword */ || tokenType == 3 /* FiKeyword */ || tokenType == 4 /* IfKeyword */ || tokenType == 5 /* InheritsKeyword */ || tokenType == 6 /* IsvoidKeyword */ || tokenType == 7 /* LetKeyword */ || tokenType == 8 /* LoopKeyword */ || tokenType == 9 /* PoolKeyword */ || tokenType == 10 /* ThenKeyword */ || tokenType == 11 /* WhileKeyword */ || tokenType == 12 /* CaseKeyword */ || tokenType == 13 /* EsacKeyword */ || tokenType == 14 /* NewKeyword */ || tokenType == 15 /* OfKeyword */ || tokenType == 16 /* NotKeyword */ || tokenType == 17 /* TrueKeyword */);
    }
    CoolToJS.isKeyword = isKeyword;
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    // temporary
    var generatedJavaScriptExample = '\
// note that this generated code is currently hardcoded\n\
// while the transpiler is being built\n\
\n\
function _outputFunction(output) {\n\
    window.consoleController.report([{\n\
        msg: output,\n\
        className: "jquery-console-output"\n\
    }]);\n\
}\n\
\n\
_outputFunction("Hello, world.\\n");\
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
        return {
            success: true,
            generatedJavaScript: generatedJavaScriptExample
        };
    }
    CoolToJS.Transpile = Transpile;
})(CoolToJS || (CoolToJS = {}));
//# sourceMappingURL=cooltojs-0.0.1.js.map