# Trap Module

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/4a1262f6063b47428c144ae57b0fc38a)](https://www.codacy.com/app/konfirm/node-trap?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=konfirm/node-trap&amp;utm_campaign=Badge_Grade)
[![Build Status](https://travis-ci.org/konfirm/node-trap.svg?branch=master)](https://travis-ci.org/konfirm/node-trap)

Provide traps for use as Proxy handler, allowing to keep track of changes and choose to commit or rollback changes

## Installation

```
$ npm install --save @konfirm/trap
```

## Usage
The Trap module is designed to handle and reflect Proxy manipulations to an object [Proxy](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy), during its handler assignment you can provide a Trap-instance or parts of it.

### Trap all mutations
```
//  include the Trap module
const Trap = require('@konfirm/trap');
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
Trap allows to keep track of changes within proxied objects, and exposes two methods besides the implemented [trap functions](https://github.com/konfirm/node-trap#implementedtrapfunctions).

### `commit`
Apply all mutations (since creation or last `commit` or `rollback`) to the proxied object and reset the mutation list.

### `rollback`
Drop all mutations so these will never be applied to the proxied object.

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

Copyright (c) 2017 Konfirm

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
