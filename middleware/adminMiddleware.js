module.exports = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // keçid verir
    return res.status(403).json({ message: "Access denied: Yalniz Admin" });
  }
};
