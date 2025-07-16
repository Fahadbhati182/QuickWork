const AsyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.error(err.message);
      next(err);
    });
  };
};


export default AsyncHandler;