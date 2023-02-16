import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import initView from './view';
import resources from './locales/index';
import handleSubmit from './controller';

const init = async () => {
  const initialState = {
    language: 'ru',
    form: {
      status: 'ready',
      error: '',
    },
    list: {
      feeds: [],
      posts: [],
    },
  };

  const elemenets = {
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
    submit: document.querySelector('[type=submit]'),
    feedback: document.querySelector('.feedback'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
  };

  const i18nextInstance = i18next.createInstance();
  await i18nextInstance.init({
    lng: initialState.language,
    debug: false,
    resources,
  });

  const axiousInstance = axios.create({
    baseURL: 'https://allorigins.hexlet.app',
  });

  const render = initView(elemenets, i18nextInstance);
  const state = onChange(initialState, render);

  elemenets.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    handleSubmit(e.target, state, axiousInstance, i18nextInstance);
  });
};

export default init;
