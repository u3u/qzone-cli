/* eslint-disable camelcase */
const fs = require('fs')
const process = require('child_process')
const ora = require('ora')
const chalk = require('chalk')
const download = require('download')
const md5 = require('md5')
const api = require('qzone-api')
const ProgressBar = require('progress')

const privateGetPhotoListMethod = Symbol('Get photo list')

module.exports = class Qzone {
  constructor({ uin, token, skey, aims }) {
    this.uin = uin
    this.skey = skey
    this.token = token
    this.aims = aims

    this[privateGetPhotoListMethod] = params => {
      return api.getPhotoList(
        Object.assign(
          {},
          {
            p_uin: this.uin,
            p_skey: this.skey,
            g_tk: this.token,
            uin: this.aims
          },
          params
        )
      )
    }
  }

  async getAlbumList() {
    const { vFeeds } = await api.getAlbumList({
      p_uin: this.uin,
      p_skey: this.skey,
      g_tk: this.token,
      res_uin: this.aims
    })
    return vFeeds.map(x => x.pic)
  }

  async getTotalCount(albumid) {
    const { total_count } = await this[privateGetPhotoListMethod]({
      ps: 0,
      pn: 0,
      albumid
    })
    return total_count
  }

  async getPhotos(albumid, ps = 0, pn = 200) {
    const { photos } = await this[privateGetPhotoListMethod]({
      albumid,
      ps,
      pn
    })
    return [].concat(...Object.values(photos).map(x => x.map(x => x[1].url)))
  }

  async downloadPhotosByAlbumId(albumid, path) {
    if (!fs.existsSync(path)) process.execSync(`mkdir ${path}`)
    const spinner = ora('Fetching photos...').start()
    const total = await this.getTotalCount(albumid)
    const tokens = {
      info: chalk.cyan('Downloading'),
      bar: chalk.yellow(':bar'),
      percent: chalk.green(':percent'),
      total: chalk.blue(':current/:total')
    }
    const bar = new ProgressBar(
      // prettier-ignore
      // downloading [===       ] 30% (3/10, 0.7s)
      `  ${tokens.info} [${tokens.bar}] ${tokens.percent} (${tokens.total}, :etas)`,
      {
        width: 20,
        total
      }
    )
    const nextTick = delay => new Promise(resolve => setTimeout(resolve, delay))
    const downloadAll = async (ps = 0, pn = 20) => {
      if (ps >= total) return Promise.resolve()
      await nextTick(1000)
      const photos = await this.getPhotos(albumid, ps, pn)
      if (ps <= 0) spinner.succeed('Fetch photo successful.')
      return Promise.all(
        photos.map(url =>
          download(url).then(data => {
            fs.writeFileSync(path.join(path, `${md5(data)}.png`), data)
            bar.tick()
          })
        )
      ).then(() => downloadAll(ps + pn, pn))
    }

    return downloadAll()
  }
}
