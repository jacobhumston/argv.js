import * as types from '../types.js';

export default async function <
    String extends string,
    Options extends types.ArgvParserOptions<'positional'> & { arguments: types.ArgvArgument[] }
>(input: String, options: Options): Promise<types.ArgvResult<Options['arguments']>> {
    const result: types.ArgvResult<Options['arguments']> = {
        expected: {} as types.ArgvResult<Options['arguments']>['expected']
    };

    // Populate result.expected based on input and options.arguments
    for (const arg of options.arguments) {
        (result.expected as { [key: string]: types.ArgvArgumentResult<types.ArgvArgument> })[arg.name] = {
            ...arg,
            value: undefined // Placeholder, actual parsing logic goes here
        } as types.ArgvArgumentResult<typeof arg>;
    }

    return result;
}
