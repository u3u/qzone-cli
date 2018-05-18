/* eslint-disable import/order */
const ora = require('ora')
const inquirer = require('inquirer')
const entities = require('entities')
const questions = require('./prompts')
const logger = require('../../logger')
const Qzone = require('../../utils/qzone')
const Conf = require('../../utils/config')

module.exports = async function(input) {
  const config = new Conf()
  const isLogin = config.has('login')

  if (!isLogin) {
    logger.warn('Please run `qzone login` first.')
    return
  }

  const aims = input.toString()
  if (aims.trim().length <= 0) {
    logger.warn('Please enter the QQ number you want to visit Qzone.')
    return
  }

  const items = config.get()
  const uin = items.find(x => x.key === 'uin').value
  const skey = items.find(x => x.key === 'skey').value
  const token = items.find(x => x.key === 'token').value

  const spinner = ora('Fetching album list...').start()
  const api = new Qzone({ uin, skey, token, aims })
  const albums = await api.getAlbumList()
  const choices = albums.map(item => ({
    name: entities.decodeHTML(item.albumname).trim(),
    value: item.albumid
  }))
  spinner.succeed('Fetch album list successful.')

  const answers = await inquirer.prompt(questions(choices))

  await api.downloadPhotosByAlbumId(answers.albumid, answers.path)
  spinner.succeed('Download complete.')
}
