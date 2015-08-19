var test = require('../node_modules/webrtc-core/test/includes/common');
var extend = require('extend');
var chai = require("chai");
chai.use(require("chai-as-promised"));
var should = chai.should();

describe('client', function() {

  before(function() {
    test.createModelAndView('xmpp', {
        xmpp: require('../'),
        sound: require('webrtc-sound'),
        dms: require('webrtc-dms')
    });
    config = require('./config/default.json');
    try {
      extend(config, require('./config/test.json'));
    } catch(e) {}
    require('debug').enable('xmpp*');
    client =  bdsft_client_instances.test.xmpp.client;
  });

  it('connect and disconnect', function() {
    return client.connect({jid: config.user, password: config.xmppPassword}).then(function(){
      return client.disconnect().should.eventually.be.fulfilled;
    });
  });
  it('connect with wrong password', function() {
    return client.connect({jid: config.user, password: 'wrongpassword'}).should.eventually.be.rejected;
  });

  describe('after connect', function(){
    before(function() {
      return client.connect({jid: config.user, password: config.xmppPassword});
    });
    after(function(){
      return client.disconnect();
    });

    it('getRoster', function() {
      return client.getRoster().should.eventually.be.fulfilled;
    });

  });
});