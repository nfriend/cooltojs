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
            var coolProgramSources = [];
            for (var i = 0; i < coolPrograms.length; i++) {
                coolProgramSources.push(coolPrograms[i].program);
                var output = '<b>' + coolPrograms[i].filename + ':</b>';
                output += '<pre>' + coolPrograms[i].program + '</pre>';
                output += '<br />';
                document.getElementById('output').innerHTML += output;
            }
            CoolToJS.Transpile(coolProgramSources);
        }
    }
    CoolToJS.Run = Run;
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    var LexicalAnalyzer = (function () {
        function LexicalAnalyzer() {
            this.Analyze = function (coolProgramSource) {
                console.log('Anaylzing Cool source: \n\n' + coolProgramSource);
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
    function Transpile(coolProgramSources) {
        var concatenatedCoolProgram = typeof coolProgramSources === 'string' ? coolProgramSources : coolProgramSources.join('\n');
        var lexicalAnalyzer = new CoolToJS.LexicalAnalyzer();
        lexicalAnalyzer.Analyze(concatenatedCoolProgram);
    }
    CoolToJS.Transpile = Transpile;
})(CoolToJS || (CoolToJS = {}));
//# sourceMappingURL=cooltojs-0.0.1.js.map