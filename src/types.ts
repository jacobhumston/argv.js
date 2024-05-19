/** Argv arguments return types map. */
export type ArgvArgumentsReturnTypesMap = {
    string: string;
    number: number;
    boolean: boolean;
    file: Blob;
    path: string;
    'list-any': Array<string | number | boolean | Blob>;
    'list-string': Array<string>;
    'list-number': Array<number>;
    'list-boolean': Array<boolean>;
    'list-file': Array<Blob>;
    'list-path': Array<string>;
};

/** Argv arguments return types. */
export type ArgvArgumentReturnTypes<Type extends ArgvReturnTypes> = Type extends keyof ArgvArgumentsReturnTypesMap
    ? ArgvArgumentsReturnTypesMap[Type]
    : never;

/** Returned result by the parser. */
export type ArgvResult<Arguments extends readonly ArgvArgument[]> = {
    expected: {
        [Argument in Arguments[number] as Argument['name']]: ArgvArgumentResult<Argument>;
    };
};

/** Returned argv argument. */
export type ArgvArgumentResult<Argument extends ArgvArgument> = Argument & {
    value: Argument['required'] extends true
        ? ArgvArgumentReturnTypes<Argument['returnType']>
        : ArgvArgumentReturnTypes<Argument['returnType']> | undefined;
};

/** Return types of an argument. */
export type ArgvReturnTypes =
    | 'string'
    | 'number'
    | 'boolean'
    | 'file'
    | 'path'
    | 'list-any'
    | 'list-string'
    | 'list-number'
    | 'list-boolean'
    | 'list-file'
    | 'list-path';

/** A argv argument. */
export type ArgvArgument = {
    /** Name of this argument. */
    name: string;
    /** Description of this argument. (Default: "No description available.") */
    description?: string;
    /* The type of value expected to be returned for this argument. (Default: string) */
    returnType: ArgvReturnTypes;
    /** Wether this argument is required or not when parsing. (Default: true) */
    required?: boolean;
    /** Options available when the `returnType` is a list. */
    returnTypeListOptions?: {
        /** Maximum amount of items allowed before the parser will error. (Default: 100) */
        maxItems?: number;
        /** Minimum amount of items required before the parser will error. (Default: 0) */
        minItems?: number;
        /** The separator used to split the items. (Default: ",") */
        separator?: string;
    };
    /** Allows the `unexpected` result to be populated. (Default: true) */
    allowUnexpected?: boolean;
};

/**
 * Base argv parser options.
 * These options apply to all types of parsers.
 */
export type ArgvBaseParserOptions = {
    /** The maximum length of the argv string before it will error. (Default: 9999) */
    maxStringLength?: number;
    /** The minimum length of the argv string before it will error. (Default: 0) */
    minStringLength?: number;
    /** Expected arguments, these arguments are always returned. (Even if not provided.) */
    arguments: Array<ArgvArgument>;
    /**
     * Custom file resolver, used on `file` arguments.
     * Default implementation uses `node:fs`.
     * This function should return a blob of the file or null if the path was invalid.
     */
    fileResolver?: (path: string) => Promise<Blob | null>;
    /**
     * Custom file resolver, used on `path` arguments.
     * Default implementation uses `node:fs`.
     * This function should return the path or null if the path was invalid.
     */
    pathResolver?: (path: string) => Promise<string | null>;
};

/** Argv parser options map. */
export type ArgvParserOptionsMap = {
    positional: ArgvBaseParserOptions & {};
    flag: ArgvBaseParserOptions & {};
    'positional-flag-mix': ArgvBaseParserOptions & {};
};

/** Argv parser options. */
export type ArgvParserOptions<Type extends ArgvParserType> = Type extends keyof ArgvParserOptionsMap
    ? ArgvParserOptionsMap[Type]
    : never;

/**
 * Type of argv parser.
 * * `positional` - Arguments are position based. Ex; `apple 100 true "the best apple you've ever seen"`
 * * `flag` - Arguments are flag based. Ex; `--fruit apple --price 100 --sellable true --description "the best apple you've ever seen"`
 * * `positional-flag-mix` - A mix of `positional` and `flag` where positional arguments are first then flags second. Ex; `apple 100 --sellable true --description "the best apple you've ever seen"`
 */
export type ArgvParserType = 'positional' | 'flag' | 'positional-flag-mix';
