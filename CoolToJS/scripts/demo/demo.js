var CoolToJSDemo;
(function (CoolToJSDemo) {
    'use strict';

    // TODO: clean this up.  This is getting a little unruly.

    var programIndexToUse = 8,
        liveErrorChecking = true;

    $('[data-toggle="tooltip"]').tooltip();

    //#region set up editors and the console
    var coolEditor = CodeMirror(document.getElementById('cool-editor'), {
        value: CoolToJSDemo.CoolProgramSources[programIndexToUse].source,
        mode: 'cool',
        lineNumbers: true,
        indentUnit: 4,
        extraKeys: {
            'Ctrl-Enter': transpile,
            'F5': transpile
        }
    });

    function addUnderlineToCoolEditor(line, column, length, errorLevel) {

        errorLevel = errorLevel || 'error';

        length = typeof length === 'undefined' ? 1 : length;

        var nbspString = '',
            nbsp = '&nbsp';
        for (var i = 0; i < length; i++) {
            nbspString += nbsp;
        }

        if (errorLevel === 'error') {
            var elementToAdd = $('<div class="squiggly-underline red-squiggly-underline">' + nbspString + '</div>')[0];
        } else if (errorLevel === 'warning') {
            var elementToAdd = $('<div class="squiggly-underline green-squiggly-underline">' + nbspString + '</div>')[0];
        }
        coolEditor.addWidget({
            line: line,
            ch: column
        }, elementToAdd, false);
        underlineElements.push(elementToAdd);
    }

    var underlineElements = [];
    function removeAllUnderlinesFromCoolEditor() {
        for (var i = 0; i < underlineElements.length; i++) {
            $(underlineElements[i]).remove();
        }
        underlineElements.length = 0;
    }

    function checkForErrors() {
        var transpilerOutput = CoolToJS.Transpile({
            coolProgramSources: coolEditor.getValue()
        });

        if (transpilerOutput.errorMessages && transpilerOutput.errorMessages.length > 0) {
            for (var i = 0; i < transpilerOutput.errorMessages.length; i++) {
                addUnderlineToCoolEditor(transpilerOutput.errorMessages[i].location.line - 1,
                                         transpilerOutput.errorMessages[i].location.column - 1,
                                         transpilerOutput.errorMessages[i].location.length);
            }
        }

        if (transpilerOutput.warningMessages && transpilerOutput.warningMessages.length > 0) {
            for (var i = 0; i < transpilerOutput.warningMessages.length; i++) {
                addUnderlineToCoolEditor(transpilerOutput.warningMessages[i].location.line - 1,
                                         transpilerOutput.warningMessages[i].location.column - 1,
                                         transpilerOutput.warningMessages[i].location.length,
                                         'warning');
            }
        }

        // throttle or turn off live checking if compile times are taking a while
        if (transpilerOutput.elapsedTime > 100) {
            errorCheckerTimerDuration = 1000;
        } else if (transpilerOutput.elapsedTime > 500) {
            liveErrorChecking = false;
        }
    }

    var errorCheckerTimer,
        errorCheckerTimerDuration = 200;
    coolEditor.on('change', function () {
        removeAllUnderlinesFromCoolEditor();

        if (liveErrorChecking) {
            if (!errorCheckerTimer) {
                errorCheckerTimer = setTimeout(function () {
                    checkForErrors();
                    errorCheckerTimer = null;
                }, errorCheckerTimerDuration);
            } else {
                clearTimeout(errorCheckerTimer);
                errorCheckerTimer = setTimeout(function () {
                    checkForErrors();
                    errorCheckerTimer = null;
                }, errorCheckerTimerDuration);
            }
        }
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

    $('#transpile-button').click(transpile);

    function transpile() {
        removeAllUnderlinesFromCoolEditor();

        var transpilerOutput = CoolToJS.Transpile({
            coolProgramSources: coolEditor.getValue(),
            out_string: out_string,
            out_int: out_int,
            in_string: in_string,
            in_int: in_int
        });

        var editorOutput = ''

        // display the error messages as comments in the JavaScript editor 
        if (transpilerOutput.errorMessages && transpilerOutput.errorMessages.length > 0) {
            var editorOutput = '/*\n\nThe following errors occured while transpiling:\n\n';
            for (var i = 0; i < transpilerOutput.errorMessages.length; i++) {
                editorOutput += '• ' + transpilerOutput.errorMessages[i].message + '\n';

                // underline the error in the Cool editor
                addUnderlineToCoolEditor(transpilerOutput.errorMessages[i].location.line - 1,
                                         transpilerOutput.errorMessages[i].location.column - 1,
                                         transpilerOutput.errorMessages[i].location.length);
            }
            editorOutput += '\n*/\n\n';
        }

        // display the transpiler warnings as comments in the JavaScript editor 
        if (transpilerOutput.warningMessages && transpilerOutput.warningMessages.length > 0) {
            var editorOutput = '/*\n\nThe following warnings occured while transpiling:\n\n';
            for (var i = 0; i < transpilerOutput.warningMessages.length; i++) {
                editorOutput += '• ' + transpilerOutput.warningMessages[i].message + '\n';

                // underline the error in the Cool editor
                addUnderlineToCoolEditor(transpilerOutput.warningMessages[i].location.line - 1,
                                         transpilerOutput.warningMessages[i].location.column - 1,
                                         transpilerOutput.warningMessages[i].location.length,
                                         'warning');
            }
            editorOutput += '\n*/\n\n';
        }

        if (transpilerOutput.success) {
            editorOutput += transpilerOutput.generatedJavaScript;
        }

        generatedJavaScriptEditor.setValue(editorOutput);
    }

    $('#play-button').click(run);

    function run() {
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
    }

    $('#clear-button').click(function () {
        window.consoleController.reset();
    });


    // populate the "sources" dropdown with the example programs
    var options = '';
    for (var i = 0; i < CoolToJSDemo.CoolProgramSources.length; i++) {
        var currentSource = CoolToJSDemo.CoolProgramSources[i];
        options += '<option value="' + i + '">'
            + currentSource.filename
            + '</option>';
    }

    // select the appropriate source to start
    $('#source-dropdown').append(options).change(function () {
        coolEditor.setValue(CoolToJSDemo.CoolProgramSources[$('#source-dropdown option:selected').val()].source);
    });

    $('#source-dropdown option:eq(' + programIndexToUse + ')').attr('selected', 'selected');

    // when the window is resized, set the heights of the various 
    // editors/consoles to take the height of one page, so that scrolling
    // to the bottom allows for full-screen editing
    window.onresize = function () {
        var $window = $(window);
        if ($window.innerWidth() > 991) {
            $('.CodeMirror, div.console div.jquery-console-inner').css({
                height: $window.height() - 85 + 'px'
            });

            // i'm tired of scrolling down while developing this thing
            setTimeout(function () {
                if (document.location.hostname == "localhost") {
                    $(document).scrollTop($(document).height());
                }
            }, 0);
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