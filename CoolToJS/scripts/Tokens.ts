module CoolToJS {
    export enum TokenType {
        Integer,
        String,
        ObjectIdentifier, 
        TypeIdentifier, 
        WhiteSpace,
        Comment,

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

        OpenParenthesis,
        ClosedParenthesis,
        OpenCurlyBracket,
        ClosedCurlyBracket,
        Colon,
        SemiColon
    }

    export var TokenLookup: { token: TokenType; regex: RegExp }[] = [
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
            regex: /^(--.*)|(\(\*.*\*\))/,
        },

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
        }
    ];
}