module.exports = require('bdsft-sdk-model')(XMPP, {
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
    client.on('disconnected', 'disconnect', function(msg, err){
        debug.log('disconnected');
        self.disconnecting = false;
        self.connected = false;
        client.releaseGroup('disconnect');
        deferred.resolve();
    });
    client.once('stream:error', 'disconnect', function(msg, err){
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
      client.once('auth:success', 'connect', function(msg, err){
          debug.log('connected');
          self.connecting = false;
          self.connected = true;
          client.releaseGroup('connect');
          deferred.resolve();
      });
      client.once('stream:error', 'connect', function(msg, err){
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
    client.boshURL(self.boshURL);
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


    client.on('*', function (msg, obj) {
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
      client.busy();
    });
    eventbus.on("ended", function() {
      client.active();
    });
  };

  return self;
}