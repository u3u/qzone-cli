/* eslint-disable import/order */
/* eslint-disable one-var */
const api = require('qzone-api')
const ora = require('ora')
const chalk = require('chalk')
const inquirer = require('inquirer')
const questions = require('./prompts')
const Conf = require('../../utils/config')

module.exports = async function() {
  const config = new Conf()
  const isLogin = config.has('login')
  let uin, skey, token

  if (isLogin) {
    const items = config.get()
    uin = items.find(x => x.key === 'uin').value
    skey = items.find(x => x.key === 'skey').value
    token = items.find(x => x.key === 'token').value

    console.log(`${chalk.blue('info')} qzone uin: ${uin}`)
    console.log(`${chalk.blue('info')} qzone skey: ${skey}`)
    console.log(`${chalk.blue('info')} qzone token: ${token}`)
    console.log('✨  Already logged in.')
  } else {
    const answers = await inquirer.prompt(questions)
    const spinner = ora('Logging...').start()
    const { user, cookies } = await api.login(answers.uin, answers.pwd)
    uin = cookies.find(x => x.name === 'p_uin').value
    skey = cookies.find(x => x.name === 'p_skey').value
    token = user.token

    config.set('uin', uin)
    config.set('skey', skey)
    config.set('token', token)
    config.set('login', true)

    spinner.succeed('Login successful.')
  }
}
