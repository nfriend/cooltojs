module CoolToJS {
    export class Parser {
        public Parse = (tokens: Array<Token>): ParserOutput => {

            // for debugging
            var printStack = () => {
                var output = [];
                for (var i = 0; i < stack.length; i++) {
                    output.push(SyntaxKind[stack[i]]);
                }
                return output;
            }

            tokens.push({
                token: SyntaxKind.End,
                tokenName: SyntaxKind[SyntaxKind.End],
                match: null,
                location: null
            });

            var stack: Array<SyntaxKind> = [],
                inputPointer: number = 0;

            // clear out any nonessential tokens for now
            var nextToken = 0;
            while (nextToken < tokens.length) {
                if (tokens[nextToken].token === SyntaxKind.CarriageReturn
                    || tokens[nextToken].token === SyntaxKind.Comment
                    || tokens[nextToken].token === SyntaxKind.NewLine
                    || tokens[nextToken].token === SyntaxKind.String
                    || tokens[nextToken].token === SyntaxKind.Tab
                    || tokens[nextToken].token === SyntaxKind.WhiteSpace) {

                    tokens.splice(nextToken, 1);
                } else {
                    nextToken++;
                }
            }

            while (!(stack[0] === SyntaxKind.E && inputPointer === tokens.length - 1)) {

                if (stack[0] === SyntaxKind.OpenParenthesis && stack[1] === SyntaxKind.E && stack[2] == SyntaxKind.ClosedParenthesis) {
                    debugger;
                }

                var nextState: number = 0,
                    nextMoveString: string;
                for (var i = 0; i < stack.length; i++) {
                    var nextMoveString = this.slr1ParseTable[nextState][stack[i]];
                    if (nextMoveString.slice(0, 1) === 's') {
                        nextState = parseInt(nextMoveString.slice(1), 10);
                    } else if (nextMoveString.slice(0, 1) === 'r') {
                        throw 'I don\'t think we should be here.';
                        nextState = parseInt(nextMoveString.slice(1), 10);
                    } else {
                        nextState = parseInt(nextMoveString, 10);
                    }
                }

                var nextMoveString = this.slr1ParseTable[nextState][tokens[inputPointer].token]
                if (nextMoveString === null || (nextMoveString === 'a ' && inputPointer !== tokens.length - 1)) {
                    nextMoveString = this.slr1ParseTable[nextState][SyntaxKind.End];
                }
                if (nextMoveString.slice(0, 1) === 's') {
                    stack.push(tokens[inputPointer].token);
                    inputPointer++;
                } else if (nextMoveString.slice(0, 1) === 'r') {
                    var production = this.productions[parseInt(nextMoveString.slice(1, 2), 10)];
                    for (var i = 0; i < production.popCount; i++) {
                        stack.pop();
                    }
                    stack.push(production.reduceResult);
                } else {
                    nextState = parseInt(nextMoveString.slice(0, 1), 10);
                }
            }


            return {
                success: true,
                parseTree: {}
            }
        }

        private productions: { popCount: number; reduceResult: SyntaxKind }[] = [
            // 0: $accept -> E $end
            { popCount: 2, reduceResult: null },

            // 1: E -> T + E
            { popCount: 3, reduceResult: SyntaxKind.E },

            // 2: E -> T
            { popCount: 1, reduceResult: SyntaxKind.E },

            // 3: T -> int * T
            { popCount: 3, reduceResult: SyntaxKind.T },

            // 4: T -> int
            { popCount: 1, reduceResult: SyntaxKind.T },

            // 5: T -> ( E )
            { popCount: 3, reduceResult: SyntaxKind.T },
        ];

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

        private follows: { [nonterminal: number]: Array<SyntaxKind> } = {
            // E
            6: [SyntaxKind.End, SyntaxKind.ClosedParenthesis],
            // T
            7: [SyntaxKind.AdditionOperator, SyntaxKind.End, SyntaxKind.ClosedParenthesis]
        }

        private firsts: { [nonterminal: number]: Array<SyntaxKind> } = {
            // E
            6: [SyntaxKind.Integer, SyntaxKind.OpenParenthesis],
            // T
            7: [SyntaxKind.Integer, SyntaxKind.OpenParenthesis]
        }
    }
}