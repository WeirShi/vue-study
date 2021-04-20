class Observer {
  constructor(data) {
    this.walk(data)
  }

  // 遍历data所有属性
  walk(data) {
    // 判断data是否为空值，对象
    // 如果是对象，遍历
    if (!data || typeof data !== 'object') {
      return
    }
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }

  // 定义响应式数据, 把data中的数据属性转成响应式数据
  // 
  defineReactive(data, key, value) {
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get() {
        return value
      },
      set(newVal) {
        if (newVal === value) {
          return
        }
        value = newVal
        // 当数据变化时发送通知
      }
    })
  }
}