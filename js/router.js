// 定义一个全局变量存储Vue实例
let _Vue = null

class VueRouter {

  static install(Vue) {
    // 1. 判断当前插件是否被安装
    if (VueRouter.install.installed) {
      return
    }
    VueRouter.install.installed = true
    // 2. 把Vue构造函数记录到全局变量
    _Vue = Vue
    // 3. 把创建Vue实例时候传入的router对象注入到Vue实例上
    // 混入
    _Vue.mixin({
      beforeCreate() {
        // Vue实例中存在router对象才进行挂载， 组件实例不挂载$router
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router
          // 调用初始化
          this.$options.router.init()
        }
      }
    })
  }

  // 构造函数
  constructor(options) {
    this.options = options
    this.routerMap = {}
    // data是一个响应式的对象 Vue.observable()
    this.data = _Vue.observable({
      current: '/'
    })
  }

  init() {
    this.createRouteMap()
    this.initComponents(_Vue)
  }

  // createRouteMap
  // 遍历router规则，把路由规则解析成k-v的形式，存到routeMap中
  createRouteMap() {
    this.options.routes.forEach(route => {
      this.routerMap[route.path] = route.component
    })
  }

  // initComponents  实现router-link router-view组件
  // 这里使用Vue.component方法给Vue实例注册router-link、router-view组件
  // 这里创建组件的时候不能使用template模板, 因为在vue-cli中使用的是运行时版本的Vue，是没有编译器将template模板编译成vDom
  // 所以只能使用render函数
  // 或者修改vue-cli中配置，将使用运行版本的Vue改成带有编译器的运行时Vue版本
  // 在vue-config.js中修改runtimeCompiler: true即可
  initComponents(Vue) {
    Vue.component('router-link', {
      props: {
        to: String
      },
      // template: '<a :href="to"><slot></slot></a>'
      // Vue实例会传入一个h函数
      render(h) {
        return h(
          'a', // a标签
          {
            // a标签的href属性 history模式 this.to，hash模式 `#${this.to}`
            attrs: { href: this.to },
            // 注册事件
            on: {
              click: this.clickHandler
            }
          },
          [this.$slots.default] // slot插槽
        )
      },
      methods: {
        clickHandler(e) {
          history.pushState({}, '', this.to)
          // 修改当前url地址 加载组件
          this.$router.data.current = this.to
          // 阻止默认事件行为
          e.preventDefault()
        }
      }
    })

    const self = this
    Vue.component('router-view', {
      render(h) {
        // 通过 this.data.current 获取当前路由地址
        // 在通过routerMap中找到对应地址的路由组件
        // 最后通过h函数将路由组件转成vDom并返回
        const comp = self.routerMap[self.data.current]
        return h(comp)
      }
    })
  }
}