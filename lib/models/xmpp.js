module.exports = require('webrtc-core').bdsft.Model(XMPP, {
  config: require('../../js/config.js')
});

var Q = require('q');
var Contact = require('./contact');
var Message = require('./message');

function XMPP(debug, eventbus, dms, cookieconfig) {
  var self = {};

  self.updateContactSelected = function(contact) {
    self.contactSelected = !!contact;
  }

  var addMessage = function(msg){
    var message = Message.create([msg]);
    (self.contacts[message.to] || self.contacts[message.from]).addMessage(message);
  };

  self.props = ['classes', 'visible', 'connected', 'connecting', 'disconnecting', 'contacts', 'messages', 'contact', 
  'contactSelected'];

  self.bindings = {
    classes: {
      xmpp: ['visible', 'enableXMPP', 'connected', 'contactSelected']
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

  self.sendMessage = function(text, chatState){
    var msg = {
        to: self.contact.id,
        body: text
    };
    if(chatState) {
      msg.chatState = chatState;
    }
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
    self.messages = {};
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

    self.client.on('chat', function (msg) {
        debug.log('chat : '+JSON.stringify(msg));
        addMessage(msg);
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
          self.contacts[presence.from.bare].presence = presence.show || 'available';
        }
    });

    self.client.on('session:started', function () {
        debug.log('session:started : getRoster');
        self.client.getRoster(function (err, res) {
            debug.log('session:started : contacts retrieved : '+JSON.stringify(res.roster.items));
            self.contacts = res.roster.items.map(function (item) {
                return Contact.create([item]);
            }).reduce(function(obj, contact) {
              obj[contact.id] = contact;
              return obj;
            }, {});
        });

        self.client.sendPresence();
    });

    self.client.on('*', function (msg, obj) {
        debug.log('------ '+msg+' : '+JSON.stringify(obj));
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