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


++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++