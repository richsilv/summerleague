Meteor.startup(function() {
	Meteor.settings.AWS = {
		accessKeyId: SecureData.findOne({name: 'AWSAccessKeyId'}).value,
		secretAccessKey: SecureData.findOne({name: 'AWSSecretKey'}).value
	};
});
