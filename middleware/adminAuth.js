const Admin = require('../models/adminModel')



const isLogin = async (req, res, next) => {
    try {
        if (req.session.admin_id) {
            next();
        } else {
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.redirect('/admin'); 
        }
    } catch (error) {
        console.log(error.message);
    }
};


const isLogout = async (req, res, next) => {
    try {
        if (!req.session.admin_id) {
            next();
        } else {
            res.render('/admin');
            return;
        }
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    isLogin,
    isLogout
}