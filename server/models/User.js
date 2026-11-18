'use strict';
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  siteName: {
    type: String,
    default: "Jama-Dashboard",
  },
  colorTheme: {
    type: String,
    default: "dark",
  },
  userAvatar: {
    type: Object,
    required: false,
    default: {
      iconUrl: "defaultuser",
      iconUrlLight: null,
      iconProvider: 'com.jama.dashboard.self'
    },
  },
  siteLogo: {
    type: Object,
    required: false,
    default: {
      iconUrl: "jama-dashboard",
      iconUrlLight: null,
      iconProvider: 'com.jama.dashboard.self'
    },
  },
  isSuperAdmin: {
    type: Boolean,
    default: false,
  },
  hideBranding: {
    type: Boolean,
    default: false,
    required: false,
  },
  location: {
    type: String,
    default: 'Stockholm',
    required: false,
  },
  unit: {
    type: String,
    default: 'metric',
    required: false,
  },
  longitude: {
    type: String,
    default: '18.0686',
    required: false,
  },
  latitude: {
    type: String,
    default: '59.3293',
    required: false,
  },
  camerafeed: {
    type: Boolean,
    default: false,
  },
  networkdevices: {
    type: Boolean,
    default: false,
  },
  todolist: {
    type: Boolean,
    default: false,
  },
  snippetmanager: {
    type: Boolean,
    default: false,
  },
  authenticator: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;