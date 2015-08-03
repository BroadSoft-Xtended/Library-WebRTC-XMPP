module.exports = require('webrtc-core').bdsft.View(SubscriptionsView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles')
})

var SubscriptionView = require('./subscription');
var jQuery = jquery = $ = require('jquery');
require('jquery-ui/resizable');
require('jquery-ui/draggable');

function SubscriptionsView(xmpp) {
  var self = {};

  self.elements = ['subscriptionsContent', 'close'];

  self.init = function() {
    jQuery(self.view).resizable({
      direction: ['bottom', 'left']
    }).draggable();
  };

  self.listeners = function(xmppDatabinder) {
    xmppDatabinder.onModelPropChange('subscriptions', function(subscriptions) {
      self.updateContentView(self.subscriptionsContent, subscriptions, function(contact) {
        return SubscriptionView.create([contact, xmpp]);
      });
    });
    self.close.on('click', function(e){
      e.preventDefault();
      xmpp.hideSubscriptions();
    })
  };

  return self;

}