'use strict';
const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Shop';
const COLLECTION_NAME = 'Shops';

const shopSchema = new Schema({
  name: {
    type: String,
    trim: true,
    maxLength: 150,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },
  verify: {
    type: Schema.Types.Boolean,
    default: false,
  },
  roles: {
    type: Array,
    default: [],
  },
}, {
  // Đặt tên collection ở đây
  collection: COLLECTION_NAME,
  timestamps: true, 
});

module.exports = model(DOCUMENT_NAME, shopSchema);
