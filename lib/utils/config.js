const os = require('os')
const fs = require('fs')
const path = require('path')

const filename = '.qzonerc'
const qzonerc = path.resolve(os.homedir(), filename)

module.exports = class Conf {
  constructor(path = qzonerc) {
    this.path = path
  }

  get(key) {
    if (!fs.existsSync(this.path)) this.clear()
    const data = fs.readFileSync(this.path)
    const conf =
      data
        .toString()
        .split('\n')
        .filter(item => item)
        .map(item => {
          const arr = item.split('=')
          return {
            key: arr[0],
            value: arr[1]
          }
        }) || []

    if (key) return (conf.find(item => item.key === key) || {}).value
    return conf
  }

  set(key, value) {
    if (!key) return
    const items = this.get()
    const conf = items.find(item => item.key === key)
    if (conf) conf.value = value
    else items.push({ key, value })
    fs.writeFileSync(
      this.path,
      items.map(item => `${item.key}=${item.value}`).join('\n') || ''
    )
  }

  has(key) {
    return Boolean(this.get(key))
  }

  delete(key) {
    const items = this.get()
    items.splice(items.findIndex(x => x.key === key), 1)
    fs.writeFileSync(
      this.path,
      items.map(item => `${item.key}=${item.value}`).join('\n') || ''
    )
  }

  clear() {
    fs.writeFileSync(this.path, '')
  }
}
