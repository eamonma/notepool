module.exports = {
  webpack(config, env) {
    config.devServer = {
      historyApiFallback: true,
    }
    return config
  },
}
