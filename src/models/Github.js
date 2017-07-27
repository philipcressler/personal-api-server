import mongoose from 'mongoose';

const GithubSchema = new mongoose.Schema({
	repo: {
		type: String,
		required: true
	},
	repoLink: {
		type: String,
		require: true
	},
	eventType: {
		type: String,
		required: true
	},
	action: {
		type: String,
		required: true
	},
	properties: {
		type: Object,
	},
},
{
	timestamps: true // Saves createdAt time
});

export default mongoose.model('GithubEvent', GithubSchema);