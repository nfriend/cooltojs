var CoolToJSDemo;
(function (CoolToJSDemo) {
    'use strict';

    //#region set up editors and the console
    var coolEditor = CodeMirror(document.getElementById('cool-editor'), {
        value: CoolToJSDemo.CoolProgramSources[9].source,
        mode: 'cool',
        lineNumbers: true,
        indentUnit: 4,
        extraKeys: {
            'Ctrl-Enter': transpile,
            'F5': transpile
        }
    });

    function addUnderlineToCoolEditor(line, column, length) {

        length = typeof length === 'undefined' ? 1 : length;

        var nbspString = '',
            nbsp = '&nbsp';
        for (var i = 0; i < length; i++) {
            nbspString += nbsp;
        }

        var elementToAdd = $('<div class="red-squiggly-underline">' + nbspString + '</div>')[0];
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

    coolEditor.on('change', removeAllUnderlinesFromCoolEditor);

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

        if (transpilerOutput.success) {
            generatedJavaScriptEditor.setValue(transpilerOutput.generatedJavaScript);
        } else {

            // display the error messages as comments in the JavaScript editor 
            if (transpilerOutput.errorMessages) {
                var errorComments = '/*\n\nThe following errors occured while transpiling:\n\n';
                for (var i = 0; i < transpilerOutput.errorMessages.length; i++) {
                    errorComments += '• ' + transpilerOutput.errorMessages[i].message + '\n';

                    // underline the error in the Cool editor
                    addUnderlineToCoolEditor(transpilerOutput.errorMessages[i].location.line - 1,
                                             transpilerOutput.errorMessages[i].location.column - 1,
                                             transpilerOutput.errorMessages[i].location.length);
                }
                errorComments += '\n*/';
            } else {
                var errorComments = '/* An unknown error occured while transpiling */';
            }

            generatedJavaScriptEditor.setValue(errorComments);
        }
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
        options += '<option '
            + (currentSource.selected ? 'selected' : '')
            + ' value="' + i + '">'
            + currentSource.filename
            + '</option>';
    }

    $('#source-dropdown').append(options).change(function () {
        coolEditor.setValue(CoolToJSDemo.CoolProgramSources[$('#source-dropdown option:selected').val()].source);
    });

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