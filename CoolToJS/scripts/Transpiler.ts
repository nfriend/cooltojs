module CoolToJS {

    export interface TranspilerOptions {
        coolProgramSources: string|string[];
        outputFunction?: (output: string) => void;
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
function __outputFunction(output) {\n\
    document.getElementById(\'output\').innerHTML += output;\n\
}\n\
\n\
__outputFunction("Hello, world.\\n");\
';

    export function Transpile(transpilerOptions: TranspilerOptions): TranspilerOutput {
        var coolProgramSources: string|string[] = transpilerOptions.coolProgramSources;
        if (typeof coolProgramSources === 'string') {
            var concatenatedCoolProgram = coolProgramSources;
        } else {
            var concatenatedCoolProgram = coolProgramSources.join('\n');
        }

        if (transpilerOptions.outputFunction) {
            var outputFunction = transpilerOptions.outputFunction;
        } else {
            var outputFunction = (output: string) => {
                console.log(output);
            };
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