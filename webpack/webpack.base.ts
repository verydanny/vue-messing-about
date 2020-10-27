/* eslint-disable @typescript-eslint/no-var-requires */
import * as path from "path"

import { Plugin, Configuration, Loader, RuleSetRule } from "webpack"
import MiniCssExtract from "mini-css-extract-plugin"
// @ts-ignore
import VuetifyLoaderPlugin from "vuetify-loader/lib/plugin"
import FriendlyErrorsPlugin from "friendly-errors-webpack-plugin"
import ProgressBarPlugin from "progress-bar-webpack-plugin"
import { VueLoaderPlugin } from "vue-loader"
import { ESBuildPlugin, ESBuildMinifyPlugin } from "esbuild-loader"

const PROD = process.env.NODE_ENV === "production"
const DEV = process.env.NODE_ENV === "development"
const SERVER = process.env.NODE_CTX === "server"
const CLIENT = process.env.NODE_CTX === "client"

const fiber = require("fibers")

console.log(CLIENT)

const config = {
  mode: PROD ? ("production" as const) : ("development" as const),
  devtool: PROD ? "source-map" : false,
  output: {
    path: path.resolve(__dirname, "../dist"),
    publicPath: "/dist/",
    // DO NOT HASH in dev. This can cause a potential memory leak
    // as the project grows.
    filename: "[name].js",
    chunkFilename: PROD ? "[id].[chunkhash].js" : "[id].js",
    hotUpdateChunkFilename: "[id].hot-update.js",
    hotUpdateMainFilename: "hot-update.json",
  },
  resolve: {
    extensions: [".ts", ".vue", ".js"],
    alias: {
      public: path.resolve(__dirname, "../public"),
      vuetify: PROD ? "vuetify/lib" : "vuetify",
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          compilerOptions: {
            whitespace: "condense",
          },
        },
      },
      {
        test: /\.(t|j)s$/,
        exclude: [/node_modules/],
        include: [path.join(__dirname, "../src")],
        loader: {
          loader: "esbuild-loader",
          options: {
            loader: "ts",
            target: "es2018",
          },
        },
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "url-loader",
      },
      {
        test: /\.s?(c|a)ss$/,
        use: [
          DEV && "vue-style-loader",
          PROD &&
            CLIENT && {
              loader: MiniCssExtract.loader,
              options: {
                esModule: false,
              },
            },
          {
            loader: "css-loader",
            options: {
              sourceMap: false,
              esModule: false,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: false,
              implementation: require("sass"),
              sassOptions: {
                fiber,
              },
            },
          },
          PROD && SERVER && "ignore-loader",
        ].filter(Boolean) as Loader[],
      },
    ].filter(Boolean) as RuleSetRule[],
  },
  plugins: [
    new ESBuildPlugin(),
    new VueLoaderPlugin(),
    new FriendlyErrorsPlugin(),
  ].filter(Boolean) as Plugin[],
} as Configuration

if (CLIENT && PROD) {
  config?.plugins?.push(
    new VuetifyLoaderPlugin(),
    new ProgressBarPlugin(),
    new MiniCssExtract({
      filename: PROD ? "style.[hash].css" : "style.css",
      chunkFilename: PROD ? "[name].[chunkhash].css" : "[name].css",
    })
  )
  config.optimization = {
    minimize: true,
    minimizer: [
      new ESBuildMinifyPlugin({
        target: "es2018",
        minify: true,
        minifyWhitespace: true,
        minifySyntax: true,
        minifyIdentifiers: true,
        sourcemap: false,
      }),
    ],
  }
}

export default config
