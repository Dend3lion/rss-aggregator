import * as yup from 'yup';
import onChange from 'on-change';
import _ from 'lodash';
import initView from './view.js';

const schema = yup.object({
  url: yup.string().url('Ссылка должна быть валидным URL').required(),
});

const validate = async (obj) => {
  try {
    await schema.validate(obj);
    return [];
  } catch (err) {
    return err.errors;
  }
};

const app = () => {
  const initialState = {
    form: {
      status: 'filling',
      errors: {
        validation: [],
        network: [],
      },
    },
    feed: {
      urls: [],
    },
  };

  const elemenets = {
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
  };

  const render = initView(elemenets);
  const state = onChange(initialState, render);

  elemenets.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = new FormData(e.target).get('url').trim();

    if (state.feed.urls.includes(url)) {
      state.form.errors.validation = ['RSS уже существует'];
      return;
    }

    const validationErrors = await validate({ url });
    const isValid = _.isEmpty(validationErrors);

    state.form.errors.validation = validationErrors;
    if (isValid) state.feed.urls.push(url);
  });
};

export default app;
