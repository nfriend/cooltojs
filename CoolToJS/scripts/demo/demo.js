var CoolToJSDemo;
(function (CoolToJSDemo) {
    'use strict';

    var isDebug = document.location.hostname === "localhost",
        programIndexToUse = 9,
        liveErrorChecking = !isDebug;

    // remove the splash screen;
    $('.cooltojs-content').css('display', '');
    $('#loading').css('display', 'none');

    $('[data-toggle="tooltip"]').tooltip();

    //#region set up editors and the console
    var coolEditor = CodeMirror(document.getElementById('cool-editor'), {
        value: CoolToJSDemo.CoolProgramSources[programIndexToUse].source,
        mode: 'cool',
        lineNumbers: true,
        indentUnit: 4,
        matchBrackets: true,
        autoCloseBrackets: '(){}',
        extraKeys: {
            'Ctrl-Enter': transpile,
            'F5': transpile
        }
    });

    function addErrorVisualsToCoolEditor(line, column, length, message, errorLevel) {

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

        textMarkers.push(coolEditor.markText({
            line: line,
            ch: column
        }, {
            line: line,
            ch: column + length
        }, {
            className: 'tooltip-token-' + textMarkerUniqueId
        }));

        $('.tooltip-token-' + textMarkerUniqueId).tooltip({
            title: message,
            container: 'body',
            delay: { 'show': 500, 'hide': '100' },
            animation: false
        })
        textMarkerUniqueId++;
    }

    var underlineElements = [];
    var textMarkers = [];
    var textMarkerUniqueId = 0;
    function removeAllErrorVisualsFromCoolEditor() {
        for (var i = 0; i < underlineElements.length; i++) {
            $(underlineElements[i]).remove();
        }
        underlineElements.length = 0;

        textMarkers.forEach(function (tm, index) {
            textMarkers[index].clear();
        });
        textMarkers.length = 0;
    }

    function checkForErrors() {
        var transpilerOutput = CoolToJS.Transpile({
            coolProgramSources: coolEditor.getValue()
        });

        if (transpilerOutput.errorMessages && transpilerOutput.errorMessages.length > 0) {
            for (var i = 0; i < transpilerOutput.errorMessages.length; i++) {
                addErrorVisualsToCoolEditor(transpilerOutput.errorMessages[i].location.line - 1,
                                         transpilerOutput.errorMessages[i].location.column - 1,
                                         transpilerOutput.errorMessages[i].location.length,
                                         transpilerOutput.errorMessages[i].message);
            }
        }

        if (transpilerOutput.warningMessages && transpilerOutput.warningMessages.length > 0) {
            for (var i = 0; i < transpilerOutput.warningMessages.length; i++) {
                addErrorVisualsToCoolEditor(transpilerOutput.warningMessages[i].location.line - 1,
                                         transpilerOutput.warningMessages[i].location.column - 1,
                                         transpilerOutput.warningMessages[i].location.length,
                                         transpilerOutput.warningMessages[i].message,
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
        removeAllErrorVisualsFromCoolEditor();

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

    var generatedEs6JavaScriptEditor = CodeMirror(document.getElementById('generated-es6-javascript'), {
        mode: 'javascript',
        lineNumbers: true,
        indentUnit: 4,
        matchBrackets: true,
        readOnly: !isDebug
    });

    var generatedEs5JavaScriptEditor = CodeMirror(document.getElementById('generated-es5-javascript'), {
        mode: 'javascript',
        lineNumbers: true,
        indentUnit: 4,
        matchBrackets: true,
        readOnly: !isDebug
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
                        if (window.inputFunction.next) {
                            window.inputFunction.next(line);
                        } else {
                            window.inputFunction(line);
                        }
                        
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
        removeAllErrorVisualsFromCoolEditor();

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
            editorOutput += '/*\n\nThe following errors occured while transpiling:\n\n';
            for (var i = 0; i < transpilerOutput.errorMessages.length; i++) {
                editorOutput += '• ';
                if (transpilerOutput.errorMessages[i].location) {
                    editorOutput += 'Line ' + transpilerOutput.errorMessages[i].location.line + ', '
                    + 'column ' + transpilerOutput.errorMessages[i].location.column + ':\t';
                }
                editorOutput += transpilerOutput.errorMessages[i].message + '\n';

                // underline the error in the Cool editor
                if (transpilerOutput.errorMessages[i].location) {
                    addErrorVisualsToCoolEditor(transpilerOutput.errorMessages[i].location.line - 1,
                                             transpilerOutput.errorMessages[i].location.column - 1,
                                             transpilerOutput.errorMessages[i].location.length,
                                             transpilerOutput.errorMessages[i].message);
                }
            }
            editorOutput += '\n*/\n\n';
        }

        if (transpilerOutput.success) {
            editorOutput += transpilerOutput.generatedJavaScript;

            try {
                var es5Code = babel.transform(transpilerOutput.generatedJavaScript, {
                    stage: 0
                }).code;
                generatedEs5JavaScriptEditor.setValue(es5Code);
            } catch (e) {
                generatedEs5JavaScriptEditor.setValue('/*\n\nES6 to ES5 conversion error:\n\n ' + e + '\n\n*/');
            }
        }

        generatedEs6JavaScriptEditor.setValue(editorOutput);
    }

    $('#es6-play-button, #es5-play-button').click(run);

    function run() {
        $('.console').click();
        try {
            eval(generatedEs5JavaScriptEditor.getValue());
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

    var $coolEditorOption = $('#cool-editor-option'),
        $es6Option = $('#es6-option'),
        $es5Option = $('#es5-option'),
        $consoleOption = $('#console-option'),
        $es5RunButton = $('#es5-play-button'),
        $es6RunButton = $('#es6-play-button'),
        $transpileButtonText = $('#transpile-button-text');
    $('.view-options-container input').change(function () {
        var viewsToShow = [];
        if ($coolEditorOption.is(':checked')) {
            viewsToShow.push('.editor-container.' + $coolEditorOption.attr('editor'));
        }
        if ($es6Option.is(':checked')) {
            viewsToShow.push('.editor-container.' + $es6Option.attr('editor'));
        }
        if ($es5Option.is(':checked')) {
            viewsToShow.push('.editor-container.' + $es5Option.attr('editor'));
        }
        if ($consoleOption.is(':checked')) {
            viewsToShow.push('.editor-container.' + $consoleOption.attr('editor'));
        }

        if ($es6Option.is(':checked') && $es5Option.is(':checked')) {
            $es5RunButton.css('display', '');
            $es6RunButton.css('display', 'none');
            $transpileButtonText.html(' Transpile');
        } else {
            if (!$es6Option.is(':checked') && !$es5Option.is(':checked')) {
                $transpileButtonText.html(' Transpile and Run');
            } else {
                $transpileButtonText.html(' Transpile');
            }

            $($es5RunButton).add($es6RunButton).css('display', '');
        }

        switch (viewsToShow.length) {
            case 0:
                return;
            case 1:
                var classToAdd = 'col-md-12';
                break;
            case 2:
                var classToAdd = 'col-md-6';
                break;
            case 3:
                var classToAdd = 'col-md-4';
                break;
            case 4:
                var classToAdd = 'col-md-3';
                break;
        }
        var $editorContainer = $('.editor-container');
        $editorContainer.removeClass('col-md-3 col-md-4 col-md-6 col-md-12');
        $editorContainer.not(viewsToShow.join(', ')).css('display', 'none');
        $(viewsToShow.join(', ')).addClass(classToAdd).css('display', '');

        generatedEs6JavaScriptEditor.refresh();
        generatedEs5JavaScriptEditor.refresh();

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
                if (isDebug) {
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
    generatedEs6JavaScriptEditor.refresh();
    generatedEs5JavaScriptEditor.refresh();

})(CoolToJSDemo || (CoolToJSDemo = {}));