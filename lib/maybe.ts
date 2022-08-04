/**************
 *  TYPEDEFS  *
 **************/

/** Hidden Typings. */
export namespace IMaybe {
    /** Instance States. */
    export type Outcome = 'some' | 'none';

    /** Outcome Mapping. */
    export interface IMap<T> {
        readonly some: ISome<T>;
        readonly none: INone<T>;
    }

    /** Pattern Matching Interface. */
    export interface IPattern<T, U> {
        readonly some: (value: T) => U;
        readonly none: () => U;
    }
}

/** Core Monadic Interface. */
export interface Maybe<T> {
    readonly kind: IMaybe.Outcome;
    is<O extends IMaybe.Outcome>(kind: O): this is IMaybe.IMap<T>[O];
    unwrap(alternative?: T): T;
    map<U>(fn: (value: T) => U): Maybe<U>;
    match<U>(fn: IMaybe.IPattern<T, U>): U;
}

/** Some Result Interface. */
export interface ISome<T> extends Maybe<T> {
    readonly kind: 'some';
    unwrap(): T;
    map<U>(fn: (value: T) => U): ISome<U>;
}

/** None Result Interface. */
export interface INone<T> extends Maybe<T> {
    readonly kind: 'some';
    unwrap(alternative?: T): undefined extends T ? never : T;
    map<U>(fn: (value: T) => U): INone<U>;
}

/********************
 *  IMPLEMENTATION  *
 ********************/

/** Base Maybe Implementation. */
class _Maybe_impl<T> implements Maybe<T> {
    /****************
     *  PROPERTIES  *
     ****************/

    /** Base outcome state. */
    readonly kind: IMaybe.Outcome;

    /******************
     *  CONSTRUCTORS  *
     ******************/

    /**
     * Constructs a `Maybe` monad.
     * @param value                             Core value.
     */
    constructor(private readonly m_value?: T) {
        this.kind = m_value === undefined ? 'none' : 'some';
    }

    /********************
     *  PUBLIC METHODS  *
     ********************/

    /**
     * Denotes if the monad has a value.
     * @param kind                              Expected outcome.
     */
    is<O extends IMaybe.Outcome>(kind: O): this is IMaybe.IMap<T>[O] {
        return kind === this.kind;
    }

    /**
     * Coordinates unwrapping the monadic value to a suitable return result.
     * @param alternative                       Error alternative.
     */
    unwrap(alternative?: T): T {
        if (this.kind === 'some') return this.m_value!;
        if (alternative !== undefined) return alternative;
        throw new Error('Monad::Maybe | Cannot unwrap none!');
    }

    /**
     * Maps a Maybe monad if it currently has some value.
     * @param fn                                Mapping method.
     */
    map<U>(fn: (value: T) => U): Maybe<U> {
        return this.kind === 'none' ? None<U>() : Some(fn(this.m_value!));
    }

    /**
     * Coordinates a match pattern based on the monads state.
     * @param fn                                Pattern matcher.
     */
    match<U>(fn: IMaybe.IPattern<T, U>): U {
        return fn[this.kind](this.m_value!);
    }
}

/***************
 *  FACTORIES  *
 ***************/

/**
 * `Maybe::Some` Generator.
 * @param value                                 Some value.
 */
export const Some = <T>(value: T): ISome<T> => new _Maybe_impl(value) as any;

/** `Maybe::None` Generator. */
export const None = <T>(): INone<T> => new _Maybe_impl() as any;
