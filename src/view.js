import _ from 'lodash';

const handleValidationErrors = (elemenets, current) => {
  const feedback = document.querySelector('.feedback');
  const isValid = _.isEmpty(current);

  if (!isValid && feedback) {
    feedback.textContent = [current];
    return;
  }

  if (!isValid) {
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
    return;
  }

  elemenets.input.classList.remove('is-invalid');
  feedback?.remove();
};

const initView = (elements, i18nextInstance) => (path, current, previous) => {
  switch (path) {
    case 'form.errors.validation':
      handleValidationErrors(elements, current, previous, i18nextInstance);
      break;
    default:
  }
};

export default initView;
