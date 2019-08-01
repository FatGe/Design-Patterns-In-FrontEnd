# Design Patterns In FE

## 创建型模式

### 工厂模式

工厂，是**构造方法**的抽象，用来实现不同的分配方案。它所涉及三类模式，简单工厂模式、工厂方法模式、抽象工厂模式本质上都是为了**实例化**。

#### 简单工厂模式（Simple Factory）

简单工厂模式也被称为**静态**工厂方法，它可以根据**参数的不同**来返回**不同类**的实例。

> 简单工厂模式就是**抽象了创建具体实例的过程**。

想象下，存在一个蛋糕厂，当你需要一个巧克力蛋糕时，它会创建一个巧克力蛋糕，同样，当你需要冰淇凌口味的，它就会返回一个冰淇淋蛋糕。也就是说这个工厂创建的蛋糕（实例）取决于你的口味（参数）。

```typescript
class CakeFactory {
    public static CakeFactory(cakeType: string): Cake {
        const size: number = 8;
        let cake = null;

        switch (cakeType) {
            case "choc": {
                cake = new ChocCake(size);
            }
            case "icecream": {
                const flavor: string = "vanilla";
                cake = new IcecreamCake(size, flavor);
            }
        }
        return cake;
    }
}
```

在实际应用简单工厂模式的时候，会定义**一类工厂**来负责实例的创建，而这些实例通常都具有**共同的父类**。就像 `ChocolateCake`、`IcecreamCake` 都是继承于 `Cake`。

##### 什么时候使用？

当你只需要传入相应的参数，就可以获取你所需要的实例，而无须知道其中逻辑以及具体细节。

例如在上述代码中，默认对 `chocolate` 以及 `icecream` 蛋糕的尺寸（`size`）做了限制。它代表的是，当**创建实例需要大量重复代码**时，可以考虑将其封装到简单工厂模式内。

还有，在创建 `icecream` 蛋糕时，对其口味（`flavor`）做了处理，这样就**解耦了实例的创建以及它所涉及的业务逻辑**。

##### 优劣势

- 优点：
  - 简单工厂模式直接接管了实例的创建，分割了实例创建以及创建细节，降低了耦合度；
  - 可以集中处理了创建实例所需要的大量重复代码。
- 缺点：
  - 当需要创建的实例过多时，简单工厂类内的逻辑就会过重，并且增加实例需要修改工厂类的判断逻辑，这一点与开闭原则是相违背的。

> 在[面向对象编程](https://baike.baidu.com/item/面向对象编程)领域中，**开闭原则**规定“*软件中的对象（类，模块，函数等等）应该对于扩展是开放的，但是对于修改是封闭的*”，这意味着一个实体是允许在不改变它的[源代码](https://baike.baidu.com/item/源代码)的前提下变更它的行为。

##### 实际应用

思考一个场景，如果你需要控制系统中所有 `Cake` 的生命周期，同时同类的 `Cake` 只能存在一个，你会怎么处理？

在简单工厂模式下，这个需求就非常容易实现，由于所有实例都是由 `CakeFactory` 创建的，所以只需要在其中添加一层缓存既可，具体事项如下

```typescript
class CakeFactory {
    protected static cache: Map<string, Cake> = new Map();
    public static CakeFactory(cakeType: string): Cake {
        const size: number = 8;
        let cake: Cake = this.cache.get(cakeType)

        if (cake) return cake
        switch (cakeType) {
            case "choc": {
                cake = new ChocCake(size);
            }
            case "icecream": {
                const flavor: string = "vanilla";
                cake = new IcecreamCake(size, flavor);
            }
        }

        this.cache.set(cakeType, cake);
        return cake;
    }
}
```

由于工厂函数集中处理了创建实例的逻辑，使得创建的入口只有一个，只需要添加一个 Cache，每次创建之前先去查询下。同时如果需要手动注销变量的生命周期，也只需要在添加相应的静态方法即可。

那么在前端框架中，是否有使用这种设计模式的么？以 VUE 为例，无论你使用的是 .vue 的单文件组件的形式还是说是 `functional component` 都会被实例化 Vnode，然后在被渲染为 DOM。

那么生成 Vnode 的过程中，就涉及到了 [`create-component`](https://github.com/vuejs/vue/blob/dev/src/core/vdom/create-component.js) ，它主要完成接收相关组件的配置，返回对应的 Vnode 实例的任务（实际上可以视作 Vnode Factory）。

```typescript
function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  // cache 相应的 baseCtor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor)
  }
  // input Component 的相关 options
  const name = Ctor.options.name || tag
  // 实例化 Vnode
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )

  return vnode
}
```

我们可以将 `createComponent` 视为简单工厂模式变形的应用。用来处理实例化 Vnode 过程中包含着大量的逻辑，例如 `Ctor` 包含着 `Class<Component> | Function | Object | void` 四种类型，需要分别对其进行处理。

同时在 `baseCtor.extend` 中完成缓存操作（`baseCtor.extend` 本质上 `Vue.extend`），具体如下

```js
Vue.extend = function (extendOptions: Object): Function {
  extendOptions = extendOptions || {}
  const SuperId = Super.cid
  // get cache
  if (cachedCtors[SuperId]) {
    return cachedCtors[SuperId]
  }
  // ...
  // cache constructor
  cachedCtors[SuperId] = Sub
  return Sub
}
```

可以看出，`create-component` 的整体逻辑与示例 `CakeFactory` 大体相同，只是实现上略有差异。

##### 总结

简单工厂模式最大的优点在于分离了实例化和实例使用，对实例化的过程集中处理，但是如果需要如果实例较多时，工厂方法代码将会非常复杂。

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

##### 什么时候使用？

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

#### 抽象工厂模式（Abstract Factory）

之前介绍工厂方法模式的时候，介绍它的缺点在于需要实例的越多，相应的子类工厂方法也会越多。那有没有一种模式可以将实例聚合在同一个工厂模式中？

抽象工厂模式（Abstract Factory Pattern）能够解决这个问题。

> 抽象工厂模式能够提供一个创建一系列相关或相互依赖对象的接口，而无须指定它们具体的类。抽象工厂模式又称为 Kit模式。（来源设计模式）

您可能会想起来在工厂方法模式实例中介绍的工厂方法模式的变形也解决了这个问题，为什么要引入抽象工厂模式呢？

工厂方法模式针对的是**继承于同一父类的实例**，可以在结构上将其视为同一个等级，而抽象工厂模式则需要面对多个**继承于不同父类但相互关联的实例**。

> 抽象工厂模式（Abstract Factory Pattern）：提供一个创建一系列相关或相互依赖对象的接口，而无须指定它们具体的类。抽象工厂模式又称为 Kit 模式。

之前已经创建了 `Cake`，相应的应该存在 `Pack`，它们在数量上应该是一一对应的，且具有一定的关联性（可以视为同一产品族）。

> **产品族**：在抽象工厂模式中，产品族是指由同一个工厂生产的，位于不同产品等级结构中的一组产品。
>
> ----设计模式

```typescript
class Pack {
    private color: string;

    constructor(color: string) {
        this.color = color;
    }
}
```

同时实现抽象工厂类

```typescript
abstract class Factory {
    public abstract produceCake(): Cake;
    public abstract producePack(): Pack;
}
```

考虑具体 `Birthday ` 的场景可实现 `BirthdayCakeFactory`

```typescript
class BirthdayCakeFactory extends Factory {
    public produceCake(): BirthdayCake {
        return new BirthdayCake();
    }
    public producePack(): BirthdayCakePack {
        return new BirthdayCakePack();
    }
}
```

如果使用之前的工厂方法模式，你可能需要创建相关的 `CakeFactory` 以及 `PackFactory` 来处理这种情景。

##### 什么时候使用？

当你涉及到**不同的实例**，但它们之前**存在一定的关联需要联合使用**时，可以优先考虑抽象工厂设计模式。

##### 优劣势

- 优点：
  - 不同工厂之间虽然都实现了抽象工厂中定义的公共接口，但是每个具体工厂将创建不同实例的创建逻辑维护在了内部，这就使得抽象工厂模式可以实现高内聚低耦合的设计目的。
- 缺点：
  - 不难看出，如果需要增加新的产等级结构会导致抽象工厂的子类都需要进行更改。

##### 实际场景

在前端业务中，抽象工厂模式使用的场景太多了。例如当你需要实现一套通用组件库需要兼顾不同的游览器时，可以选择通过抽象工厂模式来对功能、逻辑进行抽象，在利用不同的工厂函数去处理。

##### 总结

抽象工厂模式可以视作多个工厂方法模式的组合，来处理不同等级产品的问题。

> 当抽象工厂模式中每一个具体工厂类只创建同一等级结构时，抽象工厂模式退化成工厂方法模式。
>
> 而当工厂方法模式中抽象工厂与具体工厂合并，提供一个统一的工厂来创建产品对象，并将创建对象的工厂方法设计为静态方法时，工厂方法模式退化成简单工厂模式。
>
> ----图解设计模式
