const { alias } = require('react-app-rewire-alias')
const path = require('path')

module.exports = function override(config) {
  alias({
    '@': path.resolve(__dirname, 'src')
  })(config)

  return config
}
