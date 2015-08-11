module.exports = require('webrtc-core').bdsft.View(MessageView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles'),
  module: 'xmpp'
})

function MessageView(message) {
  var self = {};

  self.elements = ['body'];

  return self;

}