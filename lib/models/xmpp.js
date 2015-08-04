module.exports = require('webrtc-core').bdsft.Model(XMPP, {
  config: require('../../js/config.js')
});

var Q = require('q');
var extend = require('extend');
var Contact = require('./contact');
var MyContact = require('./mycontact');
var Message = require('./message');
var ee = require('event-emitter');

function XMPP(debug, eventbus, dms, cookieconfig) {
  var self = {};

  self.updateContactSelected = function(contact) {
    self.contactSelected = !!contact;
  }

  var addMessage = function(msg){
    var message = Message.create([msg]);
    (self.contacts[message.to] || self.contacts[message.from]).addMessage(message);
    return message;
  };

  var removeContact = function(id){
    delete self.contacts[id];
  };

  var addContact = function(contact){
    if(contact.id === self.client.jid.bare) {
      return;
    }

    self.contacts[contact.id] = contact;
  };

  var addSubscription = function(subscription){
    self.subscriptions[subscription.id] = subscription;
  };

  var removeSubscription = function(id){
    delete self.subscriptions[id];
  };

  var emitter = ee({});

  self.props = ['classes', 'visible', 'connected', 'connecting', 'disconnecting', 'contacts', 'contact', 
  'contactSelected', 'subscriptions', 'subscriptionsVisible', 'removeContactFailed', 'myContact'];

  self.bindings = {
    classes: {
      xmpp: ['visible', 'enableXMPP', 'connected', 'contactSelected', 'subscriptionsVisible']
    },
    contactSelected: {
      xmpp: 'contact'
    }
  }

  var opts = {
    useStreamManagement: false,
    transports: ['bosh'],
    wait: 20
  };
  self.client = require('stanza.io').createClient(opts);

  self.sendPresence = function(presence){
    if(presence) {
      self.client.sendPresence({ show: presence });
    } else {
      self.client.sendPresence();
    }
  };

  self.busy = function(){
    self.client.sendPresence({ show: 'dnd' });
  };

  self.active = function(){
    self.client.sendPresence();
  };

  self.selectContact = function(contact){
    self.contact = contact;
  };

  self.deselectContact = function(){
    self.contact = undefined;
  };

  self.hideSubscriptions = function(){
    self.subscriptionsVisible = false;
  };

  self.acceptSubscription = function(contact){
    self.client.acceptSubscription(contact.id);
    removeSubscription(contact.id);
    addContact(contact);
  };

  self.onCloseContact = function(cb){
    emitter.on('closeContact', cb);
  };
  self.onRemoveContactFailed = function(cb){
    emitter.on('removeContactFailed', cb);
  };
  self.onAddContactFailed = function(cb){
    emitter.on('addContactFailed', cb);
  };

  self.closeContact = function(contact){
    emitter.emit('closeContact', contact);
    if(contact === self.contact) {
      self.deselectContact();
    }
  };

  self.addContact = function(contact){
    self.client.updateRosterItem({jid: contact.id, name: contact.name}, function(e){
      debug.log('updateRosterItem : '+JSON.stringify(e));
      if(e && e.error) {
        emitter.emit('addContactFailed', e.error);
      }
    });
    self.client.subscribe(contact.id, function(e){
      debug.log('subscribe : '+JSON.stringify(e));
    });
  };

  self.removeContact = function(contact){
    self.client.removeRosterItem(contact.id, function(e){
      debug.log('removeContact : '+JSON.stringify(e));
      if(e && e.error) {
        emitter.emit('removeContactFailed', e.error);
        addContact(contact);
      }
    });
    self.client.unsubscribe(contact.id, function(e){
      debug.log('unsubscribe : '+JSON.stringify(e));
    });
    removeContact(contact.id);
  };

  self.denySubscription = function(contact){
    self.client.denySubscription(contact.id);
    removeSubscription(contact.id);
  };

  self.sendMessage = function(text, chatState){
    var msg = {
      type: 'chat',
      to: self.contact.id,
      body: text,
      chatState: chatState || 'active'
    };
    debug.log('sendMessage : '+JSON.stringify(msg));
    self.client.sendMessage(msg);
  };

  self.disconnect = function() {
    if(!self.connected || self.disconnecting) {
      return Q();
    }
    var deferred = Q.defer();
    self.disconnecting = true;
    debug.log('disconnecting...');
    self.client.disconnect();
    self.client.on('disconnected', 'disconnect', function(msg, err){
        debug.log('disconnected');
        self.disconnecting = false;
        self.connected = false;
        self.client.releaseGroup('disconnect');
        deferred.resolve();
    });
    self.client.once('stream:error', 'disconnect', function(msg, err){
        debug.error('disconnected failed : '+ JSON.stringify(err || msg));
        self.disconnecting = false;
        self.client.releaseGroup('disconnect');
        deferred.reject(JSON.stringify(err || msg));
    });

    return deferred.promise;
  };

  self.connect = function(jid, password) {
    if(self.connecting) {
      return Q();
    }
    var deferred = Q.defer();
    var promise = Q.reject();
    if(self.enableXMPP && !self.connected) {
      if(dms.enabled && (!jid || !password) && cookieconfig.userid && cookieconfig.password) {
        self.connecting = true;
        debug.log('retrieve credentials through DMS... : '+cookieconfig.userid);

        promise = dms.requestConfig(cookieconfig.userid, cookieconfig.password).then(function(dmsConfig){
          var xmppConfig = dmsConfig.protocols.xmpp;
          if(!xmppConfig || !xmppConfig.credentials) {
            debug.error('no XMPP service enabled for '+dms.deviceType+' and user : ' + cookieconfig.userid);
            return;
          }
          debug.log('credentials retrieved : '+xmppConfig.credentials.username);
          return {jid: xmppConfig.credentials.username, password: xmppConfig.credentials.password};
        });
      } else if(jid && password) {
        self.connecting = true;
        promise = Q({
            jid: jid,
            password: password
        });
      }
    }
    promise.then(function(credentials){
      debug.log('connecting... : '+JSON.stringify(credentials)+' : '+JSON.stringify(self.client.config));
      self.client.connect(credentials);
      self.client.once('auth:success', 'connect', function(msg, err){
          debug.log('connected');
          self.connecting = false;
          self.connected = true;
          self.client.releaseGroup('connect');
          deferred.resolve();
      });
      self.client.once('stream:error', 'connect', function(msg, err){
          debug.error('connecting failed : '+ JSON.stringify(err || msg));
          self.connecting = false;
          self.connected = true;
          self.client.releaseGroup('connect');
          deferred.reject(JSON.stringify(err || msg));
      });
    });
    return deferred.promise;
  };

  self.init = function() {
    self.client.config.boshURL = self.boshURL;
    self.subscriptions = {};
    self.connect();
  };

  self.listeners = function(cookieconfigDatabinder, databinder) {
    cookieconfigDatabinder.onModelPropChange(['userid', 'password'], function(value, name){
      if(!value) {
        self.disconnect();
      } else {
        self.connect();
      }
    });
    databinder.onModelPropChange('enableXMPP', function(value){
      if(value) {
        self.connect();
      } else {
        self.disconnect();
      }
    });

    self.client.on('subscribe', function (msg) {
        debug.log('subscribe : '+JSON.stringify(msg));
        var subscription = Contact.create([msg.from, self]);
        addSubscription(subscription);
        self.subscriptionsVisible = true;
    });

    self.client.on('unsubscribe', function (msg) {
        debug.log('unsubscribe : '+JSON.stringify(msg));
        removeSubscription(msg.from.bare);
    });

    self.client.on('available', function (msg) {
        debug.log('available : '+JSON.stringify(msg));
        var contact = self.contacts[msg.from.bare];
        if(contact) {
          contact.available();
        } else {
          debug.warn('no contact found : '+msg.from.bare);
        }
    });

    self.client.on('unavailable', function (msg) {
        debug.log('unavailable : '+JSON.stringify(msg));
        var contact = self.contacts[msg.from.bare];
        if(contact) {
          contact.unavailable();
        } else {
          debug.warn('no contact found : '+msg.from.bare);
        }
    });

    self.client.on('chat', function (msg) {
        debug.log('chat : '+JSON.stringify(msg));
        var message = addMessage(msg);
        self.contact = self.contacts[message.from];
    });

    self.client.on('message:sent', function (msg) {
        if (!msg.body) {
          debug.warn('message:sent : no body')
          return;
        }

        msg.from = self.client.jid.bare;
        debug.log('message:sent : '+JSON.stringify(msg));
        addMessage(msg);
    });

    self.client.on('presence', function (presence) {
        debug.log('presence : '+JSON.stringify(presence));
        if(self.contacts[presence.from.bare]) {
          self.contacts[presence.from.bare].presence = presence.show || presence.type || 'available';
        }
    });

    self.client.on('session:started', function () {
        debug.log('session:started : getRoster');
        self.myContact = MyContact.create([self.client, self]);
        self.client.getRoster(function (err, res) {
            debug.log('session:started : contacts retrieved : '+JSON.stringify(res.roster.items));
            self.contacts = res.roster.items.map(function (item) {
                return Contact.create([item, self]);
            }).reduce(function(obj, contact) {
              obj[contact.id] = contact;
              return obj;
            }, {}) || [];
        });

        self.client.sendPresence();
    });

    self.client.on('*', function (msg, obj) {
      function censor(censor) {
        var i = 0;

        return function(key, value) {
          if(i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value) 
            return '[Circular]'; 

          if(i >= 29) // seems to be a harded maximum of 30 serialized objects?
            return '[Unknown]';

          ++i; // so we know we aren't using the original object anymore

          return value;  
        }
      }
      debug.log('------ '+msg+' : '+JSON.stringify(obj, censor(obj)));
    });

    eventbus.on("started", function() {
      self.busy();
    });
    eventbus.on("ended", function() {
      self.active();
    });
  };

  return self;
}