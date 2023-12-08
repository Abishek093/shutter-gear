const User = require('../models/userModel')



const loaduserDetails = async (req, res) => {

    try {

        const datas = await User.find({}).sort({ name: 1 });
        console.log(datas);
        res.render('userDetails', {datas})

    } catch (error) {
        console.log(error.message);
    }


}

const blockUser = async (req, res) => {
    try {
        const id = req.query.id;
        const user = await User.findById(id);
        if (!user) {
            console.log("User not found!");
        }
        user.is_blocked = !user.is_blocked;
        await user.save();
        res.redirect('/admin/userDetails')
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    loaduserDetails,
    blockUser
}