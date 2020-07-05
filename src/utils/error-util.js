function handleError(res, err, message, statusCode) {
    res.status(statusCode || 500);
    res.json({
        message,
        error: err.message
    });        
}

module.exports = handleError