//script add new product 11-01-2024

<!-- <script>
  $(document).ready(function() {
if (window.File && window.FileList && window.FileReader) {
  $("#files").on("change", function(e) {
    var files = e.target.files,
      filesLength = files.length;
    for (var i = 0; i < filesLength; i++) {
      var f = files[i]
      var fileReader = new FileReader();
      fileReader.onload = (function(e) {
        var file = e.target;
        $("<span class=\"pip\">" +
          "<img class=\"imageThumb\" src=\"" + e.target.result + "\" title=\"" + file.name + "\"/>" +
          "</span>").insertAfter("#files");
        $(".remove").click(function(){
          $(this).parent(".pip").remove();
        });
      });
      fileReader.readAsDataURL(f);
    }
    console.log(files);
  });
} else {
  alert("Your browser doesn't support to File API")
}
});
</script> -->

<!-- <script>
    document.addEventListener('DOMContentLoaded', function () {
        const form = document.querySelector('.mega-form');

        form.addEventListener('submit', function (event) {
            let isValid = true;

            // Reset previous error messages
            const productName = form.querySelector('input[name="title"]');
            if (!productName.value.trim()) {
                isValid = false;
                showError(productName, 'Product Name is required');
            }

            // Validate Category
            const category = form.querySelector('select[name="category"]');
            if (!category.value || category.value === 'Select category') {
                isValid = false;
                showError(category, 'Please select a category');
            }

            // Validate Brand using regex (only letters and spaces allowed)
            const brand = form.querySelector('input[name="brand"]');
            if (!/^[A-Za-z\s]+$/.test(brand.value.trim())) {
                isValid = false;
                showError(brand, 'Brand should contain only letters and spaces');
            }

            // Validate Model using regex (only letters, numbers, and spaces allowed)
            const model = form.querySelector('input[name="model"]');
            if (!/^[A-Za-z0-9\s]+$/.test(model.value.trim())) {
                isValid = false;
                showError(model, 'Model should contain only letters, numbers, and spaces');
            }

            // Validate Regular Price using regex (positive numbers only)
            const regularPrice = form.querySelector('input[name="regular_price"]');
            if (!/^\d+(\.\d{1,2})?$/.test(regularPrice.value.trim()) || parseFloat(regularPrice.value.trim()) < 0) {
                isValid = false;
                showError(regularPrice, 'Regular Price should be a positive number');
            }

            // Validate Sales Price using regex (positive numbers only)
            const salesPrice = form.querySelector('input[name="sales_price"]');
            if (!/^\d+(\.\d{1,2})?$/.test(salesPrice.value.trim()) || parseFloat(salesPrice.value.trim()) < 0) {
                isValid = false;
                showError(salesPrice, 'Sales Price should be a positive number');
            }

            // Validate Quantity using regex (positive integers only)
            const quantity = form.querySelector('input[name="quantity"]');
            if (!/^[1-9]\d*$/.test(quantity.value.trim())) {
                isValid = false;
                showError(quantity, 'Quantity should be a positive integer');
            }

            const description = form.querySelector('textarea[name="description"]');
            if (!description.value.trim()) {
                isValid = false;
                showError(description, 'Description Price is required');
            }
            if (!isValid) {
                event.preventDefault(); // Prevent form submission if validation fails
            }

            const image = form.querySelector('input[name="image"]');
            if (!image.value.trim()) {
                isValid = false;
                showError(image, 'Image is required');
            }
            if (!isValid) {
                event.preventDefault(); // Prevent form submission if validation fails
            }
        });

        function showError(input, message) {
            // Remove previous error messages for the input
            const parentDiv = input.parentElement;
            const existingErrorMessages = parentDiv.querySelectorAll('.error-message');
            existingErrorMessages.forEach(errorMessage => errorMessage.remove());

            // Add the new error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            errorDiv.style.color = 'red'; // Set the text color to red

            parentDiv.appendChild(errorDiv);
        }
    });
</script> -->


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const addProduct = async (req, res) => {
  try {
      const { title, category, brand, model, regular_price, sales_price, quantity, description } = req.body;
      const category_id = await Category.findOne({ name: category }, {});
      const fileNames = req.files.map(file => file.filename);
      const allCategories = await Category.find({})

      // Check if the uploaded files are images (only supporting common image formats)
      const supportedImageFormats = ['jpg', 'jpeg', 'png']; // Add more if needed

      const areImages = fileNames.every((filename) => {
          const fileExtension = filename.split('.').pop().toLowerCase();
          return supportedImageFormats.includes(fileExtension);
      });

      if (!areImages) {
          // Log an error and handle accordingly
          console.log('Error: Unsupported file format. Only JPG, JPEG, PNG  are supported.');
          // return res.status(400).send('Error: Unsupported file format. Only JPG, JPEG, PNG, and GIF are supported.');
          res.render('addnewProduct', {allCategories, 
              errorMessage: 'Invalid file type. Only JPEG or PNG images are allowed.'
          });

      }

      const product = await Product.create({
          title,
          category,
          brand,
          model,
          regular_price,
          sales_price,
          quantity,
          description,
          images: fileNames
      });

      // Continue processing only if all files are in supported image format

      // Create a temporary directory for resized images
      const tempDir = path.join(__dirname, "temp");
      await fs.mkdir(tempDir, { recursive: true });

      // Resize and crop the uploaded images to 277x277
      await Promise.all(fileNames.map(async (filename) => {
          const inputImagePath = `./public/productImages/${filename}`;
          const outputImagePath = path.join(tempDir, filename);

          await sharp(inputImagePath)
              .resize({ width: 277, height: 277, fit: 'cover' })
              .toFile(outputImagePath);
      }));

      // Move the resized images back to the original directory
      await Promise.all(fileNames.map(async (filename) => {
          const tempImagePath = path.join(tempDir, filename);
          const finalImagePath = `./public/productImages/${filename}`;

          await fs.rename(tempImagePath, finalImagePath);
      }));

      // Remove the temporary directory
      await fs.rmdir(tempDir, { recursive: true });

      console.log("Success");
      res.redirect('/admin/products');
  } catch (error) {
      console.log(error.message);
      // Handle other errors or send an appropriate response
      res.status(500).send('Internal Server Error');
  }
};


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


const editProduct = async (req, res) => {
    try {
        let product_id = req.params.id;
        const { title, category, brand, model, regular_price, sales_price, quantity, description } = req.body;
        const category_id = await Category.findOne({ name: category }, {});
        const existingProduct = await Product.findById(product_id);

        // Get existing images from the database
        const existingImages = existingProduct.images || [];
        const fileNames = req.files.map(file => file.filename);

        if (req.files.length) {
            // Check if the total number of images (existing + new) exceeds the limit of 4
            if (existingImages.length + fileNames.length > 4) {
                console.log("Error: Exceeded the maximum allowed images limit (4).");
                return res.redirect('/admin/products');
            }

            // Update product information with both existing and new images
            await Product.findByIdAndUpdate(
                { _id: product_id },
                {
                    title,
                    category,
                    brand,
                    model,
                    regular_price,
                    sales_price,
                    quantity,
                    description,
                    images: [...existingImages, ...fileNames],
                }
            );

        // Create a temporary directory for resized images
        const tempDir = path.join(__dirname, "temp");
        await fs.mkdir(tempDir, { recursive: true });

        // Resize and crop the uploaded images to 277x277
        await Promise.all(fileNames.map(async (filename) => {
            const inputImagePath = `./public/productImages/${filename}`;
            const outputImagePath = path.join(tempDir, filename);

            await sharp(inputImagePath)
                .resize({ width: 277, height: 277, fit: 'cover' })
                .toFile(outputImagePath);
        }));

        // Move the resized images back to the original directory
        await Promise.all(fileNames.map(async (filename) => {
            const tempImagePath = path.join(tempDir, filename);
            const finalImagePath = `./public/productImages/${filename}`;

            await fs.rename(tempImagePath, finalImagePath);
        }));

        // Remove the temporary directory
        await fs.rmdir(tempDir, { recursive: true });

        console.log("Success");
        res.redirect('/admin/products');
    } else {
        // Update product information without changing images
        await Product.findByIdAndUpdate(
            { _id: product_id },
            {
                title,
                category,
                brand,
                model,
                regular_price,
                sales_price,
                quantity,
                description,
            }
        );
        console.log('Success');
        res.redirect('/admin/products');
    }
} catch (error) {
    console.log(error.message);
    res.redirect('/admin/products'); // Redirect in case of an error
}
};