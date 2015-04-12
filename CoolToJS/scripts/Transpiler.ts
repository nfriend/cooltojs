module CoolToJS {
    export function Transpile(coolProgramSources: string|string[]) {
        var concatenatedCoolProgram  = typeof coolProgramSources === 'string' ? coolProgramSources : coolProgramSources.join('\n');

        var lexicalAnalyzer = new LexicalAnalyzer();
        lexicalAnalyzer.Analyze(concatenatedCoolProgram);
    }
}