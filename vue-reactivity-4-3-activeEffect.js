const targetMap = new WeakMap()

let activeEffect = null

function effect(etf) {
  activeEffect = etf
  activeEffect()
  activeEffect = null
}

function track(target, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target)

    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }

    let dep = depsMap.get(key)

    if (!dep) {
      depsMap.set(key, (dep = new Set()))
    }

    dep.add(activeEffect)
  }
  
}

function trigger(target, key) {
  const depsMap = targetMap.get(target)

  if (!depsMap) {
    return
  }

  let dep = depsMap.get(key)

  if (dep) {
    dep.forEach(effect => {
      effect()
    })
  }
}

function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      console.log('get is called, key is ', key)
      const result = Reflect.get(target, key, receiver)
      track(target, key)
  
      return result
    },
    set(target, key, value, receiver) {
      console.log('set key is ', key, ', value is ', value)
      const oldValue = target[key]
      const result = Reflect.set(target, key, value, receiver)

      if (result !== oldValue) {
        trigger(target, key)
      }
      return result
    }
  }

  return new Proxy(target, handler)
}

let product = reactive({
  price: 5,
  quantity: 2
})

let total = 0
let salePrice = 0

effect(() => {
  total = product.price * product.quantity
})

effect(() => {
  salePrice = product.price * 0.9
})

// product.quantity = 4

// product.price = 10
