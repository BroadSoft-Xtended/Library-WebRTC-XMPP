module.exports = require('webrtc-core').bdsft.Model(XMPP, {
  config: require('../../js/config.js')
});

var State = require('ampersand-state');
var Collection = require('ampersand-collection');
var Q = require('q');

function XMPP(debug, eventbus, dms, cookieconfig) {
  var self = {};

  self.props = ['classes', 'visible', 'connected', 'connecting', 'disconnecting'];

  self.bindings = {
    'classes': {
        xmpp: ['visible', 'enableXMPP', 'connected']
    }
  }

  self.messages = new Collection([], {
      model: State.extend({
          props: {
              to: 'string',
              from: 'string',
              body: 'string'
          }
      })
  });

  self.roster = new Collection([], {
      model: State.extend({
          idAttribute: 'id',
          props: {
              id: 'string',
              name: 'string'
          },
          derived: {
              displayName: {
                  deps: ['id', 'name'],
                  fn: function () {
                      return this.name || this.id;
                  }
              }
          }
      })
  });

  var opts = {
    useStreamManagement: false,
    transports: ['bosh'],
    wait: 20
  };
  self.client = require('stanza.io').createClient(opts);


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
      if((!jid || !password) && cookieconfig.userid && cookieconfig.password) {
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
    databinder.onModelPropChange('enableXMPP', function(){
      self.connect();
    });

    self.client.on('chat', function (msg) {
        self.messages.add({
            to: msg.to.bare,
            from: msg.from.bare,
            body: msg.body
        });
    });

    self.client.on('message:sent', function (msg) {
        if (!msg.body) {
            return;
        }

        self.messages.add({
            to: msg.to.bare,
            from: self.client.jid.bare,
            body: msg.body
        });
    });

    self.client.on('session:started', function () {
        self.roster.add({
            id: self.client.jid.bare,
            name: 'Me'
        });

        self.client.getRoster(function (err, res) {
            res.roster.items.forEach(function (item) {
                self.roster.add({
                    id: item.jid.bare,
                    name: item.name
                });
            });
        });

        self.client.sendPresence();
    });
    eventbus.on("started", function() {
      self.client.sendPresence({ show: 'dnd' });
    });
    eventbus.on("ended", function() {
      self.client.sendPresence();
    });
  };

  return self;
}
