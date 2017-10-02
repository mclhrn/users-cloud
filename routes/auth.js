const jwt = require('jwt-simple')
  , auth = {

  login: (req, res) => {

    let user = req.body.username || '';
    let pass = req.body.password || '';

    if (user == '' || pass == '') {
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }

    // Query DB with creds
    let dbUser = auth.validate(user, pass);

    if (!dbUser) {
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }

    // If authentication is success, we will generate a token
    // and dispatch it to the client
    if (dbUser) { res.json(genToken(dbUser)); }
  },

  validate: (user, pass) => {

    // TODO ----------------------------------------------------
    // spoofing the DB response for simplicity
    // TODO ----------------------------------------------------
    //
    //
    //
    //
    //
    const dbUserObj = { // spoofing a userobject from the DB.
      name: 'arvind',
      role: 'admin',
      username: 'arvind@myapp.com'
    };
    return dbUserObj;
  },

  validateUser: (username) => {
    const dbUser = {
      name: 'arvind',
      role: 'admin',
      username: 'arvind@myapp.com'
    };
    return dbUser;
  },
};

// private method
function genToken(user) {
  const expires = expiresIn(7); // 7 days
  const token = jwt.encode({
    exp: expires
  }, require('../config/secret')());

  return {
    token: token,
    expires: expires,
    user: user
  };
}

function expiresIn(numDays) {
  const dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;