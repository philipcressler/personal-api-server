import TwitterClient from 'twitter';
import config from '../config/main';
import moment from 'moment';

const client = new TwitterClient({
	consumer_key: config.twitter.consumer_key,
	consumer_secret: config.twitter.consumer_secret,
	access_token_key: config.twitter.access_token_key,
	access_token_secret: config.twitter.access_token_secret,
})

export const getRecentTwitterActivity = (req, res, next) => {
	Promise.all([
		getFavorites, getTimeline]).then((results) => {
			const timeline = results[0].concat(results[1])
			const lastThirtyDaysTimeline = timeline.filter((twitterEvent) => moment(twitterEvent.created_at,'dd MMM DD HH:mm:ss ZZ YYYY', 'en') > moment().subtract(30, 'days'));
			const sortedTimeline = lastThirtyDaysTimeline.sort((a, b) => moment(b.created_at,'dd MMM DD HH:mm:ss ZZ YYYY', 'en') - moment(a.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en'));
			res.status(201).json({
				result: sortedTimeline
			})
		})
}

const getTimeline = new Promise((resolve, reject) => {
	client.get('statuses/user_timeline', { screen_name: config.twitter.screen_name }, (err, tweets, response) => {
		if (err) {
			reject(err);
		}
		resolve(tweets);
	});
});

const getFavorites = new Promise((resolve, reject) => {
	client.get('favorites/list', (err, tweets, response) => {
		if (err) {
			reject(err);
		}
		resolve(tweets);
	});
});