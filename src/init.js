import * as yup from 'yup';
import onChange from 'on-change';
import _ from 'lodash';
import i18next from 'i18next';
import initView from './view';
import resources from './locales/index';

const validate = async (obj) => {
  yup.setLocale({
    string: {
      url: 'errors.url',
    },
  });

  const schema = yup.object({
    url: yup.string().url().required(),
  });

  try {
    await schema.validate(obj);
    return [];
  } catch (err) {
    return err.errors;
  }
};

const init = async () => {
  const initialState = {
    language: 'ru',
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

  const i18nextInstance = i18next.createInstance();
  await i18nextInstance.init({
    lng: initialState.language,
    debug: false,
    resources,
  });

  const render = initView(elemenets, i18nextInstance);
  const state = onChange(initialState, render);

  elemenets.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = new FormData(e.target).get('url').trim();

    if (state.feed.urls.includes(url)) {
      state.form.errors.validation = [i18nextInstance.t('errors.exists')];
      return;
    }

    const validationErrors = await validate({ url });
    const isValid = _.isEmpty(validationErrors);

    state.form.errors.validation = validationErrors.map(i18nextInstance.t);
    if (isValid) state.feed.urls.push(url);
  });
};

export default init;
