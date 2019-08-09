#### 工厂方法模式（Factory Method Pattern）

在简单工厂模式中，提到两点：

- 需要利用参数明确，工厂需要创建的实例类型；
- 如果引入新的实例，需要修改工厂的逻辑，不符合开闭原则。

工厂方法模式（Factory Method Pattern）针对以上两个点进行了优化。在工厂方法模式中，会有一个**工厂父类**用于**定义创建实例的接口**，让其**子类决定具体的实例化**。

> 工厂方法模式就是将一个类的实例化延迟到其子类。
>
> ----设计模式

看起来**子类的工厂方法**与其**构造函数**非常的类似。它又称为工厂模式，也叫虚拟构造器（Virtual Constructor）模式或者多态工厂（Polymorphic Factory）模式。

之前在简单工厂模式中实现的一个 `CakeFactory` 类用于创建 `Cake`，其实它可以视为 `chocCakeCakeFactory` 、`icecreamCakeFactory` 的组合。

![工厂方法配图](https://github.com/FatGe/Design-Patterns-In-FrontEnd/blob/master/static/factory-method.png)

那么现在将 `Cake Factory` 抽象为父类，同时定义一个 `produce` 的接口，用于生产 `Cake`

```typescript
abstract class CakeFactory {
    public abstract produce(): Cake;
}
```

此时抽象类 `CakeFactory` 与 `Cake` 对应，但是 `CakeFactory` 的 `produce` 接口只是说明会创建一个 `Cake`，但具体并不清楚**具体是哪一个**。然后实现具体的子类`chocCakeCakeFactory` 、`icecreamCakeFactory` 

```typescript
class ChocCakeFactory extends CakeFactory {
    public produce(): ChocolateCake {
        return new ChocolateCake(4);
    }
}
class IcecreamChef extends CakeFactory {
    public produce(): IcecreamCake {
        return new IcecreamCake(8, "vanilla");
    }
}
```

此时在对应的类中实现了 `produce` 接口，以及创建的具体实例。所以可以将 `produce` 称为一个工厂方法（Factory Method Pattern），因为它实现了创建具体实例。

与之前的简单工厂模式对比，可以发现它本质上是将聚合的工厂模式中的逻辑分离到各个子类中。优化了之前提到的简单工厂模式的缺陷。

##### 什么时候使用

当你需要由它的子类来创建具体实例的时候，并且希望在对应子类的工厂方法中维护一些局部逻辑的时候，可以考虑使用工厂方法模式。

例如在上述子类 `ChocCakeFactory` 中，工厂函数 `produce` 用于实例化相应的 `ChocCake` ，并在函数内部维护了默认逻辑（`Cake` 的尺寸）。

##### 优劣势

- 优点：
  - 多态性设计是工厂方法模式的关键，它能够使工厂可以创建不同的实例，而如何创建这个逻辑也被完全封装在具体工厂方法的内部；
  - 如果需要加添加新的实例时，无须修改符类或者其他具体工厂，而只要添加相应的子类就好，这样完全符合“开闭原则”。
- 缺点：
  - 由于工厂方法模式将具体实例与子类一一对应，使得类的个数将成对增加，这样就会有更多的类需要编译和运行，会带来一些额外的开销。

##### 实际应用

虽然工厂方法模式的核心是**允许子类创建对应实例**，但是有时候也会不使用多态性来实现，例如

```js
class SubCake extends Cake {
    public static pruduceFromChocFactory(size: number): SubCake {
        return new SubCake("choc", size);
    }
    public static pruduceFromIcecreamFactory(size: number): SubCake {
        return new SubCake("icecream", size);
    }

    private size: number;

    constructor(material: string, size: number) {
        super(material);
        this.size = size;
    }
}
```

利用 `pruduceFromChocFactory`、`pruduceFromIcecreamFactory` 来实现本应该是重载构造函数的功能，代码语义更加的清晰明了。

在实际中，我们以 VUE 为例，它在实现状态变化检测、计算属性、侦听属性时，是通过 `new Watcher(...)` 来完成的。

```typescript
export default class Watcher {
  // ...

  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    this.vm = vm
    // ...
    // options
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
      this.before = options.before
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb
    this.id = ++uid // uid for batching
    this.active = true
    this.dirty = this.lazy // for lazy watchers
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.expression = process.env.NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''
    // ...
  }
  // ...
}
```

从 Watcher 的构造函数中可以看出来，它存在非常多的 `options` 处理，那么是否可以是变形的工厂模式来优化这段代码呢？可以将它写成如下形式，进一步的分离构造函数中的状态处理逻辑

```typescript
class Watcher {
    public static usrWatcher(...): Watcher {
        return new Watcher(...);
    }
    public static computedWatcher(...): Watcher {
        return new Watcher(...);
    }
    public static watchWatcher(...): Watcher {
        return new Watcher(...);
    }
    // ...
}

```

##### 总结

本质上，我们可以将工厂方法模式视为具备**多态性**的简单工厂模式，它利用了面向对象的多态性，将工厂方法的核心维护在相关的子类中。所以，这种模式具备更容易扩展，更加灵活。
