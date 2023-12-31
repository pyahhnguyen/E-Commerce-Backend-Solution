'use strict'

const _= require('lodash')
const express = require('express')

const getInfoData =  ({fileds = [], object = {} }) => {
    return _.pick( object, fileds)


}


module.exports = {
    getInfoData
}