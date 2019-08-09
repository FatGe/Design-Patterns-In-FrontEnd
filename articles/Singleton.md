# Design Patterns In FE -- 单例模式

### 单例模式

单例模式（Singleton Pattern）本质上是在**全局**维护的一个**唯一**的类的实例。

> 单例模式，一个类仅有一个实例，并提供一个访问它的全局访问点。

通过它的定义可以看出实现单例模式必须满足以下两点：

* 单例模式在当前内存中只能存在一个实例；
* 这个实例必须在全局易于访问。

有一个很好的例子来介绍单例模式，在 win 系统中的开始菜单，它是一个很典型的单例模式。一个系统中，仅有一个开始菜单（一个实例），且全局都可以对它进行访问。首先我们创建一个 Menu 类

```typescript
class Menu {
    // 提供唯一的工厂函数返回一个实例
    public static getInstance(): Menu {
        return Menu.instance;
    }
    private static instance = new Menu();
	// 防止其他处 new Menu()
    private constructor() {}
}
```

同时在实现全局访问点

```typescript
declare var global: any;
declare var window: Window;

let root: any = null;

root = typeof global === "object" ? global : window;
root.Menu = Menu.getInstance();
```

##### **什么时候使用**

当在一个系统要求一个类**有且仅有一个**实例，如果出现多个就会出现异常，可以采用单例模式。

##### **优劣势**

- 优点：
  - 由于在全局只维护了一个实例，所以可以对其进行严格的控制；
  - 由于单例模式在内存中只有一个实例，减少了内存开支以及性能开销。
- 缺点：
  - 单例模式不满足单一职责原则，同时不好扩展。如果需要添加新的接口，只能修改代码。

##### 实际应用

单例模式在前端的应用，最为典型的莫过于 jQuery。通过源码来看看它是如何实现单例模式的。

* 全局可访问点，由于 jQuery 的场景是游览器，所以利用 `window` 对象

  ```js
  define(['../core'], function(jQuery, noGlobal) {
      'use strict'
  
      var // Map over jQuery in case of overwrite
          _jQuery = window.jQuery,
          // Map over the $ in case of overwrite
          _$ = window.$
  
      jQuery.noConflict = function(deep) {
          if (window.$ === jQuery) {
              window.$ = _$
          }
  
          if (deep && window.jQuery === jQuery) {
              window.jQuery = _jQuery
          }
  
          return jQuery
      }
  
      // Expose jQuery and $ identifiers, even in AMD
      // (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
      // and CommonJS for browser emulators (#13566)
      if (!noGlobal) {
          window.jQuery = window.$ = jQuery
      }
  })
  
  ```

  可以看出来，jQuery 在 window 对象上绑定 `$` 以及 `jQuery` 来提供全局的接口；

* 实现大量的静态方法，jQuery 内部维护了大量的工具函数，并通过 `$` 暴露出来

  ```js
  jQuery.fn.delay = function(time, type) {
      time = jQuery.fx ? jQuery.fx.speeds[time] 					|| time : time
      type = type || 'fx'
  
      return this.queue(type, function(next, hooks) {
          var timeout = window.setTimeout(next, time)
          hooks.stop = function() {
              window.clearTimeout(timeout)
          }
      })
  }
  ```

  例如上述实现了一个 `delay` 函数，用于延时。

前端的很多工具库都是以单例模式实现的，例如 lodash.js、moment.js 等等

##### **总结**

单例模式是一种比较简单的单例模式，它的主要优点在于提供了对唯一实例的受控访问并可以节约系统资源，但是也使得它因为缺少抽象层而难以扩展。