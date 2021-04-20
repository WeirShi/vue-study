class Dep {
  constructor() {
    // 存储所有的Watcher对象
    this.subs = []
  }

  // 添加Watcher
  addSub(sub) {
    // 判断sub对象是否为Watcher
    if (sub && sub.update) {
      this.subs.push(sub)
    }
  }

  // 发送通知
  notify() {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}