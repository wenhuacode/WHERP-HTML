export default {
  get() {
    return window.localStorage.getItem('TOKEN')
  },
  save(token: any) {
    window.localStorage.setItem('TOKEN', token)
  },
  delete() {
    window.localStorage.removeItem('TOKEN')
  },
}
