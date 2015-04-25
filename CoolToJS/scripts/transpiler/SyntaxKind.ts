﻿module CoolToJS {
    export enum SyntaxKind {
        ClassKeyword = 0,
        ElseKeyword = 1,
        FalseKeyword = 2,
        FiKeyword = 3,
        IfKeyword = 4,
        InheritsKeyword = 5,
        IsvoidKeyword = 6,
        LetKeyword = 7,
        LoopKeyword = 8,
        PoolKeyword = 9,
        ThenKeyword = 10,
        WhileKeyword = 11,
        CaseKeyword = 12,
        EsacKeyword = 13,
        NewKeyword = 14,
        OfKeyword = 15,
        NotKeyword = 16,
        TrueKeyword = 17,

        Integer = 18,
        String = 19,
        ObjectIdentifier = 20,
        TypeIdentifier = 21,
        WhiteSpace = 22,
        CarriageReturn = 23,
        NewLine = 24,
        Tab = 25,
        Comment = 26,

        DotOperator = 27,
        AtSignOperator = 28,
        TildeOperator = 29,
        MultiplationOperator = 30,
        DivisionOperator = 31,
        AdditionOperator = 32,
        SubtrationOperator = 33,
        LessThanOrEqualsOperator = 34,
        LessThanOperator = 35,
        EqualsOperator = 36,
        AssignmentOperator = 37,
        FatArrowOperator = 38,

        OpenParenthesis = 39,
        ClosedParenthesis = 40,
        OpenCurlyBracket = 41,
        ClosedCurlyBracket = 42,
        Colon = 43,
        SemiColon = 44,
        Comma = 45,

        // higher-level constructs, not used in lexical analysis
        Program = 46,
        Class = 47,
        Feature = 48,
        Formal = 49,
        Expression = 50
    }

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

                if (input.indexOf('"Hello') === 0) {
                    console.log('sdfsd');
                }

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
            token: SyntaxKind.SubtrationOperator,
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