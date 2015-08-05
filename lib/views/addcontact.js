module.exports = require('webrtc-core').bdsft.View(AddContactView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles')
})

function AddContactView(addcontact) {
  var self = {};

  self.elements = ['name', 'jid', 'add', 'addLink', 'cancelLink', 'form'];

  self.listeners = function() {
    self.add.on('click', function(e) {
      addcontact.add();
    });
    self.cancelLink.on('click', function(e) {
      addcontact.cancel();
    });
    self.addLink.on('click', function(e) {
      addcontact.show();
    });
  };

  return self;

}