module.exports = require('webrtc-core').bdsft.View(SubscriptionView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles')
})

function SubscriptionView(subscription) {
  var self = {};

  self.elements = ['name', 'accept', 'deny'];

  self.listeners = function() {
    self.accept.on('click', function(e){
      e.preventDefault();
      subscription.accept();
    });
    self.deny.on('click', function(e){
      e.preventDefault();
      subscriptions.deny();
    });
  };

  return self;

}