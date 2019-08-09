# Design Patterns In FE

### 生成器模式

生成器模式是一种对象构建模式，它可以将**复杂对象的建造过程**抽象出来（抽象类别）。

> 将一个负责对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。

在介绍生成器模式时，常听到一句话构建器模式的目的是**找到伸缩构造器反模式的解决方案**。那么什么是伸缩构造器反模式？

看下面这个例子，主要关注构造函数中的逻辑

```typescript
class Burger {
    protected size: number;
    protected cheese: boolean;
    protected pepperoni: boolean;
    protected lettuce: boolean;
    protected tomato: boolean;

    constructor({ size = 4, cheese = true, pepperoni = true, lettuce = true, tomato = true }: { size?: number; cheese?: boolean; pepperoni?: boolean; lettuce?: boolean; tomato?: boolean; } = {}) {
        this.size = size;
        this.cheese = cheese;
        this.pepperoni = pepperoni;
        this.lettuce = lettuce;
        this.tomato = tomato;
    }
}
```

可以看出在 Burger 的 `constructor` 中，存在大量的参数，使得其逻辑不清晰，如果需要添加新属性时，面条型代码会越来越长，这就是**伸缩构造器反模式**。

生成器模式需要做的就是将 `constructor` 中的构造过程分离与细化，将创建该实例的内部表示并定义它的装配过程封装到 `BurgerBuilder` 中，具体实现如下

```typescript
class BurgerBuilder {
    protected burger: Burger;

    public createNewBurgerProduct(size: number = 4): void {
        this.burger = new Burger(size);
    }
    public addCheese(): BurgerBuilder {
        this.burger.setCheese(true);
        return this;
    }
    // ... 同样还有 addPepperoni、addLettuce、addTomato 等
    public build(): Burger {
        return this.burger;
    }
}
```

而 `Burger` 只需要提供相应的接口即可

```typescript
class Burger {
    protected size: number;
    protected cheese: boolean = false;
    protected pepperoni: boolean = false;
    protected lettuce: boolean = false;
    protected tomato: boolean = false;

    constructor(size: number) {
        this.size = size;
    }

    public setCheese(cheese: boolean): void { 
        this.cheese = cheese; 
    }
    // ...setPepperoni、setLettuce、setTomato 接口
}
```

**Burger**、**BurgerBuilder** 对应的职责分别是 **Product** 以及 **Builder**

> - Product：表示为构造的复杂对象；
> - Builder：为创建一个 Product 对象的各个部件指定的抽象接口。

在实际创建复杂实例的时候，只需要**一步步的构建它的细节**即可，例如

```typescript
const builder: BurgerBuilder = new BurgerBuilder();

builder.createNewBurgerProduct();
builder.addCheese();
builder.addPepperoni();
builder.build(); // Burger {...}
```

在实际使用中，常常会存在一个 **Director**，用于使用 **BurgerBuilder**，也就是将上述的构建的**顺序**进一步封装。

##### **什么时候使用**

可以看出生成器模式的关键在于能够对构造过程进行**更加精细的控制**，特别是如果   **Product** 非常复杂，或者构造的顺序会对结果产生了不同影响时，采用生成器模式非常合适。

##### **优劣势**

- 优点：
  - 每一个 **Builder** 都相对独立，而与其他无关，因此可以很方便地替换、扩展；
  - **可以更加精细地控制构建过程** ，分解复杂步骤，使得整个过程清晰明了。
- 缺点：
  - 生成器模式适用的场景较少，需要类似的 **Product** 且构建过程非常复杂。

##### **总结**

区别于之前的工厂模式，生成者模式是一步步构建，而工厂函数则是一步到位。具象一点理解的话，生成者模式可以理解为组装零件工厂，工厂模式为生产零件工厂。
