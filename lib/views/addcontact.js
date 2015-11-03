module.exports = require('bdsft-sdk-view')(AddContactView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles'),
  module: 'xmpp'
})

var DirectoryDetailView = require('./directorydetail');

function AddContactView(addcontact, eventbus) {
  var self = {};

  self.updateSearchResultsContent = function(searchResults){
    self.updateContentView(self.searchResultsContent, searchResults, function(directorydetail){
      return DirectoryDetailView.create([directorydetail]);
    });
    self.searchResultsContent.toggle(true);
  };

  self.elements = ['input', 'add', 'addLink', 'cancelLink', 'form', 'searchResultsContent'];

  self.bindings = {
    searchResultsContent: {
      addcontact: 'searchResults'
    }
  };

  self.listeners = function() {
    eventbus.on('directoryDetailSelected', function(directoryDetail){
      addcontact.add(directoryDetail);
      self.searchResultsContent.toggle(false);
      self.input.val('');
    });
    self.add.on('click', function(e) {
      addcontact.add(self.input.val());
    });
    self.input.on('input propertychange paste', function(e) {
      var text = self.input.val();
      if(text.length > 2) {
        addcontact.search(text);
      }
    });
    self.cancelLink.on('click', function(e) {
      addcontact.cancel();
    });
    self.addLink.on('click', function(e) {
      addcontact.show();
      self.input.focus();
    });
  };

  return self;

}