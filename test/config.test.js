const Conf = require('../lib/utils/config')

const config = new Conf()
test('get', () => {
  expect(Array.isArray(config.get())).toBe(true)
})

test('set', () => {
  config.set('envs', 'node')
  config.set('version', '0.0.1')
  expect(config.get('envs')).toBe('node')
})

test('has', () => {
  expect(config.has('envs')).toBe(true)
  expect(config.has('name')).toBe(false)
})

test('delete', () => {
  config.delete('version')
  expect(config.get('version')).toBeUndefined()
})
