const env = require('./src/env');

const knex = require('knex')({
	client: 'postgres',
	connection: {
		host: env.DATABASE_HOST,
		port: env.DATABASE_PORT,
		user: env.DATABASE_NAME,
		password: env.DATABASE_USERNAME,
		database: env.DATABASE_PASSWORD,
		charset: 'utf8',
	},
});
const bookshelf = require('bookshelf')(knex);

// Defining models

const FileObj = bookshelf.model('FileObj', {
	tableName: 'upload_file',
});

const File = bookshelf.model('File', {
	tableName: 'upload_file_morph',
	upload_file_id: function() {
		return this.belongsTo('FileObj');
	},
});

const User = bookshelf.model('User', {
	tableName: 'users-permissions_user',
	avatar: function() {
		return this.belongsTo('File');
	},
});

const Story = bookshelf.model('Story', {
	tableName: 'stories',
	related_id: function() {
		return this.belongsTo('File');
	},
});

module.exports = {
	File,
	Story,
	User,
};
