const express = require('express')
  , router = express.Router()
  , users = require('./users.js');

// router.post('/login', auth.login);
router.get('/api/v1/users', users.getAll);
router.get('/api/v1/user/:id', users.getOne);
router.post('/api/v1/user/', users.create);
router.delete('/api/v1/user/:id', users.delete);
// router.put('/api/v1/user/:id', users.update);

module.exports = router;