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

function ref(v) {
  let raw = v
  const r = {
    get value() {
      track(r, 'value')
      return raw
    },
    set value(newVal) {
      raw = newVal
      if (newVal === raw) return
      raw = newVal
      trigger(r, 'value')
    }
  }
  
  return r
}

function computed(getter) {
  let result = ref()

  effect(() => (result.value = getter()))

  return result
}

let product = reactive({
  price: 5,
  quantity: 2
})

let salePrice = computed(() => {
  return product.price * 0.9
})


let total = computed(() => {
  return salePrice.value * product.quantity
})

effect(() => {
  total = salePrice.value * product.quantity
})

effect(() => {
  salePrice.value = product.price * 0.9
})
