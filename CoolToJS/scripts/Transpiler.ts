module CoolToJS {

    export interface TranspilerOptions {
        coolProgramSources: string|string[];
        out_string?: (output: string) => void;
        out_int?: (output: number) => void;
        in_string?: (onInput: (input: string) => any) => void;
        in_int?: (onInput: (input: string) => any) => void;
    }

    export interface TranspilerOutput {
        success: boolean;
        generatedJavaScript?: string;
        errorMessages?: string[];
    }

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

    export function Transpile(transpilerOptions: TranspilerOptions): TranspilerOutput {
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
                errorMessages: lexicalAnalyzerOutput.errorMessages
            }
        }

        return {
            success: true,
            generatedJavaScript: generatedJavaScriptExample
        };
    }
}