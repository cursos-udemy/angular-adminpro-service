function normalizePaging(req) {
    let { page, limit } = req.query;
    const paging = {};
    paging.page = getValueNumber(page, 1);
    paging.limit = getValueNumber(limit, 100);
    paging.offset = (paging.page - 1) * paging.limit;
    return paging;
}

function getValueNumber(value, defaultValue=1) {
    let newValue = defaultValue
    try {
        newValue = Number(value);
        if (isNaN(value) || newValue <= 0) {
            newValue = defaultValue;
        }
    } catch (err) {
    }
    return newValue;
}

module.exports = normalizePaging