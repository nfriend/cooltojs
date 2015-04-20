var CoolToJSDemo;
(function (CoolToJSDemo) {
    'use strict';

    var coolEditor = CodeMirror(document.getElementById('cool-editor'), {
        value: CoolToJS.CoolProgramSources.HelloWorld,
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

    document.getElementById('transpile-button').onclick = function () {

        var transpilerOutput = CoolToJS.Transpile({
            coolProgramSources: coolEditor.getValue(),
            outputFunction: function (output) {
                document.getElementById('output').innerHTML += output;
            }
        });

        if (transpilerOutput.success) {
            generatedJavaScriptEditor.setValue(transpilerOutput.generatedJavaScript);
        } else {
            if (transpilerOutput.errorMessages) {
                var errorComments = '/*\n\nThe following errors occured while transpiling:\n\n';
                for (var i = 0; i < transpilerOutput.errorMessages.length; i++) {
                    errorComments += '• ' + transpilerOutput.errorMessages[i] + '\n';
                }
                errorComments += '\n*/';
            } else {
                var errorComments = '/* An unknown error occured while transpiling */';
            }

            generatedJavaScriptEditor.setValue(errorComments);
        }
    };

    document.getElementById('play-button').onclick = function () {
        var outputElement = document.getElementById('output');
        outputElement.innerHTML = '';
        try {
            eval(generatedJavaScriptEditor.getValue());
            outputElement.className = outputElement.className.replace(/error-state/g, '');
        } catch (data) {
            outputElement.className += ' error-state';
            outputElement.innerHTML = 'JavaScript runtime error: \n\n' + data;
            throw data;
        }
    };

})(CoolToJSDemo || (CoolToJSDemo = {}));