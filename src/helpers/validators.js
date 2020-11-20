export const validatePassword = (password) => {
  // let reg = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  // less secure matcher for test
  let reg = /^(?=.*\d)?(?=.*[a-z])?(?=.*[A-Z])?(?=.*[a-zA-Z])?.{6,}$/;

  if (reg.test(password) === true) return true;
  return false;
};

export const validateEmail = (email) => {
  let reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  if (reg.test(email) === true) return true;
  return false;
};
