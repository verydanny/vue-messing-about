import { createVueApp } from "../app/app"

const { app, router, store } = createVueApp()

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

router.onReady(() => {
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)
    let diffed = false
    const activated = matched.filter((comp, i) => {
      return diffed || (diffed = prevMatched[i] !== comp)
    })
    // Checking if custom asyncData option is on the vue template,
    // this is replicating something I saw in NUXT
    const hooks = activated
      .map((Component) => {
        if (Component && "asyncData" in Component && Component.asyncData) {
          return Component.asyncData
        }
      })
      .filter(Boolean)

    if (!hooks.length) {
      return next()
    }

    return Promise.all(hooks.map((hook) => hook!({ store, route: to })))
      .then(() => {
        next()
      })
      .catch(next)
  })

  app.$mount("#app")
})

if (module.hot) {
  module.hot.accept()
}
