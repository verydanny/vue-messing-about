import * as fs from "fs"
import * as path from "path"

import webpackDevMiddleware from "webpack-dev-middleware"
import webpackHotMiddleware from "webpack-hot-middleware"
import MFS from "memory-fs"
import webpack from "webpack"
import chokidar from "chokidar"
import clearModule from "clear-module"

import { DevServerOut, Bundle, ClientManifest } from "../src/types/server"

import clientConfig from "./webpack.client"
import serverConfig from "./webpack.server"

const defaultStatsOptions = {
  assets: true,
  children: false,
  chunks: false,
  colors: true,
  hash: false,
  modules: false,
  timings: false,
  version: false,
  builtAt: false,
  entrypoints: false,
}

const readFile = (ifs: MFS | typeof fs, file: string) => {
  try {
    if (clientConfig.output?.path) {
      return ifs.readFileSync(
        path.join(clientConfig.output?.path, file),
        "utf-8"
      )
    }
  } catch {
    // silent fail
  }

  return undefined
}

export default async function setupDevServer(
  app: import("express").Application,
  templatePath: string,
  doneCallback: (out: DevServerOut) => void
): Promise<unknown> {
  let bundle: Bundle | undefined
  let template: string
  let clientManifest: ClientManifest | undefined

  // This is an anti-pattern
  let ready: (value?: unknown) => void
  const readyPromise = new Promise((resolve) => {
    ready = resolve
  })
  const update = (compiler?: string) => {
    compiler && console.log(`Updated: ${compiler}`)

    if (bundle && clientManifest) {
      ready()

      return doneCallback({
        bundle,
        template,
        clientManifest,
      })
    }
  }

  template = fs.readFileSync(templatePath, "utf-8")
  chokidar.watch(templatePath).on("change", () => {
    template = fs.readFileSync(templatePath, "utf-8")

    update()
  })

  // Watch for changes is `src/server` so we don't have to constantly restart node
  // process on middleware changes
  const dirToWatch = path.resolve(__dirname, "../src/server")
  const watcher = chokidar.watch(dirToWatch)

  watcher.on("ready", () => {
    watcher.on("all", (eventType, fileChanged) => {
      clearModule.single(fileChanged)

      if (eventType === "change") {
        update(`src/server file changed: ${fileChanged}`)
      }
    })
  })

  if (clientConfig.output) {
    clientConfig.output.filename = "[name].js"
  }

  if (clientConfig.plugins) {
    clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
  }

  const clientCompiler = webpack(clientConfig)
  // dev middleware
  const devMiddleware = webpackDevMiddleware(clientCompiler, {
    publicPath: clientConfig?.output?.publicPath,
    logLevel: "silent",
    stats: defaultStatsOptions,
  })

  // webpack client on done recompile hook
  clientCompiler.hooks.done.tapAsync("vue-compiler", (stats, callback) => {
    clientManifest = undefined
    const info = stats.toJson(defaultStatsOptions)

    if (stats.hasErrors()) {
      console.error(info.errors)
    }

    if (stats.hasWarnings()) {
      console.info(info.warnings)
    }

    if (info.errors.length) {
      console.error(info)

      return callback()
    }

    clientManifest = JSON.parse(
      readFile(devMiddleware.fileSystem, "vue-ssr-client-manifest.json")
    )

    callback()
    update()
  })

  app.use(devMiddleware)
  // hot middleware
  app.use(
    webpackHotMiddleware(clientCompiler, {
      log: false,
      heartbeat: 5000,
    })
  )

  // Server Code
  // watch and update server renderer
  const serverCompiler = webpack(serverConfig)
  const mfs = new MFS()
  serverCompiler.outputFileSystem = mfs
  serverCompiler.watch({}, (err, stats) => {
    bundle = undefined
    const info = stats.toJson(defaultStatsOptions)

    if (err) {
      console.error(err)
    }

    if (stats.hasErrors()) {
      console.error(info.errors)
    }

    if (stats.hasWarnings()) {
      console.info(info.warnings)
    }

    if (info.errors.length) {
      console.error(info)

      return
    }

    // read bundle generated by vue-ssr-webpack-plugin
    bundle = JSON.parse(readFile(mfs, "vue-ssr-server-bundle.json"))

    update()
  })

  return readyPromise
}
