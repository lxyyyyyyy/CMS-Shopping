//引入登录，退出登录，获取用户信息的接口函数
import { login, logout, getInfo } from '@/api/user'
//引入获取token，设置token，删除token
import { getToken, setToken, removeToken } from '@/utils/auth'
//路由模块当中重置路由的方法
import { resetRouter, asyncRoutes, constantRoutes, anyRoutes } from '@/router'
import router from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    //用户菜单权限标记
    routes: [],
    //用户按钮权限标记
    buttons: [],
    //用户角色信息
    roles: [],
    //项目中已有的路由，与服务器返回的标记信息进行对比之后，最终需要展示的路由
    resultAsyncRoutes: [],
    //每个用户展示的所有路由：包括权限路由，常量路由，any路由
    resultAllRoutes:[],
  }
}

const state = getDefaultState()

const mutations = {
  //重置state的方法
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  //登录成功以后存储token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  //存储用户信息
  SET_USERINFO: (state, userInfo) => {
    //存储用户名
    state.name = userInfo.name;
    //存储用户头像
    state.avatar = userInfo.avater;
    //菜单权限标记
    state.routes = userInfo.routes;
    //按钮权限标记
    state.buttons = userInfo.buttons;
    //角色
    state.roles = userInfo.roles;
  },
  //存储最终需要展示的路由
  SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
    state.resultAsyncRoutes = asyncRoutes;
    //合并路由
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes,anyRoutes);
    //动态注册路由
    router.addRoutes(state.resultAllRoutes)
  }
}


function computedAsyncRoutes(asyncRoutes,routes) {
  return asyncRoutes.filter(item => {
    //如果信息中包含
    if (routes.indexOf(item.name) !== -1) {
      //递归子路由
      if (item.children && item.children.length) {
        item.children = computedAsyncRoutes(item.children, routes);
      }
    } return true
  })

}


const actions = {
  // user login


  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password: password })
    if (result.code == 20000) {
      //将从服务器中获取的token提交mutation，将token存储到vuex中
      commit('SET_TOKEN', result.data.token)
      //将token设置到cookie中,本地持久化存储cookie
      setToken(result.data.token)
      return 'OK'
    } else {
      return Promise.reject(new Error('failed'))
    }
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      //携带token获取用户信息
      getInfo(state.token).then(response => {
        const { data } = response
        //返回的用户信息包含：用户名name,用户头像avatar,routes:服务器返回的标记，不同的用户应该展示哪些菜单的标记，
        //roles用户角色信息
        //buttons：按钮的信息（按钮权限的标记）
        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        // const { name, avatar } = data

        //vuex存储用户的全部信息
        commit('SET_USERINFO', data)
        //存储经过计算对比以后的路由信息resultAsyncRoutes
        commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },



  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

