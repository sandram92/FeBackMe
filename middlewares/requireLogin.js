module.exports = (req, res, next) => {
    console.log("checking if logged in ", res)
  if (!req.user) {
    return res.status(401).send({ error: "You must be log in !" });
  }
  next();
};
