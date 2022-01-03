const router = require('express').Router();
const { loginapp } = require('../controllers');

// GET localhost:8080/karyawan => Ambil data semua karyawan
router.post('/users/checkEmailAndPassword', loginapp.checkEmailAndPassword);

router.get('/users/getActiveUserTodayLast7Days', loginapp.getActiveUserTodayLast7Days);

router.get('/users/getActiveUserToday', loginapp.getActiveUserToday);

router.get('/users/getUserDatabaseDashboard', loginapp.getUserDatabaseDashboard);

router.get('/users/userDatabaseDashboard', function (req, res, next) {
    res.render('users_database_dashboard.html');
});

router.get('/users/updateLogout/:email', loginapp.updateLogout);

router.get('/users/updateSignUp/:email', loginapp.updateSignUp);

router.post('/users/checkEmail', loginapp.checkEmail);

router.post('/users/addUsers', loginapp.addUsers);

router.post('/users/updateUsers', loginapp.updateUsers);

router.post('/users/resendEmailVerification', loginapp.resendEmailVerification);

router.get('/users/emailverification/:email', loginapp.emailVerification);

router.get('/users/profile', function (req, res, next) {
    res.render('users_profile.html');
});

router.get('/users/reset_password', function (req, res, next) {
    res.render('users_reset_password.html');
});


/*
// GET localhost:8080/karyawan/2 => Ambil data semua karyawan berdasarkan id = 2
router.get('/karyawan/:id', loginapp.getDataKaryawanByID);

// POST localhost:8080/karyawan/add => Tambah data karyawan ke database
router.post('/karyawan/add', loginapp.addDataKaryawan);

// POST localhost:8080/karyawan/2 => Edit data karyawan
router.post('/karyawan/edit', loginapp.editDataKaryawan);

// POST localhost:8080/karyawan/delete => Delete data karyawan
router.post('/karyawan/delete/', loginapp.deleteDataKaryawan);
*/
router.get('/', function (req, res, next) {
    res.render('login.html');
});

router.get('/active_email', function (req, res, next) {
    res.render('active_email.html');
});

router.get('/set_cookie/:email', function (req, res, next) {
    res.render('set_cookie.html',{email:req.params.email});
});

router.get('/common', function (req, res) {
    res.sendFile('src/js/common.js', { root: '.' });
});
router.get('/signup', function (req, res, next) {
    res.render('signup.html');
});

router.get('/home', function (req, res, next) {
    res.render('home.html');
});
module.exports = router;