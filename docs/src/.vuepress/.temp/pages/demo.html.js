export const data = JSON.parse("{\"key\":\"v-2b30cdfd\",\"path\":\"/demo.html\",\"title\":\"Demo\",\"lang\":\"en-US\",\"frontmatter\":{},\"headers\":[],\"git\":{\"contributors\":[{\"name\":\"Bohdan\",\"email\":\"bohdan.ko@starkey.co.il\",\"commits\":1}]},\"filePathRelative\":\"demo.md\"}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
