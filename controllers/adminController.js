const Admin = require("../models/adminModel")
const path = require('path')


const loadLogin = async (req, res) => {
    try {
      res.render('adminLogin');
    } catch (error) {
      console.log(error.message);
    }
}


const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const adminData = await Admin.findOne({ email });
        console.log(adminData);

        if (adminData) {
            if (adminData.password === password) {
                req.session.admin_id = adminData._id;
                res.redirect('admin/dashboard'); 
            } else {
                console.log("Invalid password");
                res.redirect('admin/adminlogin'); 
            }
        } else {
            console.log("User not found");
            res.redirect('/adminlogin'); 
        }
    } catch (error) {
        console.log(error.message);
        res.redirect('/adminlogin'); 
    }
};

const loadDashboard = async(req,res)=>{
    try {
        res.render('dashboard')
    } catch (error) {
        console.log(error.message);
    }
}



module.exports={
    loadLogin,
    verifyLogin,
    loadDashboard,
    
};