module CoolToJS {
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

    // order signifies priority (keywords are listed first)
    export var TokenLookup: { token: TokenType; regex: RegExp }[] = [
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
            // this is too simple
            regex: /^(".*")/,
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
            regex: /^(\s+)/,
        },
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
}