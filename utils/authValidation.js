const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email) {
  if (!email.trim()) {
    return 'Informe seu e-mail.';
  }

  if (!EMAIL_PATTERN.test(email.trim())) {
    return 'Informe um e-mail válido.';
  }

  return '';
}

export function validateLogin({ email, password }) {
  const errors = {};
  const emailError = validateEmail(email);

  if (emailError) {
    errors.email = emailError;
  }
  if (!password) {
    errors.password = 'Informe sua senha.';
  }

  return errors;
}

export function validateSignUp({ name, email, password }) {
  const errors = {};
  const emailError = validateEmail(email);

  if (!name.trim()) {
    errors.name = 'Informe seu nome.';
  } else if (name.trim().length > 120) {
    errors.name = 'O nome deve ter até 120 caracteres.';
  }
  if (emailError) {
    errors.email = emailError;
  }
  if (!password) {
    errors.password = 'Informe sua senha.';
  } else if (password.length < 8 || password.length > 72) {
    errors.password = 'A senha deve ter entre 8 e 72 caracteres.';
  }

  return errors;
}
