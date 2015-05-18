module CoolToJS {

    // tracks which properties, methods, keywords, etc. are used in 
    // order to minimize the size of the output code
    export class UsageRecord {
        binaryOperations: Array<BinaryOperationType> = [];
        unaryOperations: Array<UnaryOperationType> = [];
        caseExpression: boolean = false;
    }
} 