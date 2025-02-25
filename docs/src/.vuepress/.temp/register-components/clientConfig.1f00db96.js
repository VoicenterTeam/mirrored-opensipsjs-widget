import { defineAsyncComponent } from 'vue'

export default {
  enhance: ({ app }) => {    
      app.component("AudioUploader", defineAsyncComponent(() => import("C:/Users/Serhii/Projects/opensipsjs-widget/docs/src/.vuepress/components/AudioUploader.vue"))),
      app.component("Config", defineAsyncComponent(() => import("C:/Users/Serhii/Projects/opensipsjs-widget/docs/src/.vuepress/components/Config.vue"))),
      app.component("Demo", defineAsyncComponent(() => import("C:/Users/Serhii/Projects/opensipsjs-widget/docs/src/.vuepress/components/Demo.vue"))),
      app.component("FileUploader", defineAsyncComponent(() => import("C:/Users/Serhii/Projects/opensipsjs-widget/docs/src/.vuepress/components/FileUploader.vue"))),
      app.component("ImageUploader", defineAsyncComponent(() => import("C:/Users/Serhii/Projects/opensipsjs-widget/docs/src/.vuepress/components/ImageUploader.vue"))),
      app.component("Widget", defineAsyncComponent(() => import("C:/Users/Serhii/Projects/opensipsjs-widget/docs/src/.vuepress/components/Widget.vue")))
  },
}
