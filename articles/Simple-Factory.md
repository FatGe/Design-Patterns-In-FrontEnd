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

##### 什么时候使用

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
