module.exports = require('bdsft-sdk-view')(DirectoryDetailView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles')
})

function DirectoryDetailView(directorydetail) {
  var self = {};

  self.elements = ['firstName', 'lastName'];

  self.listeners = function() {
    self.view.on('click', function(e){
      e.preventDefault();
      directorydetail.select();
    });
  };

  return self;

}