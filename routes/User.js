
// const express = require("express");
// const { postsignup, postsignin } = require("../controllers/userdataControllers");

// const router = express.Router();
// //sign up
// router.route('/signup').post(postsignup);
// //sign in
// router.route('/signin').post(postsignin)

// module.exports = router;
 


const express = require("express");
const { postsignup, postsignin, verifyEmail, resendVerification } = require("../controllers/userdataControllers");

const router = express.Router();


router.post('/signup', postsignup);
router.post('/signin', postsignin);
router.get('/verify/:token', verifyEmail);
router.post('/resend',resendVerification);
module.exports = router;
