module.exports = (req, res, next) => {
  if (req.user && req.user.admin) {
    // Someone is logged in; AND they are also an admin. Let them through
    next()
  }
  else {
    // No one is logged in, or they don't belong. This is bad. Redirect them away from protected page!
    req.flash('error', 'You must be an ADMIN to view this page')
    res.redirect('/profile')
  }
}
