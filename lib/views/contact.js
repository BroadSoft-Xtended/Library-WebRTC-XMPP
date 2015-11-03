module.exports = require('bdsft-sdk-view')(ContactView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles'),
  module: 'xmpp'
})

function ContactView(contact) {
  var self = {};

  self.elements = ['name', 'remove', 'close'];

  self.listeners = function() {
    self.view.on('click', function(e){
      e.preventDefault();
      contact.select();
    });
    self.remove.on('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      if(confirm("Are you sure you want to remove the contact?")) {
        contact.remove();  
      }
    });
    self.close.on('click', function(e){
      e.preventDefault();
      contact.close();
    });
  };

  return self;

}