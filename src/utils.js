import * as yup from 'yup';

export const parseXML = (xml) => {
  const parser = new DOMParser();

  const doc = parser.parseFromString(xml, 'application/xml');
  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    throw new Error('errors.xml');
  }

  return doc;
};

export const validate = async (obj) => {
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

export const createDomElement = (tag, attributes = {}, text = '') => {
  const el = document.createElement(tag);
  Object.entries(attributes).forEach(([attr, value]) => {
    el.setAttribute(attr, value);
  });
  el.textContent = text;

  return el;
};

export const createGroupBlock = (title) => {
  const container = createDomElement('div', { class: 'card border-0' });
  const div = createDomElement('div', { class: 'card-body' });
  const h2 = createDomElement('h2', { class: 'card-title h4' }, title);
  div.append(h2);
  const ul = createDomElement('ul', { class: 'list-group border-0 rounded-0' });
  container.append(div, ul);

  return container;
};
