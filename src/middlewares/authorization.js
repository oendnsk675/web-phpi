exports.checkAuthorization = (req, res, next) => {
  const { role } = req.session.user;
  if (role !== 'admin' || !req.session.user) {
    return res.render('pages/errors/unauthorized', {
      title: 'Unauthorized',
    });
  }
  next();
};
