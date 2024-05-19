import * as types from './types.js';

/** Argv parser class, exposes methods to parse arguments. */
export class Parser<Type extends types.ArgvParserType> {
    /** Type of argv parser. */
    private type: Type;
    /** Argv parser options. */
    private options: types.ArgvParserOptions<Type>;
    /** File resolver. */
    private fileResolver: types.ArgvBaseParserOptions['fileResolver'];
    /** Path resolver. */
    private pathResolver: types.ArgvBaseParserOptions['pathResolver'];

    /**
     * Argv parser class, exposes methods to parse arguments.
     * @param type Type of argv parser.
     * @param options Options for this argv parser.
     */
    constructor(type: Type, options: types.ArgvParserOptions<Type>) {
        this.type = type;
        this.options = {
            ...options,
            arguments: options.arguments ?? []
        };

        this.fileResolver =
            options.fileResolver ??
            async function (path: string) {
                const fs = await import('node:fs');
                if (!fs.existsSync(path)) return null;
                return new Blob([fs.readFileSync(path)]);
            };

        this.pathResolver =
            options.pathResolver ??
            async function (path: string) {
                const fs = await import('node:fs');
                if (!fs.existsSync(path)) return null;
                return path;
            };
    }

    /**
     * Parse the input based on the options provided.
     */
    public async parse<
        String extends string, 
        Options extends types.ArgvParserOptions<'positional'> & { arguments: types.ArgvArgument[] }
    >(input: String, options: Options): Promise<types.ArgvResult<Options['arguments']>> {
        const parser = (await import('./parsers/positional.js')).default;

        // Ensure options.arguments is defined
        const optionsWithArguments: Options = {
            ...options,
            arguments: options.arguments ?? []
        };

        return parser(input, optionsWithArguments);
    }
}

/** Default positional parser. */
export const DefaultPositionalParser = new Parser('positional', { arguments: [] });
/** Default flag parser. */
export const DefaultFlagParser = new Parser('flag', { arguments: [] });
/** Default positional-flag-mix parser. */
export const DefaultPositionalFlagMixParser = new Parser('positional-flag-mix', { arguments: [] });

export * from './types.js';
