const Conf = require('../../utils/config')

module.exports = function() {
  const config = new Conf()
  config.clear()
  console.log('✨  Log out successfully.')
}
