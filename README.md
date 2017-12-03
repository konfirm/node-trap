# Trap Module

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
Trap provides most of the Proxy handler methods which directly change object properties.

### Implemented
 [`defineProperty`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/defineProperty); traps `Object.defineProperty` calls
 [`deleteProperty`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/deleteProperty); traps property deletion
 [`get`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get); traps property value getting
 [`getOwnPropertyDescriptor`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor); traps `Object.getOwnPropertyDescriptor` calls
 [`has`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/has); traps `<key> in <Object>` calls
 [`ownKeys`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/ownKeys); traps `Object.keys` calls
 [`set`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/set); traps property value setting

### Not implemented
 [`apply`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/apply); traps method invocations
 [`construct`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/construct); traps new instance creation
 [`getPrototypeOf`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getPrototypeOf); traps `Object.getPrototypeOf` calls
 [`isExtensible`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/isExtensible); traps `Object.isExtensible` calls
 [`preventExtensions`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/preventExtensions); traps `Object.preventExtensions` calls
 [`setPrototypeOf`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/setPrototypeOf); traps `Object.setPrototypeOf` calls


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
