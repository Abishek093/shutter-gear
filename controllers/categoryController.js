const Category = require('../models/categoryModel')
const Product = require('../models/productModel')

const loadCategory = async(req, res)=>{
    try {
        const allCategory = await Category.find()
        res.render('category',{allCategory})

    } catch (error) {
        console.log(error.message);
    }
}

// const loadNewCategory = async(req, res)=>{
//     try {
//         res.render('add-new-category')
//     } catch (error) {
//         console.log(error.message);
//     }
// }

// const AddNewCategory = async(req, res)=>{
//     try {

//         const name = req.body.name
//         const image = req.file.filename
//         const description = req.body.description

//         const category = Category({
//             name,
//             image,
//             description
//         })
//         await category.save()
//         res.redirect('/admin/category');
//     } catch (error) {
//        console.log(error.message); 
//     }
// }



const loadNewCategory = async (req, res) => {
    try {
      var errorMessage = ''
      res.render('add-new-category',{errorMessage});
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const AddNewCategory = async (req, res) => {
    try {
      const name = req.body.name;
      const image = req.file;
      const description = req.body.description;
  
      // Check if the uploaded file is an image
      if (!isValidImage(image)) {
        res.render('add-new-category', { errorMessage: 'Invalid file format. Only images are allowed.',
            name: req.body.name,
            description: req.body.description
        });
        return;
      }
  
      const existingCategory = await Category.findOne({ name });
  
      if (existingCategory) {
        res.render('add-new-category', { errorMessage: 'Category already exists.' });
        return;
      }
  
      // Category doesn't exist, create and save the new category
      const category = new Category({
        name,
        image: image.filename,
        description,
      });
  
      await category.save();
      res.redirect('/admin/category');
    } catch (error) {
      console.log(error.message);
      // Handle other errors as needed
    }
  };
  
  // Function to check if the file is a valid image
  function isValidImage(file) {
    // Add additional checks if needed
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return allowedImageTypes.includes(file.mimetype)
  }
  

  

  
  const deleteCategory = async (req, res) => {
    try {
        const category_id = req.params.id;
        const category = await Category.findById(category_id);
        
        if (!category) {
            console.log("Category not found");
            res.status(404).send('Category not found');
            return;
        }

        // Update category's is_Listed field
        category.is_Listed = !category.is_Listed;
        await category.save();

        // Update is_Listed field for associated products based on category name
        await Product.updateMany({ category: category.name }, { $set: { is_Listed: category.is_Listed } });

        res.redirect("/admin/category");
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};



const loadEditCategory = async(req, res)=>{
    try {
        const category_id = req.params.id
        const category = await Category.findById(category_id)
        const errorMessage = ''
        res.render('editCategory',{category, errorMessage})
    } catch (error) {
        console.log(error.message);
    }
}


// const editCategory = async(req, res)=>{
//     try {
//         const category_id = req.params.id
//         const {name , description} = req.body

//         if(req.file){
//             const image = req.file.filename
//             const updateCategory = await Category.findByIdAndUpdate(
//                 {_id: category_id},
//                 {name, description, image: image},
//                 {new: true}
//             );
//             if(updateCategory){
//                 console.log("Success");
//             }else{
//                 console.log("Error occured");
//             }
//         }else{
//             const updateCategory = await Category.findByIdAndUpdate(
//                 { _id: category_id },
//                 { name, description },
//                 { new: true }
//             );
//             if (updateCategory) {
//                 console.log('Category Updated:', updateCategory);
//             } else {
//                 console.log('Category not found or update failed.');
//             }
//         }
//         res.redirect('/admin/category');

//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send('Internal Server Error');
//     }
// }    

const editCategory = async (req, res) => {
  try {
    let category_id = req.params.id;
    const name = req.body.name;
    const description = req.body.description;
    const updateData = { name, description };
    const category = await Category.findById(category_id)

    const existingCategory = await Category.findOne({ name });

    if (existingCategory && existingCategory._id.toString() !== category_id) {
      res.render('editCategory', {category, errorMessage: 'Category already exists.' });
      return;
    }

    if (req.file) {
      // Validate if the uploaded file is an image
      const validImageTypes = ['image/jpeg', 'image/png'];
      if (!validImageTypes.includes(req.file.mimetype)) {
        res.render('editCategory', {category, errorMessage: 'Invalid file type. Only JPEG or PNG images are allowed.'});
        return;
      }

      updateData.image = req.file.filename;
    }

    const updatedCategory = await Category.findOneAndUpdate(
      { _id: category_id },
      updateData,
      { new: true }
    );

    if (updatedCategory) {
      console.log('Category Updated:', updatedCategory);
      res.redirect('/admin/category');
    } else {
      console.log('Category not found or update failed.');
      res.status(404).send('Category not found');
    }
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).send('Internal Server Error');
  }
};





module.exports={
    loadCategory,
    loadNewCategory,
    AddNewCategory,
    deleteCategory,
    loadEditCategory,
    editCategory,
};