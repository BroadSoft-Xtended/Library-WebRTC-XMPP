module.exports = require('webrtc-core').bdsft.View(AddContactView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles')
})

function AddContactView(addContact) {
  var self = {};

  self.elements = ['name', 'jid', 'add', 'addLink', 'cancelLink', 'form'];

  var toggle = function(visible){
    self.form.toggle(visible);
    self.addLink.toggle(!visible);
    self.cancelLink.toggle(visible);
  };

  self.init = function(){
  };

  self.listeners = function() {
    self.add.on('click', function(e) {
      addContact.add();
    });
    self.cancelLink.on('click', function(e) {
      addContact.cancel();
    });
    self.addLink.on('click', function(e) {
      addContact.show();
    });
  };

  return self;

}