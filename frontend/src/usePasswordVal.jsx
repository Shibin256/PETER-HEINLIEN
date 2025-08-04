function usePasswordVal(value) {
  if (value.length < 6) {
    return "Password must be at least 6 characters long.";
  }
  if (/\s/.test(value)) {
    return "Password must not contain spaces.";
  }
  if (!/[!@#$%^&*]/.test(value)) {
    return "Password must contain at least one special character.";
  }
  return "";
}
export default usePasswordVal;
