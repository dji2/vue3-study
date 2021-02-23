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