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

    export interface WarningMessage {
        message: string;
        location: SourceLocation;
    }

    export interface TranspilerOutput {
        success: boolean;
        generatedJavaScript?: string;
        errorMessages?: Array<ErrorMessage>;
        warningMessages?: Array<WarningMessage>;
        elapsedTime: number;
    }

    export interface LexicalAnalyzerOutput {
        success: boolean;
        tokens?: Token[];
        errorMessages?: Array<ErrorMessage>;
        warningMessages?: Array<WarningMessage>;
    }

    export interface ParserOutput {
        success: boolean;
        syntaxTree?: SyntaxTree;
        errorMessages?: Array<ErrorMessage>;
        warningMessages?: Array<WarningMessage>;
    }

    export interface ASTConverterOutput {
        success: boolean;
        abstractSyntaxTree: Node;
        errorMessages?: Array<ErrorMessage>;
        warningMessages?: Array<WarningMessage>;
    }

    export interface SemanticAnalyzerOutput {
        success: boolean;
        abstractSyntaxTree: Node;
        errorMessages?: Array<ErrorMessage>;
        warningMessages?: Array<WarningMessage>;
    }

    export interface JavaScriptGeneratorOutput {
        success: boolean;
        errorMessages?: Array<ErrorMessage>;
        warningMessages?: Array<WarningMessage>;
        generatedJavaScript: string;
    }
}