module.exports = require('webrtc-core').bdsft.View(MessageView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles')
})

function MessageView(message, xmpp) {
  var self = {};

  self.elements = ['body'];

  self.init = function() {
    self.body.text(message.body);
  };

  self.listeners = function() {
    // self.view.on('click', function(e){
    //   e.preventDefault();
    //   xmpp.selectCa(index);
    // });
  };

  return self;

}