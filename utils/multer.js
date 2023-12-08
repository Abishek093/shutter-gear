// const multer = require("multer")

// //configure multer
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "./public/images") // Destination directory for uploaded files
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + "-" + file.originalname) // File naming strategy
//     },
// })

// const upload = multer({ storage: storage })

// module.exports = upload


/********************************************************/


const multer = require("multer");

// configure multer
const storage = (folder) => multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `./public/${folder}`);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

// create separate upload instances for category and product images
const categoryUpload = multer({ storage: storage('categoryImages') });
const productUpload = multer({ storage: storage('productImages') });

module.exports = { categoryUpload, productUpload };
