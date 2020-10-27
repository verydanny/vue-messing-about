import webpack from "webpack"
import merge from "webpack-merge"
import nodeExternals from "webpack-node-externals"
import VueSSRServerPlugin from "vue-server-renderer/server-plugin"
import FriendlyErrorsPlugin from "friendly-errors-webpack-plugin"

import base from "./webpack.base"

export default merge(base, {
  target: "node",
  devtool: false,
  entry: "./src/server/entry.ts",
  output: {
    libraryTarget: "commonjs2",
  },
  // https://webpack.js.org/configuration/externals/#externals
  // https://github.com/liady/webpack-node-externals
  externals: nodeExternals({
    // do not externalize CSS files in case we need to import it from a dep
    allowlist: [/\.css$/, /^vuetify/],
  }),
  plugins: [
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: ["Your SERVER compilation was successful"],
        notes: [],
      },
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development"
      ),
      "process.env.VUE_ENV": '"server"',
    }),
    new VueSSRServerPlugin(),
  ],
})
