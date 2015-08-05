module.exports = require('webrtc-core').bdsft.View(MessageView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles')
})

function MessageView(message) {
  var self = {};

  self.elements = ['body'];

  return self;

}