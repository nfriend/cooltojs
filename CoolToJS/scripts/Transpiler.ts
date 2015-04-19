﻿module CoolToJS {

    export interface TranspilerOptions {
        coolProgramSources: string|string[];
        outputFunction?: (output: string) => void;
    }

    export function Transpile(transpilerOptions: TranspilerOptions) {
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

        outputFunction('Testing output function.');

        var lexicalAnalyzer = new LexicalAnalyzer();
        //lexicalAnalyzer.Analyze(concatenatedCoolProgram);
        var testString = '987 else if case esac sdHU9 \
        \
        sd33_4 ';
        lexicalAnalyzer.Analyze(testString);
    }
}