class Compiler {
  constructor(vm) {
    this.el = vm.$el
    // vue实例
    this.vm = vm

    this.compile(this.el)
  }

  // 编译模板 处理文本节点和元素节点
  compile(el) {
    console.log(el)
    if (!el) {
      return
    }
    // 伪数组
    let childNodes = el.childNodes
    Array.from(childNodes).forEach(node => {
      // 处理文本节点
      if (this.isTextNode(node)) {
        this.compileText(node)
      }
      // 处理元素节点
      if (this.isElementNode(node)) {
        this.compileElement(node)
      }

      // 判断node是否有子节点，如果有需要递归调用compile
      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })
  }

  // 编译元素节点处理指令  这里只模拟 v-text v-model
  compileElement(node) {
    // console.log(node.attributes)
    // 遍历所有的属性节点
    
    Array.from(node.attributes).forEach(attr => {
      // 判断是否为指令
      let attrName = attr.name
      if (this.isDirective(attrName)) {
        // v-text -> text v-model -> model
        attrName = attrName.substr(2)
        let key = attr.value
        this.update(node, key, attrName)
      }
    })

  }

  update(node, key, attrName) {
    let updateFn = this[`${attrName}Updater`]
    updateFn && updateFn.call(this, node, this.vm[key], key)
  }

  // 处理v-text
  textUpdater(node, value, key) {
    node.textContent = value
    console.log(this)
    // 此处this.vm无法访问, updateFn的this指向问题
    new Watcher(this.vm, key, newVal => {
      node.textContent = newVal
    })
  }

  // 处理v-model
  modelUpdater(node, value, key) {
    node.value = value
    new Watcher(this.vm, key, newVal => {
      node.value = newVal
    })

    // 双向绑定
    node.addEventListener('input', () => {
      this.vm[key] = node.value
    })
  }

  // 处理文本节点，插值表达式
  compileText(node) {
    // console.dir(node)
    // {{ msg }} 使用正则来匹配
    let reg = /\{\{(.+?)\}\}/
    // 文本节点内容
    let value = node.textContent
    if (reg.test(value)) {
      // 属性名
      let key = RegExp.$1.trim()
      node.textContent = value.replace(reg, this.vm[key])

      // 创建Watcher对象，数据变化时更新View视图
      new Watcher(this.vm, key, newVal => {
        node.textContent = newVal
      })
    }
  }

  // 判断元素属性是否是指令 v-xxx
  isDirective(attrName) {
    return attrName.startsWith('v-')
  }

  // 判断是否为文本节点 nodeType === 3 文本节点
  isTextNode(node) {
    return node.nodeType === 3
  }

  // 判断是否为元素节点  nodeType === 1 元素节点
  isElementNode(node) {
    return node.nodeType === 1
  }
}