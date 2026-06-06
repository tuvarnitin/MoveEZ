export const validateFiels = (fields) => {
  const errors = {};

  if ("name" in fields && !fields.name?.trim()) {
    errors.name = "Name is required";
  }

  if ("email" in fields && !fields.email?.trim()) {
    errors.email = "Email is required";
  }

  if ("password" in fields && !fields.password?.trim()) {
    errors.password = "Password is required";
  }
  return errors;
};
