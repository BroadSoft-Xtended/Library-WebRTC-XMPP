module.exports = require('webrtc-core').bdsft.Model(Client, {
	config: require('../js/config')
});

var Q = require('q');
var Utils = require('webrtc-core').utils;
var NS_ROSTER = 'jabber:iq:roster';

function Client(debug) {
	var self = {};

	var client;

	var deferred = function(exec, opts) {
		return function() {
			var defer = Q.defer();
			opts = opts || {};
			try {
			    exec.apply(self, [].slice.call(arguments));
			} catch(e) {
				defer.reject(e);
				return;
			}

			var errorOn = opts.errorOn || 'error';
			var successOnCb = function(reply){
				var resolve = function() {
					Utils.withArray(opts.successOn).forEach(function(name){
						client.removeListener(name, successOnCb);
					});
			        client.removeListener(errorOn, errorOnCb);
					defer.resolve();
				}

				if(opts.successOnCb) {
					if(opts.successOnCb(reply)) {
						resolve();
					}
				} else {
					resolve();
				}
			};
			var errorOnCb = function(e){
				debug.error('error : '+e);
				Utils.withArray(opts.successOn).forEach(function(name){
					client.removeListener(name, successOnCb);
				});
		        client.removeListener(errorOn || 'error', errorOnCb);
				defer.reject();
			};
			Utils.withArray(opts.successOn).forEach(function(name){
				client.on(name, successOnCb);
			})
			client.on(errorOn, errorOnCb);

		    return defer.promise;
		}
	};


	function RosterGet(){
		return IQ('get').c('query', { xmlns: NS_ROSTER })
	};

	function IQ(type, attrs){
		return Stanza('iq', require('extend')({ type: type}, attrs))
	};

	function Stanza(name, attrs){
		var id = name+'_'+Math.ceil(Math.random() * 99999);
		var StanzaXMPP = require('node-xmpp-core').Stanza;
		var self = new StanzaXMPP.Element(
		    name,
		    require('extend')({ id: id}, attrs)
		);
		self.id = id;
		self.name = name;
		return self;
	}

	var send = function(stanza, opts){
		opts = opts || {};
		opts.successOnCb = opts.successOnCb || function(reply){
	        if (reply.is(stanza.name) && (reply.attrs.id === stanza.id)) {
	        	return true;
	        }
		};
		opts.successOn = opts.successOn || stanza.name;

		return deferred(function(){
		    client.send(stanza);
		}, opts)();
	}

	self.init = function(){
		Object.defineProperties(self, {
			jid: {
				get: function(){
					return client.jid;
				}
			}
		});
	};

	self.busy = function() {
		client.sendPresence({
			show: 'dnd'
		});
	};

	self.ping = function(jid, cb) {
		return client.ping(jid, cb);
	};

	self.getCurrentCaps = function() {
		client.getCurrentCaps();
	};

	self.getDiscoInfo = function(jid, node, cb) {
		client.getDiscoInfo(jid, node, cb);
	};

	self.getDiscoItems = function(jid, node, cb) {
		client.getDiscoItems(jid, node, cb);
	};

	self.active = function() {
		client.sendPresence();
	};

	self.connect = deferred(function(credentials) {
		var opts = credentials;
		opts.bosh = {
			url: self.boshURL
			// prebind: function(error, data) {
	  //           if (error) {
	  //           	throw Error(error);
	  //           }
	  //           return data
	  //           /*
	  //               data.sid
	  //               data.rid
	  //            */
   //      	}
       	};
		opts.wait = 60;

        var XMPPClient = require('node-xmpp-client');
		client = new XMPPClient(opts);
	}, {successOn: ['online', 'auth']});

	self.disconnect = deferred(function() {
		client.connection && client.connection.end();
	}, {successOn: 'disconnect'});

	self.releaseGroup = function(name) {
		client.releaseGroup(name);
	};

	self.sendPresence = function(item) {
		client.sendPresence(item);
	};

	self.onUnsubscribe = function(callback) {
		console.log('NEEDS IMPLEMENTATION');
	};
	self.onSubscribe = function(callback) {
		console.log('NEEDS IMPLEMENTATION');
	};
	self.onPresence = function(callback) {
		console.log('NEEDS IMPLEMENTATION');
	};
	self.onMessageSent = function(callback) {
		console.log('NEEDS IMPLEMENTATION');
	};
	self.onUnavailable = function(callback) {
		console.log('NEEDS IMPLEMENTATION');
	};
	self.onAvailable = function(callback) {
		console.log('NEEDS IMPLEMENTATION');
	};
	self.onRosterUpdate = function(callback) {
		console.log('NEEDS IMPLEMENTATION');
	};
	self.onSessionStarted = function(callback) {
		console.log('NEEDS IMPLEMENTATION');
	};
	self.onAuthAuccess = function(callback) {
		console.log('NEEDS IMPLEMENTATION');
	};

	self.removeListener = function(name, callback) {
		client.removeListener(name, callback);
	};

	self.on = function(name, group, callback) {
		if(arguments.length === 3) {
			client.on(name, group, callback);
		} else {
			client.on(name, group);
		}
	};

	self.once = function(name, group, callback) {
		if(arguments.length === 3) {
			client.once(name, group, callback);
		} else {
			client.once(name, group);
		}
	};

	// self.boshURL = function(url) {
	//     client.config.boshURL = url;
	// };

	self.getRoster = function(callback) {
		return send(RosterGet());
	};

	self.updateRosterItem = function(item, callback) {
	    client.updateRosterItem(item, callback);
	};

	self.subscribe = function(jid, callback) {
	    client.subscribe(jid, callback);
	};

	self.unsubscribe = function(jid, callback) {
	    client.unsubscribe(jid, callback);
	};

	self.sendMessage = function(msg) {
	    client.sendMessage(msg);
	};

	self.removeRosterItem = function(jid, callback) {
	    client.removeRosterItem(jid, callback);
	};

	self.acceptSubscription = function(jid) {
	    client.acceptSubscription(jid);
	};

	self.denySubscription = function(jid) {
	    client.denySubscription(jid);
	};

	return self;
};
