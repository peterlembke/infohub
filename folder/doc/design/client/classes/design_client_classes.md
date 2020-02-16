# Design Client - Classes
Design decisions when creating the Infohub Javascript client.

## Classes
ES6, also known as ECMAScript2015, introduced classes.
Infohub design has evolved since 2010. Back then there were no classes.
But we can change that if classes are good enough in Javascript.

Read more at [W3Schools](https://www.w3schools.com/js/js_classes.asp) and at [sitepoint](https://www.sitepoint.com/javascript-private-class-fields/). 

## Requirements of a class
* A class can inherit the Base class
* A class can have private properties
* A class can have public and private methods
* You can override a function in the Base class  
* The syntax is clear and logical

### A class need to inherit the Base class
This requirement is fulfilled.
```javascript
class Human extends Animal {}
```

### A class can have private properties
The brand new ES2019 allow you to have private properties in a class. You can put a # in front of a property to make it private.
But it is way to early to use. See [CanIUse](https://caniuse.com/#search=private).
The syntax looks like this:
```javascript
class MyClass {
  // private property
  #x = 0;
}
```

### A class can have public and private methods
Public methods were introduced in ES6. 
The brand new ES2019 do not allow # to be used on methods. There is no way to have private methods.
There is a proposal to use this syntax in the future:
```javascript
class MyClass {
  // private method (can only be called within the class)
  #incX() {
    this.#x = this.#x + 1;
  }
}
```

### You can override a function in the Base class
Yes that is possible. You can even call the parent function.
```javascript
class Human extends Animal {
  // override Animal.speak
  speak(to) {
    super.speak();
    if (to) {
        console.log("to = " + to);
    }
  }
}
```

## Conclusion
The class concept in Javascript is crude and lack basic features. It is also not implemented in all common browsers.
The use of # is ugly but that is besides the point.

If the class concept evolve in the future and all criteria are met then it would be possible to support classes in new plugins.

For now I will continue with the current plugin structure. 

# License
This documentation is copyright (C) 2020 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  

Created 2020-02-15 by Peter Lembke  
Updated 2020-02-15 by Peter Lembke  
