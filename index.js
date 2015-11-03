module.exports = {
	view: require('./lib/views/xmpp'), 
	model: require('./lib/models/xmpp'), 
	addcontact: require('./lib/models/addcontact'), 
	addcontactview: require('./lib/views/addcontact'), 
	chat: require('./lib/models/chat'),
	chatview: require('./lib/views/chat'),
	chats: require('./lib/models/chats'),
	chatsview: require('./lib/views/chats'),
	chattab: require('./lib/models/chattab'),
	chattabview: require('./lib/views/chattab'),
	contact: require('./lib/models/contact'),
	contactview: require('./lib/views/contact'),
	contacts: require('./lib/models/contacts'),
	contactsview: require('./lib/views/contacts'),
	handle: require('./lib/models/handle'),
	handleview: require('./lib/views/handle'), 
	message: require('./lib/models/message'),
	messageview: require('./lib/views/message'),
	mycontact: require('./lib/models/mycontact'),
	mycontactview: require('./lib/views/mycontact'),
	subscription: require('./lib/models/subscription'),
	subscriptionview: require('./lib/views/subscription'),
	subscriptions: require('./lib/models/subscriptions'),
	subscriptionsview: require('./lib/views/subscriptions'),
	client: require('./lib/client'),
	eventbus: require('bdsft-sdk-eventbus').model
};