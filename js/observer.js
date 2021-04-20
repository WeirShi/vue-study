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
  defineReactive(data, key, value) {
    // 保存this指向问题
    const self = this
    // 如果value是对象，递归调用将value中的属性转成响应式数据
    this.walk(value)
    // 创建dep对象 收集依赖并发送通知
    let dep = new Dep()
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 当外部有访问属性的动作时
        // 此处就形成了一个闭包
        
        // 收集依赖 target中存的是 Watcher 对象
        Dep.target && dep.addSub(Dep.target)
        return value
      },
      set(newVal) {
        if (newVal === value) {
          return
        }
        value = newVal
        // 当数据被赋值为对象时，也需要递归调用将新数据中的属性转成响应式数据
        self.walk(newVal)
        // 当数据变化时发送通知
        dep.notify()
      }
    })
  }
}