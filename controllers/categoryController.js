const Category = require('../models/categoryModel')


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
      const image = req.file.filename;
      const description = req.body.description;
  
      const existingCategory = await Category.findOne({ name });
  
      if (existingCategory) {
        res.render('add-new-category', { errorMessage: 'Category already exists.' });
        return;
      }
  
      // Category doesn't exist, create and save the new category
      const category = Category({
        name,
        image,
        description,
      });
  
      await category.save();
      res.redirect('/admin/category');
    } catch (error) {
      console.log(error.message);
      // Handle other errors as needed
    }
  };

  
const deleteCategory = async (req, res) => {
    try {
        const category_id = req.params.id;
        const category = await Category.findById(category_id);
        console.log(category);
        if (!category) {
            console.log("Category not found");
            res.status(404).send('Category not found');
            return;
        }

        category.is_Listed = !category.is_Listed;
        await category.save();
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
        res.render('editCategory',{category})
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
        // const { name, description } = req.body;
        const name = req.body.name
        const description = req.body.name
        const updateData = { name, description };
        console.log(name);

        if (req.file) {
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