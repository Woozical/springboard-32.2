class ExpressError extends Error{
    constructor(message, status){
        super();
        this.msg = message ? message : 'Server Error';
        this.status = status ? status : 500;
    }
}

module.exports = ExpressError;