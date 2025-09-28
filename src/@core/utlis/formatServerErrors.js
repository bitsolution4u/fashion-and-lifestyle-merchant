const formatServerError = (errors) => {
  console.log(errors);
  let errorAll = {};
  errors?.forEach((error) => {
    const key = error?.path;
    if (!errorAll[key]) {
      errorAll[key] = error?.msg;
    }
  });

  console.log(errorAll);
  return errorAll;
};

export default formatServerError;
