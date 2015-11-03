module.exports = require('bdsft-sdk-view')(SubscriptionsView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles'),
  module: 'xmpp'
})

var SubscriptionView = require('./subscription');
var jQuery = jquery = $ = require('jquery');
require('jquery-ui/resizable');
require('jquery-ui/draggable');

function SubscriptionsView(subscriptions) {
  var self = {};

  self.updateSubscriptionsContent = function(items){
      self.updateContentView(self.subscriptionsContent, items, function(contact) {
        return SubscriptionView.create([contact, subscriptions]);
      });
  };

  self.elements = ['subscriptionsContent'];

  self.bindings = {
    subscriptionsContent: {
      subscriptions: 'items'
    }
  }
  self.init = function() {
    jQuery(self.view).resizable({
      direction: ['bottom', 'left']
    }).draggable();
  };

  return self;

}