module.exports = require('webrtc-core').bdsft.View(XMPPView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles')
});

var View = require('ampersand-view');
var GroupedCollectionView = require('ampersand-grouped-collection-view');
var ChatInputView = require('otalk-chat-input-view');
var FilteredCollection = require('ampersand-filtered-subcollection');
var SelectInputView = require('ampersand-select-view');
var Utils = require('webrtc-core').utils;
var Constants = require('webrtc-core').constants;


function XMPPView(debug, eventbus, configuration, sound, xmpp) {
  var self = {};

  self.model = xmpp;

  self.elements = ['content', 'name', 'password', 'login', 'messages', 'loginForm', 'rosterSelect', 'chatInput'];

  self.init = function() {
    self.messageCollection = new FilteredCollection(self.model.messages);

    self.chatInputView = new ChatInputView({
        el: self.chatInput[0],
        sendChat: function (body) {
            var contact = self.rosterSelectView.value;
            if (!contact) {
                return;
            }

            self.model.client.sendMessage({
                to: contact.id,
                body: body,
                chatState: 'active'
            });
        },
        sendChatState: function (state) {
            var contact = self.rosterSelectView.value;
            if (!contact) {
                return;
            }

            self.model.client.sendMessage({
                to: contact.id,
                chatState: state
            });
        }
    });

    self.messagesView = new GroupedCollectionView({
        el: self.messages[0],
        collection: self.messageCollection,
        itemView: View.extend({
            template: '<p data-hook="message"/>',
            bindings: {
                'model.body': {
                    type: 'text',
                    hook: 'message'
                }
            }
        }),
        groupView: View.extend({
            template: '<div><b data-hook="sender" /><div data-hook="items"/></div>',
            bindings: {
                'model.displayName': {
                    type: 'text',
                    hook: 'sender'
                }
            },
            render: function () {
                this.renderWithTemplate();
                this.cacheElements({
                    groupEl: '[data-hook~=items]'
                });
            }
        }),
        groupsWith: function (model, prevModel, currentGroup) {
            return model.from === prevModel.from;
        },
        prepareGroup: function (model, prevGroup) {
            return self.model.roster.get(model.from);
        }
    });

    self.rosterSelectView = new SelectInputView({
        el: self.rosterSelect[0],
        name: 'contact',
        options: self.model.roster,
        idAttribute: 'id',
        textAttribute: 'displayName',
        parent: {
            update: function (selector) {
                var contact = selector.value;
                if (!contact) {
                    return;
                }

                self.messageCollection.configure({
                    filter: function (msg) {
                        return msg.to == contact.id || msg.from == contact.id;
                    }
                }, true);
            }
        }
    });


    self.chatInputView.render();
  };

  self.listeners = function() {
    self.login.on('click', function(e) {
      sound.playClick();
      console.log('xmpp logging in');
      xmpp.login(self.name.val(), self.password.val());
      self.loginForm.hide();
      self.content.show();
    });
  };

  return self;
}