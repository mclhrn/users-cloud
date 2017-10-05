const User = require('../models/user')
  , logger = require('winston');

const users = {

  getAll: (req, res) => {
    User.find({}, 'name email picture.thumbnail')
      .then((users) => {
        return res.json(users);
      })
      .catch((err) => {
        logger.error(err);
        return res.status(500).json({error: "Error reading users: " + err});
      });
  },

  getOne: (req, res) => {
    const id = req.params.id;
    const params = {_id: id};
    const exclude = {password: 0, salt: 0, md5: 0, sha1: 0, sha256: 0};
    User.findOne(params, exclude)
      .then((user) => {
        return res.json(user);
      })
      .catch((err) => {
        logger.error('Error reading user: ' + id);
        return res.status(500).json({error: "Error reading user: " + id});
      })
  },

  create: (req, res) => {
    if (!req || !req.body) {
      logger.info('Something went wrong creating new user');
      return res.json({"msg": "something went wrong"});
    }
    const newUser = User(generateUser(req.body));
    newUser.save()
      .then((user) => {
        return res.status(200).send({result: true});
      })
      .catch((err) => {
        logger.error('Error creating user in DB');
        return err;
      });
  },

  delete: (req, res) => {
    const id = req.params.id;
    const params = {_id: id};
    User.remove(params)
      .then(() => {
        return res.status(200).send({result: true})
      })
      .catch((err) => {
        logger.error('Error deleting user: ' + id);
        return res.status(500).json({error: "Error deleting user: " + err});
      });
  }

  // update: function (req, res) {
  // }

};

/**
 * Util function to build new user
 * @param body
 * @returns {{gender, name: {title, first: (*|string), last: (*|string)}, location: {street: (*|string), city: (*|string), state: (*|string), zip: (*|string)}, email: (*|Person.email|{type, required, index}|string), username: (*|string|string|String), password: (number|*|string|String), registered: number, dob: (*|string), phone: (*|string), cell: (*|string), PPS: (*|string), picture: {large: (*|string), medium: (*|string), thumbnail: (*|string)}}}
 */
function generateUser(body) {
  return {
    gender: body.gender,
    name: {
      title: body.name.title,
      first: body.name.first,
      last: body.name.last
    },
    location: {
      street: body.location.street,
      city: body.location.city,
      state: body.location.state,
      zip: body.location.zip
    },
    email: body.email,
    username: body.username,
    password: body.password,
    // salt: body.salt,
    // md5: body.md5,
    // sha1: body.sha1,
    // sha256: body.sha256,
    registered: new Date().getTime(),
    dob: body.dob,
    phone: body.phone,
    cell: body.cell,
    PPS: body.PPS,
    picture: {
      large: body.picture.large,
      medium: body.picture.medium,
      thumbnail: body.picture.thumbnail
    }
  };
}

module.exports = users;