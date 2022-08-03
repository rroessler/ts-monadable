# TS-Monads

A simple set of Monadic structures and typings for TypeScript projects.


## Install

```bash
npm install ts-monads
```


## API

### Maybe

The `Maybe` structures can be used to define an optional value. This value may be something or nothing. By wrapping return values in this monad, it forces explicit handling of empty returns.

```typescript
import * as Monads from 'ts-monads';

// simple constructor for an example
const func = (name: string, flag: boolean): Monads.Maybe<string> => {
    return flag ? Monads.Some(name) : Monads.None();
}

// various monadic methods can then be invoked
func.is('some'); // type-guard
func.unwrap(); // safe-unwrapping (throws on `none` with no alternative)
```

### Result

Similar to the `Maybe` structure, `Result` structures explicitly define an alternative value for an error. This allows adding failure meta-data to results.

```typescript
import * as Monads from 'ts-monads';

// simple constructor for an example
const func = (name: string): Monads.Result<string, string> => {
    return name === 'ts-monads' ? Monads.Okay(name) : Monads.Error("Invalid name given!");
}
```


## License

[MIT](https://opensource.org/licenses/MIT)
