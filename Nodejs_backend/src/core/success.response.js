'use strict'

const StatusCode = {
    OK: 200,
    CREATED: 201,
}

const ReasonStatusCode = {
    OK : "Success",
    CREATED : "Created"

}

class SuccessResponse {
    constructor({ message, statusCode = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK, metadata = {} }){
        this.message = !message ? reasonStatusCode : message
        this.status = statusCode
        this.metadata = metadata
    }

    send(res, headers = {} ){
        return res.status( this.status ).json(this)
    }
}

class Ok extends SuccessResponse {
    constructor( {message, metadata}){
        super({message, metadata})

    }
}

class Created extends SuccessResponse {
    constructor({message, statusCode = StatusCode.CREATED, metadata, reasonStatusCode = ReasonStatusCode.CREATED}){
        super({message, metadata, statusCode, reasonStatusCode})

    }
}

module.exports = {
<<<<<<< HEAD
       Ok, Created, SuccessResponse
=======
    Ok, Created, SuccessResponse
>>>>>>> main
}





