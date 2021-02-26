let product = { price: 5, quantity: 2 }

let proxiedProduct = new Proxy(product, {
  get(target, key, receiver) {
    console.log('get is called, key is ', key)

    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    console.log('set key is ', key, ', value is ', value)
    return Reflect.set(target, key, value, receiver)
  }
})

proxiedProduct.quantity = 4

console.log(proxiedProduct.quantity)

// 为什么使用Reflect？

// （1） 将 Object 对象的一些明显属于语言内部的方法（比如 Object.defineProperty ），放到 Reflect 对象上。现阶段，某些方法同时在 Object 和 Reflect 对象上部署，未来的新方法将只部署在 Reflect 对象上。也就是说，从 Reflect 对象上可以拿到语言内部的方法。

// （2）修改某些 Object 方法的返回结果，让其变得更合理。比如，Object.defineProperty(obj, name, desc) 在无法定义属性时，会抛出一个错误，定义成功时返回修改后的对象。而 Reflect.defineProperty(obj, name, desc) 在定义属性成功时返回 true ，失败时返回 false。

// （3）让 Object 操作都变成函数行为。某些 Object 操作是命令式，比如 name in obj 和 delete obj[name]，而 Reflect.has(obj, name) 和 Reflect.deleteProperty(obj, name) 让它们变成了函数行为。

// （4）Reflect 对象的方法与 Proxy 对象的方法一 一对应，只要是 Proxy 对象的方法，就能在 Reflect对象上找到对应的方法。这就让 Proxy 对象可以方便地调用对应的 Reflect 方法，完成默认行为，作为修改行为的基础。也就是说，不管 Proxy 怎么修改默认行为，总可以在 Reflect 上获取默认行为。