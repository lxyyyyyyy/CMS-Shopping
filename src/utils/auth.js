import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

//从cookie中拿到token信息
export function getToken() {
  return Cookies.get(TokenKey)
}
//将token放到cookie中
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
//从cookie中删除token
export function removeToken() {
  return Cookies.remove(TokenKey)
}
