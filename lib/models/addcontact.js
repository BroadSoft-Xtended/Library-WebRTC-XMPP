module.exports = require('bdsft-sdk-model')(AddContact);

var DirectoryDetail = require('./directorydetail');
var Contact = require('./contact');
var Utils = require('bdsft-sdk-utils');

function AddContact(eventbus, client, xsi, cookieconfig, contacts) {
	var self = {};

	var xsiClient;

	self.updateXsiClient = function(){
		xsiClient = xsi.connect(cookieconfig.userid, cookieconfig.password);
	};

	self.props = ['input', 'classes', 'visible', 'searchResults', 'searching'];

	self.bindings = {
		classes: {
			self: ['visible', 'searching']
		},
		xsiClient: {
			cookieconfig: ['userid', 'password']
		}
	};

	self.init = function() {
		self.searchResults = {};
	};

	var addContact = function(contact) {
		client.updateRosterItem({
			jid: contact.id,
			name: contact.name
		}, function(e) {
			// debug.log('updateRosterItem : ' + JSON.stringify(e));
			if (e && e.error) {
				eventbus.emit('addContactFailed', e.error);
			}
		});
		client.subscribe(contact.id, function(e) {
			// debug.log('subscribe : ' + JSON.stringify(e));
		});
		client.on('subscribe', 'addContact', function(msg) {
			if (msg.from.bare === contact.id) {
				client.acceptSubscription(contact.id);
				client.releaseGroup('addContact');
			}
		});
		eventbus.emit('addContact', contact);
	};

	self.cancel = function() {
		self.visible = false;
	};

	self.show = function() {
		self.input = '';
		self.visible = true;
	};

	self.search = function(text) {
		self.searching = true;
		xsiClient.userDirectoryEnterprise({
			impId: '*' + text + '*',
			firstName: '*' + text + '*',
			lastName: '*' + text + '*',
			number: '*' + text + '*',
			searchCriteriaModeOr: 'true'
		}).then(function(res) {
			self.searching = false;
			self.searchResults = Utils.withArray(res.enterpriseDirectory.directoryDetails).filter(function(directoryDetails){
				var impId = directoryDetails.additionalDetails && directoryDetails.additionalDetails.impId;
				var isMe = impId === client.jid.bare;
				var hasContact = contacts.containsActive(impId);
				return impId && !isMe && !hasContact;
			}).map(function(directoryDetails) {
				return DirectoryDetail.create([directoryDetails, eventbus]);
			}).reduce(function(obj, directoryDetail) {
				obj[directoryDetail.userId] = directoryDetail;
				return obj;
			}, {});
		});
	};

	self.add = function(directorydetail) {
		if (directorydetail) {
			var contact = Contact.create([{
				bare: directorydetail.impId || directorydetail,
				local: directorydetail.name || directorydetail
			}, eventbus, client]);
			addContact(contact);
			self.visible = false;
		}
	};

	return self;
}