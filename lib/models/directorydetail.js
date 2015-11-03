module.exports = require('bdsft-sdk-model')(DirectoryDetail);

function DirectoryDetail(item, eventbus) {
	var self = {};

	self.updateName = function(){
		self.name = self.firstName + ' ' + self.lastName;
	};

	self.props = ['userId', 'firstName', 'lastName', 'groupId', 'number', 'impId', 'bridgeId', 'roomId', 'name'];

	self.bindings = {
		name: {
			self: ['firstName', 'lastName']
		}
	};

	self.init = function(){
		self.userId = item.userId;
		self.firstName = item.firstName;
		self.lastName = item.lastName;
		self.groupId = item.groupId;
		self.number = item.number;
		self.impId = item.additionalDetails && item.additionalDetails.impId;
		self.bridgeId = item.additionalDetails && item.additionalDetails.bridgeId;
		self.roomId = item.additionalDetails && item.additionalDetails.roomId;
	};

	self.select = function(){
		eventbus.emit('directoryDetailSelected', self);
	}
	return self;
}