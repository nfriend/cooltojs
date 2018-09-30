declare module CoolToJS {
    enum NodeType {
        Program = 0,
        Class = 1,
        Property = 2,
        Method = 3,
        AssignmentExpression = 4,
        MethodCallExpression = 5,
        IfThenElseExpression = 6,
        WhileExpression = 7,
        BlockExpression = 8,
        LetExpression = 9,
        LocalVariableDeclaration = 10,
        CaseExpression = 11,
        CaseOption = 12,
        NewExpression = 13,
        IsvoidExpression = 14,
        BinaryOperationExpression = 15,
        UnaryOperationExpression = 16,
        ParentheticalExpression = 17,
        SelfExpression = 18,
        ObjectIdentifierExpression = 19,
        IntegerLiteralExpression = 20,
        StringLiteralExpression = 21,
        TrueKeywordExpression = 22,
        FalseKeywordExpression = 23
    }
    enum BinaryOperationType {
        Addition = 0,
        Subtraction = 1,
        Division = 2,
        Multiplication = 3,
        LessThan = 4,
        LessThanOrEqualTo = 5,
        Comparison = 6
    }
    enum UnaryOperationType {
        Complement = 0,
        Not = 1
    }
    class Node {
        constructor(type: NodeType);
        type: NodeType;
        nodeTypeName: string;
        sourceLocation: SourceLocation;
        children: Array<Node>;
        parent: Node;
        token: Token;
    }
    class ProgramNode extends Node {
        constructor();
        classList: Array<ClassNode>;
    }
    class ClassNode extends Node {
        constructor(className: string);
        className: string;
        superClassName: string;
        isAsync: boolean;
        calls: Array<MethodNode | PropertyNode | ClassNode>;
        calledBy: Array<MethodNode | PropertyNode>;
        propertyList: Array<PropertyNode>;
        methodList: Array<MethodNode>;
        readonly isSubClass: boolean;
    }
    class MethodNode extends Node {
        constructor();
        methodName: string;
        returnTypeName: string;
        parameters: Array<{
            parameterName: string;
            parameterTypeName: string;
        }>;
        isAsync: boolean;
        isInStringOrInInt: boolean;
        isUsed: boolean;
        calls: Array<MethodNode | PropertyNode | ClassNode>;
        calledBy: Array<MethodNode | PropertyNode>;
        readonly hasParameters: boolean;
        methodBodyExpression: ExpressionNode;
    }
    class PropertyNode extends Node {
        constructor();
        propertyName: string;
        typeName: string;
        isUsed: boolean;
        isAsync: boolean;
        calls: Array<MethodNode | PropertyNode | ClassNode>;
        calledBy: Array<MethodNode | PropertyNode>;
        readonly hasInitializer: boolean;
        propertyInitializerExpression: ExpressionNode;
    }
    class ExpressionNode extends Node {
        constructor(expressionType: NodeType);
    }
    class AssignmentExpressionNode extends ExpressionNode {
        constructor();
        identifierName: string;
        isAssignmentToSelfVariable: boolean;
        assignmentExpression: ExpressionNode;
    }
    class MethodCallExpressionNode extends ExpressionNode {
        constructor();
        methodName: string;
        isCallToParent: boolean;
        explicitParentCallTypeName: string;
        isCallToSelf: boolean;
        targetExpression: ExpressionNode;
        method: MethodNode;
        isInStringOrInInt: boolean;
        parameterExpressionList: Array<ExpressionNode>;
    }
    class IfThenElseExpressionNode extends ExpressionNode {
        constructor();
        predicate: ExpressionNode;
        consequent: ExpressionNode;
        alternative: ExpressionNode;
    }
    class WhileExpressionNode extends ExpressionNode {
        constructor();
        whileConditionExpression: ExpressionNode;
        whileBodyExpression: ExpressionNode;
    }
    class BlockExpressionNode extends ExpressionNode {
        constructor();
        expressionList: Array<ExpressionNode>;
    }
    class LetExpressionNode extends ExpressionNode {
        constructor();
        localVariableDeclarations: Array<LocalVariableDeclarationNode>;
        letBodyExpression: ExpressionNode;
    }
    class LocalVariableDeclarationNode extends Node {
        constructor();
        identifierName: string;
        typeName: string;
        initializerExpression: ExpressionNode;
    }
    class CaseExpressionNode extends ExpressionNode {
        constructor();
        condition: ExpressionNode;
        caseOptionList: Array<CaseOptionNode>;
    }
    class CaseOptionNode extends Node {
        constructor();
        identiferName: string;
        typeName: string;
        caseOptionExpression: ExpressionNode;
    }
    class NewExpressionNode extends ExpressionNode {
        constructor();
        typeName: string;
        classNode: ClassNode;
    }
    class IsVoidExpressionNode extends ExpressionNode {
        constructor();
        isVoidCondition: ExpressionNode;
    }
    class BinaryOperationExpressionNode extends ExpressionNode {
        constructor();
        operationType: BinaryOperationType;
        operand1: ExpressionNode;
        operand2: ExpressionNode;
    }
    class UnaryOperationExpressionNode extends ExpressionNode {
        constructor();
        operationType: UnaryOperationType;
        operand: ExpressionNode;
    }
    class ParentheticalExpressionNode extends ExpressionNode {
        constructor();
        innerExpression: ExpressionNode;
    }
    class SelfExpressionNode extends ExpressionNode {
        constructor();
    }
    class ObjectIdentifierExpressionNode extends ExpressionNode {
        constructor();
        isCallToSelf: boolean;
        objectIdentifierName: string;
    }
    class IntegerLiteralExpressionNode extends ExpressionNode {
        constructor();
        value: number;
    }
    class StringLiteralExpressionNode extends ExpressionNode {
        constructor();
        value: string;
    }
    class TrueKeywordExpressionNode extends ExpressionNode {
        constructor();
    }
    class FalseKeywordExpressionNode extends ExpressionNode {
        constructor();
    }
}
declare module CoolToJS {
    class AbstractSyntaxTreeConverter {
        Convert: (parserOutput: ParserOutput) => ASTConverterOutput;
        private convert;
        private flattenRecursion;
        private isBinaryOperator;
    }
}
declare module CoolToJS {
    interface IOFunctionDefinitions {
        out_string: (output: string) => void;
        out_int: (output: number) => void;
        in_string: (onInput: (input: string) => any) => void;
        in_int: (onInput: (input: string) => any) => void;
    }
    class JavaScriptGenerator {
        private errorMessages;
        private warningMessages;
        Generate: (semanticAnalysisOutput: SemanticAnalyzerOutput, ioFunctions: IOFunctionDefinitions) => JavaScriptGeneratorOutput;
        usageRecord: UsageRecord;
        isInAsyncContext: boolean;
        private generate;
        private generateIOClass;
        private generateClass;
        private generateClassProperty;
        private generateClassMethod;
        private generateExpression;
        private generateLetExpression;
        private generateMethodCallExpression;
        private generateBlockExpression;
        private generateAssignmentExpression;
        private generateObjectIdentifierExpression;
        private generateSelfExpression;
        private generateNewExpression;
        private generateStringLiteralExpression;
        private generateIntegerLiteralExpression;
        private generateParentheticalExpressionNode;
        private generateTrueKeywordExpression;
        private generateFalseKeywordExpression;
        private generateBinaryOperationExpression;
        private generateUnaryOperationExpression;
        private generateIfThenElseExpression;
        private generateWhileExpression;
        private generateCaseExpression;
        private generateIsVoidExpression;
        private indentCache;
        private singleIndent;
        private indent;
        private expressionReturnsItself;
        private unwrapSelfReturningExpression;
        private wrapInSelfExecutingFunction;
        private translateTypeNameIfPrimitiveType;
        private doesEndInSemiColon;
    }
}
declare module CoolToJS {
    interface Token {
        token: SyntaxKind;
        match: string;
        location: SourceLocation;
        tokenName: string;
    }
    class LexicalAnalyzer {
        private tabLength;
        Analyze: (coolProgramSource: string) => LexicalAnalyzerOutput;
    }
}
declare module CoolToJS {
    interface SourceLocation {
        line: number;
        column: number;
        length: number;
    }
    interface ErrorMessage {
        message: string;
        location: SourceLocation;
    }
    interface WarningMessage {
        message: string;
        location: SourceLocation;
    }
    interface TranspilerOutput {
        success: boolean;
        generatedJavaScript?: string;
        errorMessages?: Array<ErrorMessage>;
        warningMessages?: Array<WarningMessage>;
        elapsedTime: number;
    }
    interface LexicalAnalyzerOutput {
        success: boolean;
        tokens?: Token[];
        errorMessages?: Array<ErrorMessage>;
        warningMessages?: Array<WarningMessage>;
    }
    interface ParserOutput {
        success: boolean;
        syntaxTree?: SyntaxTree;
        errorMessages?: Array<ErrorMessage>;
        warningMessages?: Array<WarningMessage>;
    }
    interface ASTConverterOutput {
        success: boolean;
        abstractSyntaxTree: Node;
        errorMessages?: Array<ErrorMessage>;
        warningMessages?: Array<WarningMessage>;
    }
    interface SemanticAnalyzerOutput {
        success: boolean;
        abstractSyntaxTree: Node;
        usageRecord: UsageRecord;
        errorMessages?: Array<ErrorMessage>;
        warningMessages?: Array<WarningMessage>;
    }
    interface JavaScriptGeneratorOutput {
        success: boolean;
        errorMessages?: Array<ErrorMessage>;
        warningMessages?: Array<WarningMessage>;
        generatedJavaScript: string;
    }
}
declare module CoolToJS {
    enum SyntaxKind {
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
        Comment = 58
    }
    var StartSyntaxKind: SyntaxKind;
    interface TokenDefinition {
        token: SyntaxKind;
        regex?: RegExp;
        matchFunction?: (input: string) => string;
    }
    var TokenLookup: TokenDefinition[];
    function isKeyword(tokenType: SyntaxKind): boolean;
}
declare module CoolToJS {
    enum Action {
        Shift = 0,
        Reduce = 1,
        Accept = 2,
        None = 3
    }
    interface ParseTableEntry {
        action: Action;
        nextState?: number;
        productionIndex?: number;
    }
    var slr1ParseTable: Array<Array<ParseTableEntry | ParseTableEntry[]>>;
    var productions: Array<{
        popCount: number;
        reduceResult: SyntaxKind;
    }>;
}
declare module CoolToJS {
    interface SyntaxTree {
        syntaxKind: SyntaxKind;
        token?: Token;
        parent: SyntaxTree;
        children: Array<SyntaxTree>;
        syntaxKindName: string;
    }
    class Parser {
        Parse: (lexerOutput: LexicalAnalyzerOutput) => ParserOutput;
        private cleanseTokenArray;
    }
}
declare module CoolToJS {
    class SemanticAnalyzer {
        Analyze: (astConvertOutput: ASTConverterOutput) => SemanticAnalyzerOutput;
        typeHeirarchy: TypeHeirarchy;
        usageRecord: UsageRecord;
        analyze: (ast: Node, typeEnvironment: TypeEnvironment, errorMessages: ErrorMessage[], warningMessages: WarningMessage[]) => string;
        private addTypeError;
        private markAsyncFeatures;
        private markCalledBy;
    }
    interface TypeEnvironment {
        currentClassType: string;
        variableScope: Array<VariableScope>;
        methodScope: any[];
    }
    interface VariableScope {
        variableName: string;
        variableType: string;
    }
}
declare module CoolToJS.DontCompile {
    enum SyntaxKind {
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
        String = 1000,
        Comment = 1001
    }
    var StartSyntaxKind: SyntaxKind;
    interface TokenDefinition {
        token: SyntaxKind;
        regex?: RegExp;
        matchFunction?: (input: string) => string;
    }
    var TokenLookup: TokenDefinition[];
    function isKeyword(tokenType: SyntaxKind): boolean;
}
declare module CoolToJS {
    interface TranspilerOptions {
        coolProgramSources: string | string[];
        out_string?: (output: string) => void;
        out_int?: (output: number) => void;
        in_string?: (onInput: (input: string) => any) => void;
        in_int?: (onInput: (input: string) => any) => void;
    }
    function Transpile(transpilerOptions: TranspilerOptions): TranspilerOutput;
}
declare module CoolToJS {
    var UnknownType: string;
    class TypeHeirarchy {
        constructor(classNode: ClassNode);
        readonly typeName: string;
        classNode: ClassNode;
        parent: TypeHeirarchy;
        children: Array<TypeHeirarchy>;
        static createHeirarchy(programNode: ProgramNode): TypeHeirarchy;
        isAssignableFrom(type1Name: string, type2Name: string, selfTypeClass: string): boolean;
        closetCommonParent(type1Name: string, type2Name: string): string;
        typeExists: (typeName: string) => boolean;
        findTypeHeirarchy: (typeName: string) => TypeHeirarchy;
        findMethodOnType(methodName: string, typeName: string, includeInheritedMethods?: boolean): MethodNode;
        findPropertyOnType(propertyName: string, typeName: string, includeInheritedProperties?: boolean): PropertyNode;
        flatten(result?: Array<TypeHeirarchy>): Array<TypeHeirarchy>;
    }
}
declare module CoolToJS {
    class UsageRecord {
        binaryOperations: Array<BinaryOperationType>;
        unaryOperations: Array<UnaryOperationType>;
        caseExpression: boolean;
    }
}
declare module CoolToJS {
    function GetReferencedCoolSources(completedCallback: (sources: string[]) => any): void;
}
declare module CoolToJS.Utility {
    function PrintSyntaxTree(syntaxTree: SyntaxTree, indent?: string, last?: boolean): void;
    function ShallowCopySyntaxTree(syntaxTree: SyntaxTree, parentTree?: SyntaxTree): SyntaxTree;
    function isNullUndefinedOrWhitespace(s: string): boolean;
    function stringify(ast: Node): string;
    function addBuiltinObjects(programNode: ProgramNode): void;
    function getFunctionDetails(func: any): {
        body: string;
        parameters: Array<string>;
    };
    function getFunctionBody(func: any): string;
    function getFunctionParameters(func: any): Array<string>;
    function escapeIfReserved(id: string): string;
    var baseObjectClass: string;
    var baseStringClass: string;
    var baseIntClass: string;
    var baseBoolClass: string;
    var baseObjectClasses: string[];
    var binaryOperationFunctions: {
        operation: BinaryOperationType;
        func: string;
    }[];
    var unaryOperationFunctions: {
        operation: UnaryOperationType;
        func: string;
    }[];
    var getCaseFunction: (isAsync: boolean) => string;
}
