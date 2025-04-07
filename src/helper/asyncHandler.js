const asyncHandler = fn => {
    return (res, req, next ) => {
        fn(res, req, next).catch(next)
    
    }
}

module.exports = asyncHandler;
