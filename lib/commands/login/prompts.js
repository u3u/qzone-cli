module.exports = [
  {
    type: 'input',
    name: 'uin',
    message: 'Please enter your account:',
    validate: value => {
      if (!/\d{5,11}/.test(value)) return 'Please enter the correct account'
      return true
    }
  },
  {
    type: 'password',
    name: 'pwd',
    message: 'Please enter your password:',
    mask: '*',
    validate: value => {
      if (value.trim().length <= 0) return 'Password is required'
      return true
    }
  }
]
