var test = require('../node_modules/webrtc-core/test/includes/common');
var extend = require('extend');
var chai = require("chai");
chai.use(require("chai-as-promised"));
var should = chai.should();

describe('xmpp', function() {

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
  });

  it('connect and disconnect', function() {
    xmpp.enableXMPP = true;
    return xmpp.connect(config.user, config.xmppPassword).then(function(){
      return xmpp.disconnect().should.eventually.be.fulfilled;
    });
  });
  it('connect with wrong password', function() {
    xmpp.enableXMPP = true;
    return xmpp.connect(config.user, 'wrongpassword').should.eventually.be.rejected;
  });
});