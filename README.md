![tests](https://github.com/konfirm/node-trap/actions/workflows/tests.yml/badge.svg)
![release](https://github.com/konfirm/node-trap/actions/workflows/release.yml/badge.svg)

# Trap Module


Provide traps for use as Proxy handler, allowing to keep track of changes and choose to commit or rollback changes

## Installation

```
$ npm install --save @konfirm/trap
```

## Usage
The Trap module is designed to handle and reflect Proxy manipulations to an object [Proxy](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy), during its handler assignment you can provide a Trap-instance or parts of it.

### Trap all mutations
```ts
//  include the Trap module
// const { Trap } = require('@konfirm/trap');
import { Trap } from '@konfirm/trap';
//  create a trap instance
const trap = new Trap();
//  create the affected object
const affect = { foo: 'bar', bar: 'baz' };
//  create the proxy
const proxy = new Proxy(affect, trap);

proxy.foo = 'hello world';

console.log(proxy.foo);       //  'hello world'
console.log(affect.foo);      //  'bar'

delete proxy.bar;

console.log('bar' in proxy);   //  false
console.log('bar' in affect);  //  true

//  commit all trapped changes
trap.commit();

console.log(affect.foo);  //  'hello world'
console.log('bar' in affect);  //  false
```


## API
Trap keeps track of changes within proxied objects, and exposes two methods besides the implemented [trap functions](https://github.com/konfirm/node-trap#implementedtrapfunctions).

### Exports

| name                  | description                                                                                                                  |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `Trap`                | The `Trap` class itself                                                                                                      |
| `MutationInterface`   | _TypeScript_ interface describing Mutations                                                                                  |
| `isMutationInterface` | Type Guard validating whether the input is a `MutationInterface`                                                             |
| `MutationOptions`     | _TypeScript_ type describing the target, key and optional value members of a `MutationInterface`                             |
| `isMutationOptions`   | Type Guard validating whether the input is `MutationOptions`                                                                 |
| `DeletionMutation`    | Mutation describing deletion mutations, created by `deleteProperty` (`delete target.key`) operations                         |
| `PropertyMutation`    | Mutation describing property mutations, created by `defineProperty` (`Object.defineProperty(target, key, {...})`) operations |
| `ValueMutation`       | Mutation describing value mutations, created by `set` (`target.key = ...`) operations                                        |
| `AbstractMutation`    | abstract implementation of a Mutation                                                                                        |

### type `MutationOptions`

| property | type                      | required | notes                                                                                                       |
| -------- | ------------------------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| `target` | `Object\|Function\|Array` | yes      | this can be narrowed down (e.g. only objects of a specific type), but never widened (e.g. not add booleans) |
| `key`    | `string                   | symbol`  | yes                                                                                                         | this can be narrowed doen (e.g. only strings), but not wideneded (e.g. not add numbers) |
| `value`  | `any`                     | no       |

### `Trap([trackOnlyLastMutation])`
The Trap constructor accepts the `trackOnlyLastMutation` argument (default `false`) indicating whether or not the mutations should be limited to one per property. If `trackOnlyLastMutation` is set to `true` value, any previous change to the trapped object is remove before applying the next value. Should the next value effectively restore the original state, no new mutations is created and the number of mutations is decreased.

### `commit`
Apply collected mutations (optionally filtered by a search parameter) to the target and reset the mutation list.

```ts
trap.commit({ target: myTarget }); // applies all collected mutations with target myTarget
trap.commit({ key: 'sample' });    // applies all collected mutations for key 'sample'
trap.commit();                     // applies all collected mutations
```

### `rollback`
Drop mutations (optionally filtered by a search parameter) so these will never be applied to the target.

```ts
trap.rollback({ target: myTarget }); // removes all collected mutations with target myTarget
trap.rollback({ key: 'sample' });    // removes all collected mutations for key 'sample'
trap.rollback();                     // removes all collected mutations
```

### `count`
As v2.0 of `Trap` removed the mutations collection from direct access, the `count` method allows for counting the number of mutations (optionally filtered by a search parameter).

```ts
trap.count({ target: myTarget }); // counts all mutations with target myTarget
trap.count({ key: 'sample' });    // counts all mutations for key 'sample'
trap.count();                     // counts all mutations
```

### Implemented Trap functions
Trap provides most of the Proxy handler methods which directly change object properties.

  - [`defineProperty`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/defineProperty); traps `Object.defineProperty` calls
  - [`deleteProperty`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/deleteProperty); traps property deletion
  - [`get`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get); traps property value getting
  - [`getOwnPropertyDescriptor`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor); traps `Object.getOwnPropertyDescriptor` calls
  - [`has`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/has); traps `<key> in <Object>` calls
  - [`ownKeys`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/ownKeys); traps `Object.keys` calls
  - [`set`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/set); traps property value setting


### Trap functions not implemented
The following functions are currently not implemented by the Trap module, if there is a need for them to be added, feel free to submit an issue or create a pull request.

  - [`apply`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/apply); traps method invocations
  - [`construct`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/construct); traps new instance creation
  - [`getPrototypeOf`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getPrototypeOf); traps `Object.getPrototypeOf` calls
  - [`isExtensible`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/isExtensible); traps `Object.isExtensible` calls
  - [`preventExtensions`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/preventExtensions); traps `Object.preventExtensions` calls
  - [`setPrototypeOf`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/setPrototypeOf); traps `Object.setPrototypeOf` calls


## Licence

MIT License

Copyright (c) 2017-2023 Rogier Spieker (Konfirm)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
