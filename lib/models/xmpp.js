module.exports = require('webrtc-core').bdsft.Model(XMPP, {
  config: require('../../js/config.js')
});

var Q = require('q');
var extend = require('extend');

function XMPP(debug, eventbus, dms, cookieconfig, client) {
  var self = {};

  self.props = ['classes', 'visible', 'connected', 'connecting', 'disconnecting'];

  self.client = client;

  self.bindings = {
    classes: {
      xmpp: ['visible', 'enableXMPP', 'connected']
    }
  }

  self.disconnect = function() {
    if(!self.connected || self.disconnecting) {
      return Q();
    }
    var deferred = Q.defer();
    self.disconnecting = true;
    debug.log('disconnecting...');
    client.disconnect();
    client.onDisconnected(function(msg, err){
        debug.log('disconnected');
        self.disconnecting = false;
        self.connected = false;
        client.releaseGroup('disconnect');
        deferred.resolve();
    });
    client.onError(function(msg, err){
        debug.error('disconnected failed : '+ JSON.stringify(err || msg));
        self.disconnecting = false;
        client.releaseGroup('disconnect');
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
      debug.log('connecting... : '+JSON.stringify(credentials)+' : '+JSON.stringify(client.config));
      client.connect(credentials);
      // client.connect({
      //       jid: 'anonymous@broadsoftlabs.com',
      //       password: 'anonymous'
      //   });
      client.onAuthAuccess(function(msg, err){
          debug.log('connected');
          self.connecting = false;
          self.connected = true;
          client.releaseGroup('connect');
          deferred.resolve();
      });
      client.onError(function(msg, err){
          debug.error('connecting failed : '+ JSON.stringify(err || msg));
          self.connecting = false;
          self.connected = true;
          client.releaseGroup('connect');
          deferred.reject(JSON.stringify(err || msg));
      });
    });
    return deferred.promise;
  };

  self.init = function() {
    // client.boshURL(self.boshURL);
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

    eventbus.on("started", function() {
      client.busy();
    });
    eventbus.on("ended", function() {
      client.active();
    });
  };

  return self;
}