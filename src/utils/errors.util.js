function handleError(res, err, message, statusCode) {
    res.status(statusCode || 500);
    res.json({
        ok: false,
        message,
        error: err.message
    });        
}

module.exports = handleError