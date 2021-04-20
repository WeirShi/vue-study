class Vue {
  constructor(options) {
    // 1. 通过属性保存选项的数据
    this.$options = options || {}
    // 2. 把data中的属性注入到实例中，并转换成getter/setter
    this.$data = options.data || {}
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
    this._proxyData(this.$data)
    // 3. 调用observer对象监听数据变化
    new Observer(this.$data)
    // 4. 调用compiler对象解析指令、插值表达式
    new Compiler(this)
  }

  _proxyData(data) {
    // 遍历data中的所有属性
    Object.keys(data).forEach(key => {
      // 把data中的属性注入到Vue实例中
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key]
        },
        set(newVal) {
          if (data[key] === newVal) {
            return
          }
          data[key] = newVal
        }
      })
    })
  }
}