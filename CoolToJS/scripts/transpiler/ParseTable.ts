module CoolToJS {

    export enum Action {
        Shift, Reduce, Accept, None
    }

    export interface ParseTableEntry {
        action: Action;
        nextState?: number;
        productionIndex?: number;
    }

    export var slr1ParseTable: Array<Array<ParseTableEntry>> = [
            /* state 0 */[null, { action: Action.Shift, nextState: 2 }, null, null, null, { action: Action.Shift, nextState: 3 }, { action: Action.None, nextState: 1 }],
            /* state 1 */[{ action: Action.Accept }, null, null, { action: Action.Shift, nextState: 5 }, { action: Action.Shift, nextState: 4 }, null, null],
            /* state 2 */[null, { action: Action.Shift, nextState: 2 }, null, null, null, { action: Action.Shift, nextState: 3 }, { action: Action.None, nextState: 6 }],
            /* state 3 */[{ action: Action.Reduce, nextState: 4 }, null, { action: Action.Reduce, nextState: 4 }, { action: Action.Shift, nextState: 4 }, { action: Action.Reduce, nextState: 4 }, null, null],
            /* state 4 */[null, { action: Action.Shift, nextState: 2 }, null, null, null, { action: Action.Shift, nextState: 3 }, { action: Action.Shift, nextState: 7 }],
            /* state 5 */[null, { action: Action.Shift, nextState: 2 }, null, null, null, { action: Action.Shift, nextState: 3 }, { action: Action.None, nextState: 8 }],
            /* state 6 */[null, null, { action: Action.Shift, nextState: 9 }, { action: Action.Shift, nextState: 5 }, { action: Action.Shift, nextState: 4 }, null, null],
            /* state 7 */[{ action: Action.Reduce, nextState: 1 }, null, { action: Action.Reduce, nextState: 1 }, { action: Action.Shift, nextState: 5 }, { action: Action.Reduce, nextState: 1 }, null, null],
            /* state 8 */[{ action: Action.Reduce, nextState: 2 }, null, { action: Action.Reduce, nextState: 2 }, { action: Action.Reduce, nextState: 2 }, { action: Action.Reduce, nextState: 2 }, null, null],
            /* state 9 */[{ action: Action.Reduce, nextState: 3 }, null, { action: Action.Reduce, nextState: 3 }, { action: Action.Reduce, nextState: 3 }, { action: Action.Reduce, nextState: 3 }, null, null],
    ];

    export var slr1ParseTableOld: Array<Array<string>> = [
            //            end   (     )     *     +     int   E     
            /* state 0 */[null, 's2', null, null, null, 's3', '1 '],
            /* state 1 */['a ', null, null, 's5', 's4', null, null],
            /* state 2 */[null, 's2', null, null, null, 's3', '6'],
            /* state 3 */['r4', null, 'r4', 's4', 'r4', null, null],
            /* state 4 */[null, 's2', null, null, null, 's3', '7 '],
            /* state 5 */[null, 's2', null, null, null, 's3', '8 '],
            /* state 6 */[null, null, 's9', 's5', 's4', null, null],
            /* state 7 */['r1', null, 'r1', 's5', 'r1', null, null],
            /* state 8 */['r2', null, 'r2', 'r2', 'r2', null, null],
            /* state 9 */['r3', null, 'r3', 'r3', 'r3', null, null],
    ];

    export var productions: Array<{ popCount: number; reduceResult: SyntaxKind }> = [
        // 0: $accept -> E $end
        { popCount: 2, reduceResult: null },

        // 1: E -> E + E
        { popCount: 3, reduceResult: SyntaxKind.E },

        // 2: E -> E * E
        { popCount: 3, reduceResult: SyntaxKind.E },

        // 3: E -> ( E )
        { popCount: 3, reduceResult: SyntaxKind.E },

        // 4: E -> int
        { popCount: 1, reduceResult: SyntaxKind.E },
    ];
} 