/* eslint-disable no-param-reassign */
import { AxiosError } from 'axios';
import _ from 'lodash';
import { validate, parseXML } from './utils';

const routes = {
  get: (url) => `/get?disableCache=true&url=${encodeURIComponent(url)}`,
};

const processFeed = (doc, state, url) => {
  const title = doc.querySelector('title').textContent;
  const description = doc.querySelector('title').textContent;
  const id = state.list.feeds.length + 1;
  const newFeed = { id, title, description, url };

  return newFeed;
};

const processPosts = (doc, posts, feedId) => {
  const itemsEls = doc.querySelectorAll('item');
  const newPosts = Array.from(itemsEls).reduce((acc, item, index) => {
    const title = item.querySelector('title').textContent;
    const url = item.querySelector('link').textContent;
    const description = item.querySelector('description').textContent;
    const id = posts.length + index + 1;

    if (!_.find(posts, { url })) {
      const post = { id, title, description, url, feedId };
      return [...acc, post];
    }

    return acc;
  }, []);

  return newPosts;
};

const makeRequest = (state, axiousInstance, url, feedId = '') => {
  axiousInstance
    .get(routes.get(url))
    .then(({ data }) => data.contents)
    .then((xml) => parseXML(xml))
    .then((doc) => {
      if (!feedId) {
        const feed = processFeed(doc, state, url);
        state.list.feeds.push(feed);
        state.form.error = '';
        state.form.status = 'sent';
      }

      const posts = processPosts(doc, state.list.posts, feedId);
      state.list.posts.push(...posts);
    })
    .catch((err) => {
      if (err instanceof AxiosError) {
        state.form.error = 'errors.network';
        return;
      }

      state.form.error = err.message;
    });
};

export const watchForNewPosts = (state, axiousInstance) => {
  state.list.feeds.forEach(({ id, url }) => {
    makeRequest(state, axiousInstance, url, id);
  });

  setTimeout(() => watchForNewPosts(state, axiousInstance), 5000);
};

export const handleSubmit = async (form, state, axiousInstance) => {
  const url = new FormData(form).get('url').trim();
  const isUnique = !_.find(state.list.feeds, { url });

  if (!isUnique) {
    state.form.error = 'errors.exists';
    return;
  }

  const validationErrors = await validate({ url });
  const isValid = _.isEmpty(validationErrors);

  if (!isValid) {
    const [errorCode] = validationErrors;
    state.form.error = errorCode;
    return;
  }

  state.form.status = 'sending';
  makeRequest(state, axiousInstance, url);
  state.form.status = 'ready';
};
