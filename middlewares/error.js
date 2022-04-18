const catchError = (err, req, res, next) => {
    // console.log('Error:', err);
    if (err.name === 'ValidationError') {
        const errors = err.errors;
        const keys = Object.keys(errors);
        const errorObj = {};
        keys.map(key => {
            errorObj[key] = errors[key].message
        });
        err.statusCode = 404;
        err.message = errorObj;
    }

    //bad ObjectID
    if (err.kind === 'ObjectId') {
        err.statusCode = 404;
        err.message = 'Invalid Id';
    };
    res.status(err.statusCode || 500).json({
        success: false,
        data: null,
        statusCode: err.statusCode || 500,
        message: err.message || 'Internal Error!',
    });
};
const notFound = (req, res) => res.status(404).send('Route does not exist');

module.exports = {
    catchError,
    notFound,
};