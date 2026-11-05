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

export const PASSWORD_STRENGTH_LEVELS = [
  { label: '', color: '#202538' },
  { label: 'fraca', color: '#FF7A59' },
  { label: 'média', color: '#FFC978' },
  { label: 'boa', color: '#9FA8FF' },
  { label: 'forte', color: '#57DDA9' },
];

// Pontuação de 0 a 4; o índice corresponde a PASSWORD_STRENGTH_LEVELS.
export function passwordStrength(password) {
  if (!password) {
    return 0;
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-zA-Z]/.test(password) && /\d/.test(password)) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password) || password.length >= 12) score++;
  // Qualquer senha digitada já aparece como "fraca", para a barra reagir desde o primeiro caractere.
  return Math.max(score, 1);
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
