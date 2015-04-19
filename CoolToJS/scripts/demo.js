﻿var CoolToJSDemo;
(function (CoolToJSDemo) {
    'use strict';

    // faking the transpilation process for now

    var coolProgramExample = '\
class Main inherits IO {\n\
    main() : Object {\n\
        out_string("Hello, world.\\n")\n\
    };\n\
};\
';

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

    var outputExample = 'Hello, world.\n';

    var coolEditor = CodeMirror(document.getElementById('cool-editor'), {
        value: coolProgramExample,
        mode: 'javascript',
        lineNumbers: true,
        indentUnit: 4,
    });

    var generatedJavaScriptEditor = CodeMirror(document.getElementById('generated-javascript'), {
        mode: 'javascript',
        lineNumbers: true,
        indentUnit: 4,
        readOnly: true
    });

    var hasBeenTranspiled = false;
    document.getElementById('transpile-button').onclick = function () {
        generatedJavaScriptEditor.setValue(generatedJavaScriptExample);
        hasBeenTranspiled = true;
    };

    document.getElementById('play-button').onclick = function () {
        if (hasBeenTranspiled) {
            document.getElementById('output').innerHTML = outputExample;
        }
    };

})(CoolToJSDemo || (CoolToJSDemo = {}));