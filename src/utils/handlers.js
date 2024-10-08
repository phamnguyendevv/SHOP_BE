const wrapAsync = (fn) => {
    return (req, res, next) => {
      return Promise.resolve(fn(req, res, next)).catch(next);
    };
  };

export default wrapAsync