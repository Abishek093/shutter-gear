// err.js

// Custom error-handling middleware
function errorHandler(err, req, res, next) {
    console.error(err.stack);

    // Check for specific error types and handle them accordingly
    // if (err instanceof CustomErrorType) {
    //     // Handle specific error type
    //     return res.status(500).json({ error: 'Custom error occurred' });
    // }

    // Redirect to oopss.ejs for internal server errors
    res.status(500).render('oopss', { error: 'Internal Server Error' });
}

module.exports = errorHandler;
