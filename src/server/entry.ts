/* eslint-disable prefer-promise-reject-errors */

import { VueContext } from "../types/server"
import { createVueApp } from "../app/app"
import { MyComponentOptions } from "../types/custom-vue"

const PROD = process.env.NODE_ENV === "production"

const middleware = (context: VueContext) => {
  return new Promise((resolve, reject) => {
    const START = Date.now()

    const { app, router, store } = createVueApp(context)
    const { url } = context
    const { fullPath } = router.resolve(url).route

    if (fullPath !== url) {
      return reject({ url: fullPath })
    }

    router.push(url)

    return router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()

      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }

      const asyncDataHooks = matchedComponents.filter(
        (Component) =>
          Component && "asyncData" in Component && Component.asyncData
      ) as MyComponentOptions[]

      return Promise.all(
        asyncDataHooks.map(({ asyncData }) => {
          return asyncData({
            route: router.currentRoute,
            store,
          })
        })
      )
        .then(() => {
          if (!PROD) console.log(`Pre-fetch: ${Date.now() - START}ms`)

          context.rendered = () => (context.state = store.state)

          return resolve(app)
        })
        .catch(reject)
    }, reject)
  })
}

export default middleware
