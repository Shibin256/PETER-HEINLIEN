function usePasswordVal(password) {
  const errors = [];

  if (password.length < 6) {
    errors.push("at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("one number");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("one special character (!@#$%^&*)");
  }
  if (/\s/.test(password)) {
    errors.push("no spaces");
  }

  if (errors.length > 0) {
    return `Password must contain ${errors.join(", ")}.`;
  }

  return "";
}

export default usePasswordVal;
