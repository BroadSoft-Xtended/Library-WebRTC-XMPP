module.exports = require('webrtc-core').bdsft.Model(XMPP);

var XMPP = require('stanza.io');
var State = require('ampersand-state');
var Collection = require('ampersand-collection');


function XMPP(debug, eventbus, configuration) {
  var self = {};

  self.props = [
    'classes',
    'visible'
  ];

  self.bindings = {
    'classes': {
        xmpp: 'visible',
        configuration: 'enableXMPP'
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

  self.login = function(jid, password) {
    self.client.connect({
        jid: jid,
        password: password
    });

    return self.client;
  };

  self.init = function() {
    var client = self.client = XMPP.createClient({
      useStreamManagement: false,

      // If you have a .well-known/host-meta.json file for your 
      // domain, the connection transport config can be skipped. 

      transport: 'bosh',
      // boshURL: 'https://lance.im:5281/http-bind'
      boshURL: 'http://ums.ihs.broadsoft.com:5280'
      // (or `boshURL` if using 'bosh' as the transport) 
    });

    client.on('chat', function (msg) {
        self.messages.add({
            to: msg.to.bare,
            from: msg.from.bare,
            body: msg.body
        });
    });

    client.on('message:sent', function (msg) {
        if (!msg.body) {
            return;
        }

        self.messages.add({
            to: msg.to.bare,
            from: client.jid.bare,
            body: msg.body
        });
    });

    client.on('session:started', function () {
        self.roster.add({
            id: client.jid.bare,
            name: 'Me'
        });

        client.getRoster(function (err, res) {
            res.roster.items.forEach(function (item) {
                self.roster.add({
                    id: item.jid.bare,
                    name: item.name
                });
            });
        });

        client.sendPresence();
    });
  };

  self.listeners = function() {
    eventbus.on("started", function() {
      client.sendPresence({ show: 'dnd' });
    });
    eventbus.on("ended", function() {
      client.sendPresence();
    });
    eventbus.on('viewChanged', function(e){
      if(e.view === 'xmpp') {
        self.visible = e.visible;
      }
    });   
  };

  return self;
}
