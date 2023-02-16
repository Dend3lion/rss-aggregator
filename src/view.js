import { createDomElement, createGroupBlock } from './utils';

const handleErrorsDisplay = (elements, error, i18nextInstance) => {
  const { feedback } = elements;
  feedback.classList.remove('text-success');

  if (error) {
    feedback.textContent = i18nextInstance.t(error);
    feedback.classList.add('text-danger');
    elements.input.classList.add('is-invalid');
    return;
  }

  feedback.textContent = '';
  feedback.classList.remove('text-danger');
  elements.input.classList.remove('is-invalid');
};

const handleStatusChange = (elements, status, i18nextInstance) => {
  const feedback = document.querySelector('.feedback');

  switch (status) {
    case 'sending':
      elements.input.setAttribute('readonly', '');
      elements.submit.setAttribute('disabled', '');
      break;
    case 'sent':
      feedback.textContent = i18nextInstance.t('success');
      feedback.classList.add('text-success');
      break;
    case 'ready':
      elements.input.removeAttribute('readonly');
      elements.submit.removeAttribute('disabled');
      break;
    default:
  }
};

const handleFeedAddition = (elements, feeds, previous) => {
  const feedsContainer = elements.feeds;
  if (previous.length === 0) {
    const block = createGroupBlock('Фиды');
    feedsContainer.append(block);
  }
  const ul = feedsContainer.querySelector('ul');

  const lis = feeds.map(({ title, description }) => {
    const li = createDomElement('li', {
      class: 'list-group-item border-0 border-end-0',
    });
    const h3 = createDomElement('h3', { class: 'h6 m-0' }, title);
    const p = createDomElement(
      'p',
      { class: 'm-0 small text-black-50' },
      description
    );
    li.append(h3, p);

    return li;
  });

  ul.replaceChildren(...lis);
};

const handlePostsAddition = (elements, posts, previous) => {
  const postsContainer = elements.posts;
  if (previous.length === 0) {
    const block = createGroupBlock('Посты');
    postsContainer.append(block);
  }
  const ul = postsContainer.querySelector('ul');

  const lis = posts.map(({ title, url, id }) => {
    const li = createDomElement('li', {
      class:
        'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0',
    });
    const a = createDomElement(
      'a',
      {
        href: url,
        class: 'fw-bold',
        'data-id': id,
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      title
    );
    const button = createDomElement(
      'button',
      {
        type: 'button',
        class: 'btn btn-outline-primary btn-sm',
        'data-id': id,
        'data-bs-toggle': 'modal',
        'data-bs-target': '#modal',
      },
      'Просмотр'
    );
    li.append(a, button);

    return li;
  });

  ul.replaceChildren(...lis);
};

const initView = (elements, i18nextInstance) => (path, current, previous) => {
  switch (path) {
    case 'form.error':
      handleErrorsDisplay(elements, current, i18nextInstance);
      break;
    case 'form.status':
      handleStatusChange(elements, current, i18nextInstance);
      break;
    case 'list.feeds':
      handleFeedAddition(elements, current, previous);
      break;
    case 'list.posts':
      handlePostsAddition(elements, current, previous);
      break;
    default:
  }
};

export default initView;
