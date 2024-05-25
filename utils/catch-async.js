<<<<<<< HEAD
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};
=======
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};
>>>>>>> 35b1c170158d3d3d55ec132a50c3b97ec1117b0a
