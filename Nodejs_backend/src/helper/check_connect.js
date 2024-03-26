const mongoose = require("mongoose")

const countConnect = () =>  {
    const numConnection = mongoose.connections.length
    console.log("NUmber of Connection: ${numConnection}")
}


module.exports(countConnect)