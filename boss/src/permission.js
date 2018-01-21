import { getToken } from '@/utils/auth' // 验权
import router from './router'

// register global progress.
const whiteList = ['/', '/authredirect']// 不重定向白名单
router.beforeEach((to, from, next) => {
  debugger
  if (getToken()) { // 判断是否有token
    router.addRoutes(to.path)
    return
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/') // 否则全部重定向到登录页
      // router在hash模式下 手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
    }
  }
})

router.afterEach(() => {

})

