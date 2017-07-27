import config from '../config/main';
import GithubEvent from '../models/Github';

export const githubWebhook = (req, res, next) => {
	// make sure only MY actions are captured
	if (req.body.sender.login === config.github) {
		// parse event and return an object with relevant info
		const githubData = parseGithubEvent(req.get('x-github-event'), req.body);

		console.log(githubData);
    const githubEvent = new GithubEvent(githubData)
    
    // save to database
    githubEvent.save((err, github) => {
      if (err) {
        return next(err);
      }
      res.status(201).json({
        githubEvent: github
      });
    });
	}
}

export const getAllGithubEvents = (req, res, next) => {
  GithubEvent.find({})
    .exec((err, events) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }

      res.status(200).json({ githubEvents: events });
    });
}

const parseGithubEvent = (event, data) => {
  let githubData;
  switch (event) {
    case 'commit_comment':
      githubData = {
        eventType: event,
        action: data.action,
        repo: data.repository.name,
        repoLink: data.repository.html_url,
        properties: {
          commentLink: data.comment.html_url,
          comment: data.comment.body,
        }
      };
      break;
    case 'create':
      githubData = {
        repo: data.repository.name,
        repoLink: data.repository.html_url,
        eventType: event,
        action: 'created',
        properties: {
          refType: data.ref_type,
          ref: data.ref,
        }
      };
      break;
    case 'delete':
      githubData = {
        eventType: event,
        action: 'deleted',
        properties: {
          refType: data.ref_type,
          ref: data.ref,
        },
        repo: data.repository.name,
        repoLink: data.repository.html_url,
      };
      break;
    case 'issue_comment':
      githubData = {
        eventType: event,
        action: data.action,
        properties: {
          issueLink: data.issue.html_url,
          commentLink: data.comment.html_url,
        },
        repo: data.repository.name,
        repoLink: data.repository.html_url,
      };
      break;
    case 'issues':
      githubData = {
        eventType: event,
        action: data.action,
        properties: {
          issueLink: data.issue.html_url,
        },
        repo: data.repository.name,
        repoLink: data.repository.html_url,
      };
      break;
    case 'label':
      githubData = {
        eventType: event,
        action: data.action,
        properties: {
          labelLink: data.label.url,
        },
        repo: data.repository.name,
        repoLink: data.repository.html_url,
      };
      break;
    case 'pull_request':
      githubData = {
        eventType: event,
        action: data.action,
        properties: {
          pullRequestLink: data.pull_request.html_url,
        },
        repo: data.repository.name,
        repoLink: data.repository.html_url,
      };
      break;
    case 'push':
      githubData = {
        eventType: event,
        action: 'pushed',
        properties: {
          ref: data.ref,
        },
        repo: data.repository.name,
        repoLink: data.repository.html_url,
      };
      break;
    case 'repository':
      githubData = {
        eventType: event,
        action: data.action,
        repo: data.repository.name,
        repoLink: data.repository.html_url,
      };
      break;
    default:
      githubData = {};
      break;
  };
  return githubData;
}