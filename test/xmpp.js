var test = require('bdsft-sdk-test').core;
describe('xmpp', function() {

  before(function() {
    test.createModelAndView('xmpp', {
        xmpp: require('../'),
        sound: require('webrtc-sound'),
        dms: require('webrtc-dms'),
        request: require('bdsft-sdk-request'),
        xsi: require('bdsft-sdk-xsi'),
        debug: require('bdsft-sdk-debug'),
        core: require('webrtc-core')
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