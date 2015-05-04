module CoolToJS {

    export interface TranspilerOptions {
        coolProgramSources: string|string[];
        out_string?: (output: string) => void;
        out_int?: (output: number) => void;
        in_string?: (onInput: (input: string) => any) => void;
        in_int?: (onInput: (input: string) => any) => void;
    }

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

    export function Transpile(transpilerOptions: TranspilerOptions): TranspilerOutput {
        var startTime = Date.now();
        var coolProgramSources: string|string[] = transpilerOptions.coolProgramSources;
        if (typeof coolProgramSources === 'string') {
            var concatenatedCoolProgram = coolProgramSources;
        } else {
            var concatenatedCoolProgram = coolProgramSources.join('\n');
        }

        if (transpilerOptions.out_string) {
            var out_string = transpilerOptions.out_string;
        } else {
            var out_string = (output: string) => {
                console.log(output);
            };
        }

        if (transpilerOptions.out_int) {
            var out_int = transpilerOptions.out_int;
        } else {
            var out_int = (output: number) => {
                console.log(output);
            };
        }

        if (transpilerOptions.in_string) {
            var in_string = transpilerOptions.in_string;
        } else {
            var in_string = (onInput: (input: string) => any) => { /* noop */ };
        }

        if (transpilerOptions.in_int) {
            var in_int = transpilerOptions.in_int;
        } else {
            var in_int = (onInput: (input: string) => any) => { /* noop */ };
        }

        var lexicalAnalyzer = new LexicalAnalyzer();
        var lexicalAnalyzerOutput = lexicalAnalyzer.Analyze(concatenatedCoolProgram);

        if (!lexicalAnalyzerOutput.success) {
            return {
                success: false,
                errorMessages: lexicalAnalyzerOutput.errorMessages,
                elapsedTime: Date.now() - startTime
            };
        }

        var parser = new Parser();
        var parserOutput = parser.Parse(lexicalAnalyzerOutput);

        if (!parserOutput.success) {
            return {
                success: false,
                errorMessages: parserOutput.errorMessages,
                warningMessages: parserOutput.warningMessages,
                elapsedTime: Date.now() - startTime
            };
        }

        var astConverter = new AbstractSyntaxTreeConverter();
        var astConvertOutput = astConverter.Convert(parserOutput);

        var semanticAnalyzer = new SemanticAnalyzer();
        var semanticAnalyzerOutput = semanticAnalyzer.Analyze(astConvertOutput);

        if (!semanticAnalyzerOutput.success) {
            return {
                success: false,
                errorMessages: semanticAnalyzerOutput.errorMessages,
                warningMessages: semanticAnalyzerOutput.warningMessages,
                elapsedTime: Date.now() - startTime
            };
        }

        var codeGenerator = new JavaScriptGenerator();
        var codeGeneratorOutput = codeGenerator.Generate(semanticAnalyzerOutput, {
            in_int: in_int,
            in_string: in_string,
            out_int: out_int,
            out_string: out_string
        });

        return {
            success: true,
            errorMessages: codeGeneratorOutput.errorMessages,
            warningMessages: codeGeneratorOutput.warningMessages,
            generatedJavaScript: codeGeneratorOutput.generatedJavaScript,
            elapsedTime: Date.now() - startTime
        };
    }
}