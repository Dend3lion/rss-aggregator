import _ from 'lodash';

const handleValidationErrors = (elemenets, current, previous) => {
  const nowValid = _.isEmpty(current) && !_.isEmpty(previous);

  if (!nowValid) {
    const p = document.createElement('p');
    p.classList.add(
      'feedback',
      'm-0',
      'position-absolute',
      'small',
      'text-danger'
    );
    p.textContent = [current];
    elemenets.form.parentElement.append(p);
    elemenets.input.classList.add('is-invalid');
  }

  if (nowValid) {
    document.querySelector('.feedback').remove();
    elemenets.input.classList.remove('is-invalid');
  }
};

const initView = (elements) => (path, current, previous) => {
  switch (path) {
    case 'form.errors.validation':
      handleValidationErrors(elements, current, previous);
      break;
  }
};

export default initView;
