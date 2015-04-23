﻿module CoolToJS {
    export enum TokenType {
        ClassKeyword,
        ElseKeyword,
        FalseKeyword,
        FiKeyword,
        IfKeyword,
        InheritsKeyword,
        IsvoidKeyword,
        LetKeyword,
        LoopKeyword,
        PoolKeyword,
        ThenKeyword,
        WhileKeyword,
        CaseKeyword,
        EsacKeyword,
        NewKeyword,
        OfKeyword,
        NotKeyword,
        TrueKeyword,

        Integer,
        String,
        ObjectIdentifier,
        TypeIdentifier,
        WhiteSpace,
        CarriageReturn,
        NewLine,
        Tab,
        Comment,

        DotOperator,
        AtSignOperator,
        TildeOperator,
        MultiplationOperator,
        DivisionOperator,
        AdditionOperator,
        SubtrationOperator,
        LessThanOrEqualsOperator,
        LessThanOperator,
        EqualsOperator,
        AssignmentOperator,
        FatArrowOperator,

        OpenParenthesis,
        ClosedParenthesis,
        OpenCurlyBracket,
        ClosedCurlyBracket,
        Colon,
        SemiColon,
        Comma
    }

    export interface TokenDefinition {
        token: TokenType;
        regex?: RegExp;
        matchFunction?: (input: string) => string;
    }

    // order signifies priority (keywords are listed first)
    export var TokenLookup: TokenDefinition[] = [
        {
            token: TokenType.ClassKeyword,
            regex: /^(class)\b/i,
        },
        {
            token: TokenType.ElseKeyword,
            regex: /^(else)\b/i,
        },
        {
            token: TokenType.FalseKeyword,
            regex: /^(f[aA][lL][sS][eE])\b/,
        },
        {
            token: TokenType.TrueKeyword,
            regex: /^(t[rR][uU][eE])\b/,
        },
        {
            token: TokenType.FiKeyword,
            regex: /^(fi)\b/i,
        },
        {
            token: TokenType.IfKeyword,
            regex: /^(if)\b/i,
        },
        {
            token: TokenType.InheritsKeyword,
            regex: /^(inherits)\b/i,
        },
        {
            token: TokenType.IsvoidKeyword,
            regex: /^(isvoid)\b/i,
        },
        {
            token: TokenType.LetKeyword,
            regex: /^(let)\b/i,
        },
        {
            token: TokenType.LoopKeyword,
            regex: /^(loop)\b/i,
        },
        {
            token: TokenType.PoolKeyword,
            regex: /^(pool)\b/i,
        },
        {
            token: TokenType.ThenKeyword,
            regex: /^(then)\b/i,
        },
        {
            token: TokenType.WhileKeyword,
            regex: /^(while)\b/i,
        },
        {
            token: TokenType.CaseKeyword,
            regex: /^(case)\b/i,
        },
        {
            token: TokenType.EsacKeyword,
            regex: /^(esac)\b/i,
        },
        {
            token: TokenType.NewKeyword,
            regex: /^(new)\b/i,
        },
        {
            token: TokenType.OfKeyword,
            regex: /^(of)\b/i,
        },
        {
            token: TokenType.NotKeyword,
            regex: /^(not)\b/i,
        },
        {
            token: TokenType.Integer,
            regex: /^([0-9]+)\b/,
        },
        {
            token: TokenType.String,
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
            token: TokenType.ObjectIdentifier,
            regex: /^([a-z][a-zA-Z0-9_]*)\b/,
        },
        {
            token: TokenType.TypeIdentifier,
            regex: /^([A-Z][a-zA-Z0-9_]*)\b/,
        },
        {
            token: TokenType.WhiteSpace,
            regex: /^( +)/,
        },
        {
            token: TokenType.CarriageReturn,
            regex: /^(\r)/,
        },
        {
            token: TokenType.NewLine,
            regex: /^(\n)/,
        },
        {
            token: TokenType.Tab,
            regex: /^(\t)/,
        },

        // currently doesn't allow nested (* ... *) comments
        {
            token: TokenType.Comment,
            regex: /^((?:--.*)|(?:\(\*(?:(?!\*\))[\s\S])*\*\)))/,
        },

        {
            token: TokenType.DotOperator,
            regex: /^(\.)/
        },
        {
            token: TokenType.AtSignOperator,
            regex: /^(\@)/
        },
        {
            token: TokenType.TildeOperator,
            regex: /^(~)/
        },
        {
            token: TokenType.MultiplationOperator,
            regex: /^(\*)/
        },
        {
            token: TokenType.DivisionOperator,
            regex: /^(\/)/
        },
        {
            token: TokenType.AdditionOperator,
            regex: /^(\+)/
        },
        {
            token: TokenType.SubtrationOperator,
            regex: /^(-)/
        },
        {
            token: TokenType.LessThanOrEqualsOperator,
            regex: /^(<=)/
        },
        {
            token: TokenType.LessThanOperator,
            regex: /^(<)/
        },
        {
            token: TokenType.EqualsOperator,
            regex: /^(=)/
        },
        {
            token: TokenType.AssignmentOperator,
            regex: /^(<-)/
        },
        {
            token: TokenType.FatArrowOperator,
            regex: /^(=>)/
        },

        {
            token: TokenType.OpenParenthesis,
            regex: /^(\()/
        },
        {
            token: TokenType.ClosedParenthesis,
            regex: /^(\))/
        },
        {
            token: TokenType.OpenCurlyBracket,
            regex: /^(\{)/
        },
        {
            token: TokenType.ClosedCurlyBracket,
            regex: /^(\})/
        },
        {
            token: TokenType.Colon,
            regex: /^(:)/
        },
        {
            token: TokenType.SemiColon,
            regex: /^(;)/
        },
        {
            token: TokenType.Comma,
            regex: /^(,)/
        }
    ];

    export function isKeyword(tokenType: TokenType) {
        return (tokenType == TokenType.ClassKeyword
            || tokenType == TokenType.ElseKeyword
            || tokenType == TokenType.FalseKeyword
            || tokenType == TokenType.FiKeyword
            || tokenType == TokenType.IfKeyword
            || tokenType == TokenType.InheritsKeyword
            || tokenType == TokenType.IsvoidKeyword
            || tokenType == TokenType.LetKeyword
            || tokenType == TokenType.LoopKeyword
            || tokenType == TokenType.PoolKeyword
            || tokenType == TokenType.ThenKeyword
            || tokenType == TokenType.WhileKeyword
            || tokenType == TokenType.CaseKeyword
            || tokenType == TokenType.EsacKeyword
            || tokenType == TokenType.NewKeyword
            || tokenType == TokenType.OfKeyword
            || tokenType == TokenType.NotKeyword
            || tokenType == TokenType.TrueKeyword);
    }

    function stringContainsUnescapedQuotes(input: string, ignoreFinalQuote: boolean = false): boolean {
        if (ignoreFinalQuote) {
            return /[^\\]".+/.test(input);
        } else {
            return /[^\\]"/.test(input);
        }
    }
}