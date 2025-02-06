'use strict'

const _= require('lodash')

const getInfoData =  ({fileds = [], object = {} }) => {
    return _.pick( object, fileds)
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
} 

const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
} 

const removeundefinedObject = (obj) => {
    Object.keys(obj).forEach(key =>{
        if (obj[key] === null) {
            delete obj[key]
        }
    
    }
    )
    return obj
}

const updateNestedObjectParser = (obj) => {
    const final = {}
    Object.keys(obj).forEach(key =>{
        if(typeof obj[key] === 'Object' && !Array.isArray(obj[key])){
        const response  = updateNestedObjectParser(obj[key])
        Object.keys(response).forEach(key2 =>{
            final[`${key}.${key2}`] = response[key2]
        })
    }
    else{
        final[key] = obj[key]
    }   
})
    return final
}
    
module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeundefinedObject,
    updateNestedObjectParser

}