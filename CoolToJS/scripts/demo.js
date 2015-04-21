var CoolToJSDemo;
(function (CoolToJSDemo) {
    'use strict';

    //#region set up editors and the console
    var coolEditor = CodeMirror(document.getElementById('cool-editor'), {
        value: CoolToJS.CoolProgramSources.AdvancedHelloWorld,
        mode: 'cool',
        lineNumbers: true,
        indentUnit: 4,
    });

    var generatedJavaScriptEditor = CodeMirror(document.getElementById('generated-javascript'), {
        mode: 'javascript',
        lineNumbers: true,
        indentUnit: 4,
        readOnly: true
    });

    // global so we can access it inside a Cool program
    window.consoleController = $('.console').console({
        promptLabel: '> ',
        commandValidate: function (line) {
            return !(line === '');
        },
        commandHandle: function (line) {
            if (isInputRestrictedToNumbers && !/^\d*$/.test(line)) {
                return [{
                    msg: 'Invalid input: Please enter an integer',
                    className: "jquery-console-error"
                }];
            } else {
                if (window.inputFunction) {

                    // we want any output that results from this callback
                    // to appear *after* the entered text, so schedule
                    // it after this function returns
                    setTimeout(function () {
                        window.inputFunction(line);
                        window.inputFunction = null;
                    }, 0)

                    return [{
                        msg: '',
                        className: "jquery-console-user-input"
                    }];
                }

                if (/^\s*clear\s*$/i.test(line) || /^\s*cls\s*$/i.test(line)) {
                    window.consoleController.reset();
                }

                return [{
                    msg: '',
                    className: "jquery-console-user-input"
                }];
            }
        },
        autofocus: false,
        animateScroll: true,
        promptHistory: true,
        charInsertTrigger: function (keycode, line) {
            // no restrictions on what can be entered into the console
            return true;
        }
    });
    //#endregion

    //#region IO methods
    var out_string = function (output) {
        window.consoleController.report([{
            msg: output,
            className: "jquery-console-output"
        }]);
    };

    var out_int = out_string;

    var isInputRestrictedToNumbers = false;

    var in_string = function (onInput) {
        isInputRestrictedToNumbers = false;
        window.inputFunction = onInput;
    };

    var in_int = function (onInput) {
        isInputRestrictedToNumbers = true;
        window.inputFunction = onInput;
    };

    // the function that will actually be called when input is entered.
    // global so as to be available to the Cool program
    window.inputFunction = null;

    //#endregion

    document.getElementById('transpile-button').onclick = function () {

        var transpilerOutput = CoolToJS.Transpile({
            coolProgramSources: coolEditor.getValue(),
            out_string: out_string,
            out_int: out_int,
            in_string: in_string,
            in_int: in_int
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
        $('.console').click();
        try {
            eval(generatedJavaScriptEditor.getValue());
        } catch (data) {
            window.consoleController.report([{
                msg: data,
                className: "jquery-console-error"
            }]);
            throw data;
        }
    };

    document.getElementById('clear-button').onclick = function () {
        window.consoleController.reset();
    };

    // when the window is resized, set the heights of the various 
    // editors/consoles to take the height of one page, so that scrolling
    // to the bottom allows for full-screen editing
    window.onresize = function () {
        var $window = $(window);
        if ($window.innerWidth() > 991) {
            $('.CodeMirror, div.console div.jquery-console-inner').css({
                height: $window.height() - 85 + 'px'
            });
        } else {
            $('.CodeMirror, div.console div.jquery-console-inner').css({
                height: '400px'
            });
        }
    }

    window.onresize();
    coolEditor.refresh();
    generatedJavaScriptEditor.refresh();

})(CoolToJSDemo || (CoolToJSDemo = {}));