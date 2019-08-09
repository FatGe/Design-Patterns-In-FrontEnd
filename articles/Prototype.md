# Design Patterns In FE -- 原型模式

### 原型模式

原型模式（Singleton Pattern）的特点在于“复制”，通过复制一个已经存在的实例来返回新的实例，而不是新建实例。

> 原型模式多用于创建复杂的或者耗时的实例，因为这种情况下，复制一个已经存在的实例使程序运行更高效。

相比与构造函数重新创建一个实例相比，原型模式期望利用**“复制”实例**来保证性能。

```typescript
import {Cloneable, CloneableArgs} from "cloneable-ts";

interface IPrototypeArgs {
    readonly name: string;
    readonly age: number;
}

class Prototype extends Cloneable<{}> implements CloneableArgs<IPrototypeArgs> {
    public readonly name: string;
    public readonly age: number;

    constructor(args) {
        super(args);
    }
}

const subjectA = new Prototype({ 
    name: "Alice", 
    age: 28,
    gender: 'male'
});
const subjectB = subjectA.clone({ name: "Bob" });

console.log(subjectA.name); // Alice
console.log(subjectB.name); // Bob
console.log(subjectB.age); // 28
```

借助 cloneable-ts 来实现一个 Prototype 它有一个 `clone` 方法，用于返回复制的实例。

#### **什么时候使用**

除了之前提到的一个类实例化的时候会消耗很多性能的时候，可以考虑使用原型模式之外，我们还可以考虑一种情景，一个类的实例只是几个不同状态的组合，例如上述代码中的 `subjectA` 以及 `subjectB`

> subjectA 由 name、age、gender 组成，而 clone subjectB 时可以复用状态 age、gender。

当然在实际开发中，可能需要结合下之前介绍的简单工厂模式

```typescript
class PrototypeFactory {
    public static produce(type: string): Prototype {
        switch (type) {
            case "subjectA": {
                return this.subject.clone();
            }
            case "subjectB": {
                return this.subject.clone({ name: "Bob" });
            }
        }
    }
    protected static subject: Prototype = 
    	new Prototype({ name: "Alice", age: 28 });
}
```

#### **优劣势**

* 优势：
  * 性能较为优秀；
  * 更为灵活，可以动态的创建、删除原型。
* 劣势：
  * 每一个 Prototype 都需要实现 Clone 操作，如果是已经存在的类，则需要对其内部进行修改。

#### 实际应用

在 JavaScript 中，对象之间的继承是通过一个 prototype 属性来完成的，它是一个指针，指向一个对象包含特定类型的所有实例**共享**的属性和方法。

在 Javascript 的 prototype 中有一个关键词**共享**，意味着所有实例的 `[[prototype]]` 都指向一个原型地址，举个简单的例子

```js
const person = {
    name: "Matthew",
    printIntroduction: function() {
        console.log(`My name is ${this.name}.`)
    },
}

const personA = Object.create(person);
const personB = Object.create(person);

personA.printIntroduction(); // My name is Matthew
personB.printIntroduction(); // My name is Matthew

person.name = "Mike";

personA.printIntroduction(); // My name is Mike
personB.printIntroduction(); // My name is Mike
```

很明显一点，在 Javascript 的实例是通过**浅拷贝**来实现所有 `__proto__` 引用同一个 `prototype` 的地址，大体也是原型模式 clone 的一种实现。具体如下

```js
Object.create = function (proto) {
    
    function F() {}
    F.prototype = proto;

    return new F();
};
```

其中，通过对 `F.prototype = proto` 来完成共享实例。 

#### **总结**

原型模式需要你构建一个共享类，然后可以 clone 实例，在这个过程中可以修正一些信息（深拷贝）。它与之前介绍的工厂方法模式类似，都需要在当前类维护一个指定接口，原型模式是 `clone`，工厂方法模式则是 `factoryMethod`。