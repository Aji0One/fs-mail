const express= require('express');
const router= express.Router();
const registerModule = require('../Module/registerModule')

router.post('/signup', registerModule.signup);

router.post('/signin', registerModule.signin);

router.post('/forgotpassword', registerModule.forgotpassword);

router.get('/resetpassword/:id/:token',registerModule.resetpassword);

router.post('/resetpassword/:id/:token',registerModule.resetpasswordpost);
module.exports= router;