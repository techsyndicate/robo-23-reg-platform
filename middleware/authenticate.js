function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    else res.redirect('/login');
  }

function forwardAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    else res.redirect('/');
  }

function ensureAdminAuthenticated(req, res, next) {
  if(!req.isAuthenticated()) res.redirect('/login')
  if(!req.user.admin) res.redirect('/')
  else return next()
}

module.exports = { ensureAuthenticated, forwardAuthenticated, ensureAdminAuthenticated };
