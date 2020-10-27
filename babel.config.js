// No longer using Babel, but might use it later for unit testing
// as well as e2e testing.

module.exports = (api) => {
  return {
    presets: [
      [
        "@babel/preset-env",
        {
          modules: false,
          targets: api.caller((caller) => caller && caller.target === "node")
            ? { node: "current" }
            : {
                browsers: "last 1 chrome version",
              },
        },
      ],
      "@babel/preset-typescript",
    ],
    plugins: [
      "@babel/plugin-proposal-nullish-coalescing-operator",
      "@babel/plugin-proposal-optional-chaining",
      "@babel/plugin-syntax-dynamic-import",
    ],
  }
}
