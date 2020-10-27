/* eslint-disable @typescript-eslint/no-var-requires */
import "reflect-metadata/Reflect.js"

import fs from "fs"
import * as path from "path"

import express from "express/index.js"
import { createConnection } from "typeorm/index.js"
import LRU from "lru-cache/index.js"
import compression from "compression/index.js"
import favicon from "serve-favicon/index.js"
import {
  createBundleRenderer,
  BundleRendererOptions,
  BundleRenderer,
} from "vue-server-renderer/index.js"

import setupDevServer from "./webpack/dev-server"
import { Hospital } from "./src/model/entities/hospital"

const app = express()
const resolve = (file: string) => path.resolve(__dirname, file)

const PORT = process.env.PORT || 8080
const PROD = process.env.NODE_ENV === "production"
const templatePath = resolve("./src/app/templates/index.template.html")

let renderer: BundleRenderer | undefined
let readyPromise: Promise<unknown>

function createApp(bundle: string | object, options: BundleRendererOptions) {
  return createBundleRenderer(bundle, {
    ...options,
    cache: new LRU({
      max: 1000,
      maxAge: 1000 * 60 * 15,
    }),
    basedir: resolve("./dist"),
    runInNewContext: false,
  })
}

function serve(path: string, cache?: boolean) {
  return express.static(resolve(path), {
    maxAge: cache && PROD ? 1000 * 60 * 60 * 24 * 30 : 0,
  })
}

if (PROD) {
  const template = fs.readFileSync(templatePath, "utf-8")
  const bundle = require("./dist/vue-ssr-server-bundle.json")
  const clientManifest = require("./dist/vue-ssr-client-manifest.json")

  renderer = createApp(bundle, {
    template,
    clientManifest,
  })
} else {
  readyPromise = setupDevServer(
    app,
    templatePath,
    ({ bundle, clientManifest, template }) => {
      if (bundle && clientManifest && template) {
        renderer = createApp(bundle, {
          clientManifest,
          template,
        })
      }
    }
  )
}

async function startServer() {
  await createConnection({
    type: "mysql",
    host: "vuedatabase1.cwvnkvuf7xru.us-east-2.rds.amazonaws.com",
    port: 3306,
    database: "vueassignment",
    username: "admin",
    password: "stranger6NIMBI4aquifer3beneath",
    logging: true,
    entities: [Hospital],
    synchronize: true,
  })

  // These middleware don't need to be hot-reloaded, so we don't use dynamic import()
  app.use(express.json())
  app.use(compression({ threshold: 0 }))
  app.use(favicon("public/vue48.png"))
  app.use("/dist", serve("./dist", true))
  app.use("/public", serve("./public", true))
  app.use("/manifest.json", serve("./manifest.json", true))
  app.use("/service-worker.js", serve("./dist/service-worker.js"))

  // Everything in the `./src/server` directory is hot reloaded, but it
  // must be imported via a closure, else it's cached. The following format
  // makes it hot-reloadable in dev, but still cached in production because
  // the import() is just a Promise<require>. It's hot reloaded because I clear
  // it from memory (require.cache)
  //
  // This is useful so one can add API endpoints, middleware, etc. without restarting
  // The server or having to transpile through webpack. TS-Node is enough.
  app.use("/api", async (req, res, next) =>
    import("./src/model/endpoints/api")
      .then(({ apiRouter }) => apiRouter(req, res, next))
      .catch(next)
  )

  app.get("*", async (req, res, next) =>
    import("./src/server/middleware/render")
      .then(async ({ renderMiddleware }) => {
        if (!PROD) await readyPromise

        if (renderer) {
          return renderMiddleware(req, res, next, renderer)
        }

        return next()
      })
      .catch(next)
  )

  app.listen(PORT, () => {
    console.log(`server started at localhost:${PORT}`)
  })
}

startServer()
