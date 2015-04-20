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
        
    }

    export var TokenLookup = [
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
    ];


}