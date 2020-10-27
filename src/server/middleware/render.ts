/* eslint-disable @typescript-eslint/no-var-requires */
import { Request, Response, NextFunction } from "express"
import { BundleRenderer } from "vue-server-renderer"

import { VueError } from "../../types/server"

const PROD = process.env.NODE_ENV === "production"
const serverInfo =
  `express/${require("express/package.json").version} ` +
  `vue-server-renderer/${require("vue-server-renderer/package.json").version}`

export function renderMiddleware(
  req: Request,
  res: Response,
  _next: NextFunction,
  renderer: BundleRenderer
) {
  const START = Date.now()

  res.setHeader("Content-Type", "text/html")
  res.setHeader("Server", serverInfo)

  const handleError = (err: VueError) => {
    if (err.url) {
      res.redirect(err.url)
    } else if (err.code === 404) {
      res.status(404).send("404 | Page Not Found")
    } else {
      res.status(500).send("500 | Internal Server Error")
      console.error(`error during render : ${req.url}`)
      console.error(err.stack)
    }
  }

  const context = {
    title: "Vue Assignment",
    url: req.url,
  }

  return renderer
    .renderToString(context)
    .then((html) => {
      if (!PROD) {
        console.log(`request: ${Date.now() - START}ms`)
      }

      return res.send(html)
    })
    .catch((err) => {
      if (err) {
        return handleError(err)
      }
    })
}
