function handleError(res, err, message, statusCode) {
    console.error(err);
    res.status(statusCode || 500);
    res.json({
        message,
        error: err.message
    });        
}

module.exports = handleError