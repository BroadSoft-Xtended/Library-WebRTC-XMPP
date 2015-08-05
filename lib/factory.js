var self = {};
module.exports = self;

var Eventbus = require('webrtc-core').eventbus;

var AddContact = require('./models/addcontact');
var Chats = require('./models/chats');
var ChatTab = require('./models/chattab');
var Contacts = require('./models/contacts');
var MyContact = require('./models/mycontact');
var Subscriptions = require('./models/subscriptions');

var AddContactView = require('./views/addcontact');
var ChatsView = require('./views/chats');
var ChatTabView = require('./views/chattab');
var ContactsView = require('./views/contacts');
var MyContactView = require('./views/mycontact');
var SubscriptionsView = require('./views/subscriptions');

var client = require('./client');

var eventbus = Eventbus.create([]);

self.createSubscriptionsView = function() {
	var subscriptions = Subscriptions.create([eventbus, client]);
	return SubscriptionsView.create([subscriptions]);
};

self.createContactsView = function() {
	var contacts = Contacts.create([eventbus, client]);
	return ContactsView.create([contacts]);
};

self.createChatsView = function() {
	var chats = Chats.create([eventbus, client]);
	return ChatsView.create([chats]);
};

self.createChatTabView = function() {
	var chatTab = ChatTab.create([eventbus, client]);
	return ChatTabView.create([chatTab]);
};

self.createAddContactView = function() {
    var addContact = AddContact.create([eventbus, client]);
    return AddContactView.create([addContact]);
};

self.createMyContactView = function() {
    var myContact = MyContact.create([eventbus, client]);
    return MyContactView.create([myContact]);
};

