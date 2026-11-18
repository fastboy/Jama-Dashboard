const mongoose = require('mongoose');
const { Schema } = mongoose;

const setupStateSchema = new Schema({
    _id: {
        type: String,
        default: 'initial-setup',
    },
    completed: {
        type: Boolean,
        default: false,
    },
    setupInProgress: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    collection: 'setup_state',
});

module.exports = mongoose.model('SetupState', setupStateSchema);
