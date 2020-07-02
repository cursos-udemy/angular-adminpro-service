function handleError(res, err, message) {
    res.status(500);
    res.json({
        ok: false,
        message,
        error: err.message
    });        
}

module.exports = handleError