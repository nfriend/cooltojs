var CoolToJSDemo;
(function (CoolToJSDemo) {
    'use strict';

    var isDebug = document.location.hostname === "localhost",
        programIndexToUse = 6,
        coolSourceCookieKey = 'cool-source',
        liveErrorChecking = !isDebug;

    // remove the splash screen;
    $('.cooltojs-content').css('display', '');
    $('#loading').css('display', 'none');

    $('[data-toggle="tooltip"]').tooltip();

    //#region set up editors and the console

    var $transpileButton = $('#transpile-button');
    var coolEditor = CodeMirror(document.getElementById('cool-editor'), {
        value: (function () {
            var cookieCoolSource = $.cookie(coolSourceCookieKey);
            if (cookieCoolSource) {
                return cookieCoolSource;
            } else {
                return (CoolToJSDemo.CoolProgramSources.filter(function (x) { return !x.localOnly || isDebug; }))[programIndexToUse].source;
            }
        })(),
        mode: 'cool',
        lineNumbers: true,
        indentUnit: 4,
        matchBrackets: true,
        autoCloseBrackets: '(){}',
        extraKeys: {
            'Ctrl-Enter': function () { $transpileButton.click() },
            'F5': function () { $transpileButton.click() },
            'F6': function () { $transpileButton.click() }
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

        setTimeout(function () {
            $('.tooltip-token-' + textMarkerUniqueId).tooltip({
                title: message,
                container: 'body',
                delay: { 'show': 500, 'hide': '100' },
                animation: false
            })
            textMarkerUniqueId++;
        }, 0)
    }

    var underlineElements = [];
    var textMarkers = [];
    var textMarkerUniqueId = 0;
    function removeAllErrorVisualsFromCoolEditor() {
        underlineElements.forEach(function (ue) {
            $(ue).remove();
        });
        underlineElements.length = 0;

        // apparently these DOM elements get replaced when the 
        // text is changed, so no need to clear them manually
        //textMarkers.forEach(function (tm, index) {
        //    tm.clear();
        //});
        //textMarkers.length = 0;
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
        errorCheckerTimerDuration = 200,
        cookieWriterTimer,
        cookieWriterTimerDuration = 500;
    coolEditor.on('change', function () {
        removeAllErrorVisualsFromCoolEditor();

        if (liveErrorChecking) {
            if (errorCheckerTimer) {
                clearTimeout(errorCheckerTimer);
            }
            errorCheckerTimer = setTimeout(function () {
                checkForErrors();
                errorCheckerTimer = null;
            }, errorCheckerTimerDuration);
        }

        if (cookieWriterTimer) {
            clearTimeout(cookieWriterTimer);
        }
        cookieWriterTimer = setTimeout(function () {
            $.cookie(coolSourceCookieKey, coolEditor.getValue(), { expires: 31, path: '/' });
            cookieWriterTimer = null;
        }, cookieWriterTimerDuration);
    });

    var generatedEs6JavaScriptEditor = CodeMirror(document.getElementById('generated-es6-javascript'), {
        mode: 'javascript',
        lineNumbers: true,
        indentUnit: 4,
        matchBrackets: true,
        readOnly: !isDebug,
        extraKeys: (isDebug ? {
            'Ctrl-Enter': convertES6toES5,
            'F5': convertES6toES5,
            'F6': convertES6toES5,
        } : {})
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
                if (window.inputGenerator) {

                    // we want any output that results from this callback
                    // to appear *after* the entered text, so schedule
                    // it after this function returns
                    setTimeout(function () {
                        try {
                            window.inputGenerator.next(line);
                        } catch(data) {
                            window.consoleController.report([{
                                msg: data,
                                className: "jquery-console-error"
                            }]);
                            throw data;
                        }
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
        window.out_stringBuffer = (window.out_stringBuffer || '') + output;
        if (/\n\s*$/.test(window.out_stringBuffer)) {
            window.consoleController.report([{
                msg: window.out_stringBuffer,
                className: "jquery-console-output"
            }]);
            window.out_stringBuffer = '';
        }
    };

    var out_int = out_string;

    var isInputRestrictedToNumbers = false;

    var in_string = function (generator) {
        if (window.out_stringBuffer && window.out_stringBuffer.length > 0) {
            window.consoleController.report([{
                msg: window.out_stringBuffer,
                className: "jquery-console-output"
            }]);
            window.out_stringBuffer = '';
        }
        isInputRestrictedToNumbers = false;
        window.inputGenerator = generator;
    };

    var in_int = function (generator) {
        if (window.out_stringBuffer && window.out_stringBuffer.length > 0) {
            window.consoleController.report([{
                msg: window.out_stringBuffer,
                className: "jquery-console-output"
            }]);
            window.out_stringBuffer = '';
        }
        isInputRestrictedToNumbers = true;
        window.inputGenerator = generator;
    };

    // the function that will actually be called when input is entered.
    // global so as to be available to the Cool program
    window.inputFunction = null;

    //#endregion

    $('#transpile-button').click(function () {
        transpile();
    });

    function transpile(andRun) {
        removeAllErrorVisualsFromCoolEditor();

        var transpilerOutput = CoolToJS.Transpile({
            coolProgramSources: coolEditor.getValue(),
            out_string: out_string,
            out_int: out_int,
            in_string: in_string,
            in_int: in_int
        });

        // display the error messages as comments in the JavaScript editor 
        if (transpilerOutput.errorMessages && transpilerOutput.errorMessages.length > 0) {
            transpilerOutput.errorMessages.forEach(function (em) {
                window.consoleController.report([{
                    msg: (em.location ? '(' + em.location.line + ':' + em.location.column + ') ' : '') + em.message,
                    className: 'jquery-console-error'
                }]);

                // underline the error in the Cool editor
                if (em.location) {
                    addErrorVisualsToCoolEditor(em.location.line - 1,
                                                em.location.column - 1,
                                                em.location.length,
                                                em.message);
                }
            });
        }

        if (transpilerOutput.success) {
            generatedEs6JavaScriptEditor.setValue(transpilerOutput.generatedJavaScript);
            convertES6toES5();
            if (andRun) {
                run();
            }
        }
    }

    function convertES6toES5() {
        try {
            var es5Code = babel.transform(generatedEs6JavaScriptEditor.getValue(), {
                stage: 0
            }).code;
            if (es5Code) {
                es5Code = "/* ES6 to ES5 conversion by Babel: http://babeljs.io */\n" + es5Code;
            }
            generatedEs5JavaScriptEditor.setValue(es5Code);
            window.consoleController.report([{
                msg: 'Transpilation successful!',
                className: 'jquery-console-success'
            }]);
            return true;
        } catch (e) {
            window.consoleController.report([{
                msg: 'ES6 to ES5 conversion error:',
                className: 'jquery-console-error'
            }, {
                msg: e,
                className: 'jquery-console-error'
            }]);
            return false;
        }
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
        $transpileButton = $('#transpile-button'),
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
                $transpileButton.off('click').click(function () {
                    transpile(true);
                });
                $transpileButtonText.html(' Transpile and Run');
            } else {
                $transpileButton.off('click').click(function () {
                    transpile();
                });
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
    var localOnlySource = CoolToJSDemo.CoolProgramSources.filter(function (x) { return !x.localOnly || isDebug; });
    for (var i = 0; i < localOnlySource.length; i++) {
        var currentSource = localOnlySource[i];
        options += '<option value="' + i + '">'
            + currentSource.filename
            + '</option>';
    }

    // select the appropriate source to start
    $('#source-dropdown').append(options).change(function () {
        coolEditor.setValue(localOnlySource[$('#source-dropdown option:selected').val()].source);
    });

    $('#source-dropdown option:eq(' + programIndexToUse + ')').attr('selected', 'selected');

    // when the window is resized, set the heights of the various 
    // editors/consoles to take the height of one page, so that scrolling
    // to the bottom allows for full-screen editing
    window.onresize = function () {
        var $window = $(window);
        if ($window.innerWidth() > 991) {
            $('.CodeMirror, div.console div.jquery-console-inner').css({
                height: $window.height() - 111 + 'px'
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

    window.consoleController.report([{
        // non-breaking dash: ‑
        msg: 'Welcome to CoolToJS!',
        className: 'jquery-console-output'
    }]);
    window.consoleController.report([{
        // non-breaking dash: ‑
        msg: 'Please note that this project is very much a work-in-progress',
        className: 'jquery-console-info'
    }]);

    window.onresize();
    coolEditor.refresh();
    generatedEs6JavaScriptEditor.refresh();
    generatedEs5JavaScriptEditor.refresh();

})(CoolToJSDemo || (CoolToJSDemo = {}));