module.exports = require('bdsft-sdk-view')(SubscriptionView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles'),
  module: 'xmpp'
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