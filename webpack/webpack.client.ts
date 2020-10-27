import webpack, { Plugin } from "webpack"
import merge from "webpack-merge"
import { GenerateSW } from "workbox-webpack-plugin"
import VueSSRClientPlugin from "vue-server-renderer/client-plugin"
// import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer"
// @ts-ignore
import VuetifyLoaderPlugin from "vuetify-loader/lib/plugin"

import base from "./webpack.base"

const PROD = process.env.NODE_ENV === "production"

const config = merge(base, {
  target: "web",
  entry: [
    !PROD && "webpack-hot-middleware/client?overlay=false&noInfo=true",
    "./src/client/entry.ts",
  ].filter(Boolean) as string[],
  plugins: [
    // new VuetifyLoaderPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development"
      ),
      "process.env.VUE_ENV": '"client"',
    }),
    new VueSSRClientPlugin(),
  ].filter(Boolean) as Plugin[],
})

if (PROD) {
  config.plugins?.push(
    // new BundleAnalyzerPlugin(),
    new GenerateSW({
      cacheId: "vue-sw",
      runtimeCaching: [
        {
          urlPattern: "/",
          handler: "NetworkFirst",
        },
        {
          urlPattern: /\/(top|new|show|ask|jobs)/,
          handler: "NetworkFirst",
        },
        {
          urlPattern: "/item/:id",
          handler: "NetworkFirst",
        },
        {
          urlPattern: "/user/:id",
          handler: "NetworkFirst",
        },
      ],
    })
  )
}

export default config
