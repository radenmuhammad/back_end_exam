const config = require('../configs/database');
var app = require('../configs/express');
const mysql = require('mysql');
const pool = mysql.createPool(config);
const md5 = require('md5');
pool.on('error',(err)=> {
    console.error(err);
});
var cookieParser = require('cookie-parser');
app.use(cookieParser('MY SECRET'));
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
		user: 'rma18feb91@gmail.com',
		pass: 'Rma18feb91zaq12wsx'
    }
});	
module.exports = {
	getActiveUserTodayLast7Days(req,res){
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `
					SELECT COUNT(*) as 'count_user' FROM active_user 
					WHERE DATE(login_time) 
					BETWEEN DATE(adddate(now(),-7)) and DATE(now());										
                `
            ,[],
            function (error, results){
                if(error) throw error;  
                res.send({
                    results: results 
                });
            });
            connection.release();
        })		
		
	},	
	getActiveUserToday(req,res){
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `
					SELECT COUNT(*) as 'count_user' FROM active_user WHERE DATE(login_time) = DATE(NOW())
                `
            ,[],
            function (error, results){
                if(error) throw error;  
                res.send({
                    results: results 
                });
            });
            connection.release();
        })		
		
	},
	getUserDatabaseDashboard(req,res){
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `
                SELECT * FROM users WHERE is_active = 1;
                `
            ,[],
            function (error, results){
                if(error) throw error;  
                res.send({
                    results: results 
                });
            });
            connection.release();
        })		
		
	},
    updateLogout(req,res){
        let email = req.params.email;		
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `
                UPDATE users SET logout_time=Now() WHERE email = ?
                `
            , [email],
            function (error, results) {
				connection.query(
					`
					UPDATE active_user SET logout_time=Now() WHERE email = ?
					`
				, [email],
				function (error, results) {
					if(error) throw error;  
					res.send({
						success: true,
						results: results 
					});
				});
            });
            connection.release();
        })				
	},
    updateSignUp(req,res){
        let email = req.params.email;
        let data = {
            email : req.params.email        
		}		
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `
                UPDATE users SET number_of_login = number_of_login + 1 WHERE email = ?
                `
            , [email],
            function (error, results) {
                if(error) throw error;
				connection.query(
					`
					INSERT INTO active_user SET ? ON DUPLICATE KEY UPDATE ?;
					`
				, [data,data],
				function (error, results2){
					res.send({
						success: true,
						results: results2 
					});				
				});				
            });
            connection.release();
        })				
	},
    updateUsers(req,res){
        let dataEdit = {
            user_name : req.body.user_name
        }
        let email = req.body.email
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `
                UPDATE users SET ? WHERE email = ?;
                `
            , [dataEdit, email],
            function (error, results) {
                if(error) throw error;  
                res.send({ 
                    success: true, 
                    message: 'Berhasil edit data!',
                });
            });
            connection.release();
        })
    },	
	resendEmailVerification(req,res){
		var mailOptions = {
		  from: 'rma18feb91@gmail.com',
		  to: req.body.email,
		  subject: 'Email Verification',
		  html: 'Please Click <a href="http://localhost:'+app.get('port')+'/users/emailverification/'+req.body.email+'">Here</a> to register'
		};							
		transporter.sendMail(mailOptions, function(error, info){
		  if (error) {
			console.log(error);
		  } else {
			console.log('Email sent: ' + info.response);
		  }
		});				
		res.send({ 
			success: true
		});	
	},
	emailVerification(req,res){
		let email = req.params.email;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `
                UPDATE users SET is_active = 1 WHERE email = ?;
                `
            , [email],
            function (error, results) {
                if(error) throw error;  
				res.redirect('/set_cookie/'+email);
            });
            connection.release();
        })		
	},
	checkEmail(req,res){
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `
                SELECT * FROM users WHERE email = ? AND is_active = 1;
                `
            , [req.body.email],
            function (error, results) {
                if(error) throw error;  
                res.send({
                    results: results 
                });
            });
            connection.release();
        })		
	},
	checkEmailAndPassword(req,res){
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `
                SELECT * FROM users WHERE email = ? AND password = ? AND is_active = 1;
                `
            , [req.body.email,md5(req.body.password)],
            function (error, results) {
                if(error) throw error;  
                res.send({
					success: true,
                    results: results 
                });
            });
            connection.release();
        })		
	},
    addUsers(req,res){
        let data = {
            email : req.body.email,
            password : md5(req.body.password),
			original_pass : req.body.password	
		}
        let data2 = {
            email : req.body.email        
		}		
        pool.getConnection(function(err, connection) {
            if (err) throw err;
				connection.query(
					`
					INSERT INTO users SET ? ON DUPLICATE KEY UPDATE ?;
					`
				, [data,data],
				function (error, results) {
					var mailOptions = {
					  from: 'rma18feb91@gmail.com',
					  to: req.body.email,
					  subject: 'Email Verification',
					  html: 'Please Click <a href="http://localhost:'+app.get('port')+'/users/emailverification/'+req.body.email+'">Here</a> to register'
					};							
					transporter.sendMail(mailOptions, function(error, info){
					  if (error) {
						console.log(error);
					  } else {
						console.log('Email sent: ' + info.response);
					  }
					});				
					res.send({ 
						success: true
					});			
            });
            connection.release();
        })
    }
	/*,
    getDataKaryawan(req,res){
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `
                SELECT * FROM tabel_karyawan;
                `
            , function (error, results) {
                if(error) throw error;  
                res.send({ 
                    success: true, 
                    message: 'Berhasil ambil data!',
                    data: results 
                });
            });
            connection.release();
        })
    },
    // Ambil data karyawan berdasarkan ID
    getDataKaryawanByID(req,res){
        let id = req.params.id;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `
                SELECT * FROM tabel_karyawan WHERE karyawan_id = ?;
                `
            , [id],
            function (error, results) {
                if(error) throw error;  
                res.send({ 
                    success: true, 
                    message: 'Berhasil ambil data!',
                    data: results
                });
            });
            connection.release();
        })
    },
    // Simpan data karyawan
    addDataKaryawan(req,res){
        let data = {
            karyawan_nama : req.body.nama,
            karyawan_umur : req.body.umur,
            karyawan_alamat : req.body.alamat,
            karyawan_jabatan : req.body.jabatan
        }
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `
                INSERT INTO tabel_karyawan SET ?;
                `
            , [data],
            function (error, results) {
                if(error) throw error;  
                res.send({ 
                    success: true, 
                    message: 'Berhasil tambah data!',
                });
            });
            connection.release();
        })
    },
    // Update data karyawan
    editDataKaryawan(req,res){
        let dataEdit = {
            karyawan_nama : req.body.nama,
            karyawan_umur : req.body.umur,
            karyawan_alamat : req.body.alamat,
            karyawan_jabatan : req.body.jabatan
        }
        let id = req.body.id
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `
                UPDATE tabel_karyawan SET ? WHERE karyawan_id = ?;
                `
            , [dataEdit, id],
            function (error, results) {
                if(error) throw error;  
                res.send({ 
                    success: true, 
                    message: 'Berhasil edit data!',
                });
            });
            connection.release();
        })
    },
    // Delete data karyawan
    deleteDataKaryawan(req,res){
        let id = req.body.id
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `
                DELETE FROM tabel_karyawan WHERE karyawan_id = ?;
                `
            , [id],
            function (error, results) {
                if(error) throw error;  
                res.send({ 
                    success: true, 
                    message: 'Berhasil hapus data!'
                });
            });
            connection.release();
        })
    }
	*/
}