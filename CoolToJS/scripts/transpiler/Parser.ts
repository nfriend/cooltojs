module CoolToJS {
    export class Parser {
        public Parse = (tokens: Array<Token>): ParserOutput => {

            tokens.push({
                token: SyntaxKind.End,
                match: null,
                location: null
            });

            var stack: Array<SyntaxKind> = [],
                inputPointer: number = 0;

            while (stack[0] !== SyntaxKind.E && inputPointer !== tokens.length - 1) {
                var nextState: number = 0;
                for (var i = 0; i < stack.length; i++) {
                    var nextMoveString = this.slr1ParseTable[stack[i]][];
                }
            }

            return {
                success: true,
                parseTree: {}
            }
        }

        private slr1ParseTable: Array<Array<string>> = [
            //            end   (     )     *     +     int   E     T
            /* state 0 */[null, 's4', null, null, null, 's3', '1 ', '2 '],
            /* state 1 */['a ', null, null, null, null, null, null, null],
            /* state 2 */['r2', null, 'r2', null, 's5', null, null, null],
            /* state 3 */['r4', null, 'r4', 's6', 'r4', null, null, null],
            /* state 4 */[null, 's4', null, null, null, 's3', '7 ', '2 '],
            /* state 5 */[null, 's4', null, null, null, 's3', '8 ', '2 '],
            /* state 6 */[null, 's4', null, null, null, 's3', null, '9 '],
            /* state 7 */[null, null, 's10', null, null, null, null, null],
            /* state 8 */['r1', null, 'r1', null, null, null, null, null],
            /* state 9 */['r3', null, 'r3', null, 'r3', null, null, null],
            /* state 10*/['r5', null, 'r5', null, 'r5', null, null, null],
        ];
    }
}