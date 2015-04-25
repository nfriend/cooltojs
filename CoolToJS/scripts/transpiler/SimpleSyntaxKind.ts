module CoolToJS.DontCompile {
    export enum SyntaxKind {
        EndOfInput = 0,
        OpenParenthesis = 1,
        ClosedParenthesis = 2,
        MultiplicationOperator = 3,
        AdditionOperator = 4,
        Integer = 5,
        E = 6,
        WhiteSpace = 100,
        CarriageReturn = 101,
        NewLine = 102,
        Tab = 103,

        // not used in this grammar - only added here so we can compile
        String = 1000,
        Comment = 1001
    }

    export var StartSyntaxKind: SyntaxKind = SyntaxKind.E;

    export interface TokenDefinition {
        token: SyntaxKind;
        regex?: RegExp;
        matchFunction?: (input: string) => string;
    }

    // order signifies priority (keywords are listed first)
    export var TokenLookup: TokenDefinition[] = [
        {
            token: SyntaxKind.Integer,
            regex: /^([0-9]+)\b/,
        },
        {
            token: SyntaxKind.MultiplicationOperator,
            regex: /^(\*)/
        },
        {
            token: SyntaxKind.AdditionOperator,
            regex: /^(\+)/
        },
        {
            token: SyntaxKind.OpenParenthesis,
            regex: /^(\()/
        },
        {
            token: SyntaxKind.ClosedParenthesis,
            regex: /^(\))/
        },
        {
            token: SyntaxKind.WhiteSpace,
            regex: /^( +)/,
        },
        {
            token: SyntaxKind.CarriageReturn,
            regex: /^(\r)/,
        },
        {
            token: SyntaxKind.NewLine,
            regex: /^(\n)/,
        },
        {
            token: SyntaxKind.Tab,
            regex: /^(\t)/,
        },
    ];

    export function isKeyword(tokenType: SyntaxKind) {
        return false;
    }
}