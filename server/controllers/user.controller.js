import User from '../models/user.model';

function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line
      return next();
    })
    .catch(e => next(e));
}

function get(req, res) {
  return res.json(req.user);
}

function create(req, res, next) {
  User.findOne({
    email: req.body.email
  }, (errors, user) => { // eslint-disable-line
    if (errors) throw errors;

    if (user) {
      return res.json({
        errors: 'User existed'
      });
    }

    const newUser = new User({
      email: req.body.email,
      password: req.body.password
    });

    newUser.save()
      .then(savedUser => res.json(savedUser))
      .catch(e => next(e));
  });
}

function update(req, res, next) {
  const user = req.user;
  user.username = req.body.username;
  user.mobileNumber = req.body.mobileNumber;

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e));
}

function remove(req, res, next) {
  const user = req.user;
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
