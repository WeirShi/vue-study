class Watcher {
  constructor(vm, key, callback) {
    this.vm = vm
    // data中的属性名 key
    this.key = key
    // 回调函数负责更新View视图
    this.cb = callback

    // 把Watcher对象记录到Dep中的target
    // 触发get方法，在get中调用addSub
    Dep.target = this


    // 保存旧值  访问属性就会触发get方法
    this.oldVal = this.vm[this.key]

    // 最后置空，防止重复触发
    Dep.target = null
  }

  // 当数据发生变化时更新View视图
  update() {
    let newVal = this.vm[this.key]
    if (this.oldVal === newVal) {
      return
    }
    this.cb(newVal)
  }
}