/* eslint-disable no-param-reassign */
import { AxiosError } from 'axios';
import _ from 'lodash';
import { validate, parseXML } from './utils';

const routes = {
  get: (url) => `/get?disableCache=true&url=${encodeURIComponent(url)}`,
};

export default async (form, state, axiousInstance) => {
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
  axiousInstance
    .get(routes.get(url))
    .then(({ data }) => data.contents)
    // eslint-disable-next-line consistent-return
    .then((xml) => parseXML(xml))
    .then((doc) => {
      const title = doc.querySelector('title').textContent;
      const description = doc.querySelector('title').textContent;
      const id = state.list.feeds.length + 1;
      const feed = { id, title, description, url };

      const itemsEls = doc.querySelectorAll('item');
      const items = Array.from(itemsEls).map((item) => {
        const itemTitle = item.querySelector('title').textContent;
        const itemUrl = item.querySelector('link').textContent;
        const itemDescription = item.querySelector('description').textContent;
        const itemId = state.list.posts.length + 1;

        return {
          id: itemId,
          title: itemTitle,
          descreiption: itemDescription,
          url: itemUrl,
          feedId: id,
        };
      });

      state.list.feeds.push(feed);
      state.list.posts.push(...items);
      state.form.error = '';
      state.form.status = 'sent';
    })
    .catch((err) => {
      if (err instanceof AxiosError) {
        state.form.error = 'errors.network';
        return;
      }

      state.form.error = err.message;
    })
    .finally(() => {
      state.form.status = 'ready';
    });
};
