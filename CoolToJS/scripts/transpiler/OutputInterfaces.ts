module CoolToJS {

    export interface SourceLocation {
        line: number;
        column: number;
        length: number;
    }

    export interface ErrorMessage {
        message: string;
        location: SourceLocation;
    }

    export interface TranspilerOutput {
        success: boolean;
        generatedJavaScript?: string;
        errorMessages?: Array<ErrorMessage>;
    }

    export interface LexicalAnalyzerOutput {
        success: boolean;
        tokens?: Token[];
        errorMessages?: Array<ErrorMessage>;
    }

    export interface ParserOutput {
        success: boolean;
        syntaxTree?: SyntaxTree;
        errorMessages?: Array<ErrorMessage>;
    }
}