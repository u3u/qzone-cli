module.exports = function(choices) {
  return [
    {
      type: 'list',
      name: 'albumid',
      message: 'Please select an album you want to download?',
      paginated: true,
      choices
    },
    {
      type: 'input',
      name: 'path',
      message: 'Please enter the download save path:',
      default: './'
    }
  ]
}
