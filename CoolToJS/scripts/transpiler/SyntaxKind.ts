module CoolToJS {

    // the number values of these enums are the values used in the
    // slr(1) parse table.  Use caution when changing these values.
    export enum SyntaxKind {
        EndOfInput = 0,
        OpenParenthesis = 1,
        ClosedParenthesis = 2,
        MultiplationOperator = 3,
        AdditionOperator = 4,
        Comma = 5,
        SubtractionOperator = 6,
        DotOperator = 7,
        DivisionOperator = 8,
        Colon = 9,
        SemiColon = 10,
        LessThanOperator = 11,
        AssignmentOperator = 12,
        LessThanOrEqualsOperator = 13,
        EqualsOperator = 14,
        FatArrowOperator = 15,
        AtSignOperator = 16,

        CaseKeyword = 17,
        ClassKeyword = 18,
        ElseKeyword = 19,
        EsacKeyword = 20,
        FalseKeyword = 21,
        FiKeyword = 22,
        IfKeyword = 23,
        InKeyword = 24,
        InheritsKeyword = 25,
        Integer = 26,
        IsvoidKeyword = 27,
        LetKeyword = 28,
        LoopKeyword = 29,
        NewKeyword = 30,
        NotKeyword = 31,
        ObjectIdentifier = 32,
        OfKeyword = 33,
        PoolKeyword = 34,
        String = 35,
        ThenKeyword = 36,
        TrueKeyword = 37,
        TypeIdentifier = 38,
        WhileKeyword = 39,

        OpenCurlyBracket = 40,
        ClosedCurlyBracket = 41,
        TildeOperator = 42,

        CaseOption = 43,
        Class = 44,
        Expression = 45,
        ExpressionList = 46,
        ExpressionSeries = 47,
        Feature = 48,
        FeatureList = 49,
        Formal = 50,
        FormalList = 51,
        LocalVariableDeclarationList = 52,
        Program = 53,

        WhiteSpace = 54,
        CarriageReturn = 55,
        NewLine = 56,
        Tab = 57,
        Comment = 58,
    }

    export var StartSyntaxKind: SyntaxKind = SyntaxKind.Program;

    export interface TokenDefinition {
        token: SyntaxKind;
        regex?: RegExp;
        matchFunction?: (input: string) => string;
    }

    // order signifies priority (keywords are listed first)
    export var TokenLookup: TokenDefinition[] = [
        {
            token: SyntaxKind.ClassKeyword,
            regex: /^(class)\b/i,
        },
        {
            token: SyntaxKind.ElseKeyword,
            regex: /^(else)\b/i,
        },
        {
            token: SyntaxKind.FalseKeyword,
            regex: /^(f[aA][lL][sS][eE])\b/,
        },
        {
            token: SyntaxKind.TrueKeyword,
            regex: /^(t[rR][uU][eE])\b/,
        },
        {
            token: SyntaxKind.FiKeyword,
            regex: /^(fi)\b/i,
        },
        {
            token: SyntaxKind.IfKeyword,
            regex: /^(if)\b/i,
        },
        {
            token: SyntaxKind.InheritsKeyword,
            regex: /^(inherits)\b/i,
        },
        {
            token: SyntaxKind.IsvoidKeyword,
            regex: /^(isvoid)\b/i,
        },
        {
            token: SyntaxKind.LetKeyword,
            regex: /^(let)\b/i,
        },
        {
            token: SyntaxKind.InKeyword,
            regex: /^(in)\b/i,
        },
        {
            token: SyntaxKind.LoopKeyword,
            regex: /^(loop)\b/i,
        },
        {
            token: SyntaxKind.PoolKeyword,
            regex: /^(pool)\b/i,
        },
        {
            token: SyntaxKind.ThenKeyword,
            regex: /^(then)\b/i,
        },
        {
            token: SyntaxKind.WhileKeyword,
            regex: /^(while)\b/i,
        },
        {
            token: SyntaxKind.CaseKeyword,
            regex: /^(case)\b/i,
        },
        {
            token: SyntaxKind.EsacKeyword,
            regex: /^(esac)\b/i,
        },
        {
            token: SyntaxKind.NewKeyword,
            regex: /^(new)\b/i,
        },
        {
            token: SyntaxKind.OfKeyword,
            regex: /^(of)\b/i,
        },
        {
            token: SyntaxKind.NotKeyword,
            regex: /^(not)\b/i,
        },
        {
            token: SyntaxKind.Integer,
            regex: /^([0-9]+)\b/,
        },
        {
            token: SyntaxKind.String,
            matchFunction: (input) => {

                // for a single-line string
                var singleLineMatch = /^("(?:[^\\]|\\.)*?")/.exec(input);
                if (singleLineMatch !== null && typeof singleLineMatch[1] !== 'undefined') {
                    return singleLineMatch[1];
                }

                // for a multi-line string
                var fullMatch: string = null;
                var firstLineMatch = /^(".*\\[\s]*\n)/.exec(input);
                if (firstLineMatch !== null && typeof firstLineMatch[1] !== 'undefined') {
                    if (stringContainsUnescapedQuotes(firstLineMatch[1])) {
                        return null;
                    }

                    fullMatch = firstLineMatch[1];
                    input = input.slice(firstLineMatch[1].length);

                    var middleLineRegex = /^(.*\\[\s]*\n)/;
                    var middleLineMatch = middleLineRegex.exec(input);
                    while (middleLineMatch !== null && typeof middleLineMatch[1] !== 'undefined' && !(stringContainsUnescapedQuotes(middleLineMatch[1]))) {
                        fullMatch += middleLineMatch[1];
                        input = input.slice(middleLineMatch[1].length);
                        middleLineMatch = middleLineRegex.exec(input);
                    }

                    var lastLineMatch = /^(.*?[^\\]")/.exec(input);
                    if (lastLineMatch !== null && lastLineMatch[1] !== 'undefined') {
                        fullMatch += lastLineMatch[1];
                        return fullMatch;
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            }
        },
        {
            token: SyntaxKind.ObjectIdentifier,
            regex: /^([a-z][a-zA-Z0-9_]*)\b/,
        },
        {
            token: SyntaxKind.TypeIdentifier,
            regex: /^([A-Z][a-zA-Z0-9_]*)\b/,
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

        // currently doesn't allow nested (* ... *) comments
        {
            token: SyntaxKind.Comment,
            regex: /^((?:--.*)|(?:\(\*(?:(?!\*\))[\s\S])*\*\)))/,
        },

        {
            token: SyntaxKind.DotOperator,
            regex: /^(\.)/
        },
        {
            token: SyntaxKind.AtSignOperator,
            regex: /^(\@)/
        },
        {
            token: SyntaxKind.TildeOperator,
            regex: /^(~)/
        },
        {
            token: SyntaxKind.MultiplationOperator,
            regex: /^(\*)/
        },
        {
            token: SyntaxKind.DivisionOperator,
            regex: /^(\/)/
        },
        {
            token: SyntaxKind.AdditionOperator,
            regex: /^(\+)/
        },
        {
            token: SyntaxKind.SubtractionOperator,
            regex: /^(-)/
        },
        {
            token: SyntaxKind.LessThanOrEqualsOperator,
            regex: /^(<=)/
        },
        {
            token: SyntaxKind.LessThanOperator,
            regex: /^(<)/
        },
        {
            token: SyntaxKind.EqualsOperator,
            regex: /^(=)/
        },
        {
            token: SyntaxKind.AssignmentOperator,
            regex: /^(<-)/
        },
        {
            token: SyntaxKind.FatArrowOperator,
            regex: /^(=>)/
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
            token: SyntaxKind.OpenCurlyBracket,
            regex: /^(\{)/
        },
        {
            token: SyntaxKind.ClosedCurlyBracket,
            regex: /^(\})/
        },
        {
            token: SyntaxKind.Colon,
            regex: /^(:)/
        },
        {
            token: SyntaxKind.SemiColon,
            regex: /^(;)/
        },
        {
            token: SyntaxKind.Comma,
            regex: /^(,)/
        }
    ];

    export function isKeyword(tokenType: SyntaxKind) {
        return (tokenType == SyntaxKind.ClassKeyword
            || tokenType == SyntaxKind.ElseKeyword
            || tokenType == SyntaxKind.FalseKeyword
            || tokenType == SyntaxKind.FiKeyword
            || tokenType == SyntaxKind.IfKeyword
            || tokenType == SyntaxKind.InKeyword
            || tokenType == SyntaxKind.InheritsKeyword
            || tokenType == SyntaxKind.IsvoidKeyword
            || tokenType == SyntaxKind.LetKeyword
            || tokenType == SyntaxKind.LoopKeyword
            || tokenType == SyntaxKind.PoolKeyword
            || tokenType == SyntaxKind.ThenKeyword
            || tokenType == SyntaxKind.WhileKeyword
            || tokenType == SyntaxKind.CaseKeyword
            || tokenType == SyntaxKind.EsacKeyword
            || tokenType == SyntaxKind.NewKeyword
            || tokenType == SyntaxKind.OfKeyword
            || tokenType == SyntaxKind.NotKeyword
            || tokenType == SyntaxKind.TrueKeyword);
    }

    function stringContainsUnescapedQuotes(input: string, ignoreFinalQuote: boolean = false): boolean {
        if (ignoreFinalQuote) {
            return /[^\\]".+/.test(input);
        } else {
            return /[^\\]"/.test(input);
        }
    }
}