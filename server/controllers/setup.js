const User = require('../models/User');
const SetupState = require('../models/SetupState');
const { hashPassword } = require('../utils/password');

const setupStatus = async (req, res) => {
    const state = await SetupState.findById('initial-setup').lean();
    return res.status(200).json({
        error: false,
        setupRequired: !state || !state.completed,
    });
};

const createInitialAdmin = async (req, res) => {
    const { fullName, username, password, siteName } = req.body || {};

    if (!fullName || !username || !siteName || !password || password.length < 6) {
        return res.status(400).json({
            error: true,
            message: 'Full name, username, site name and a password of at least 6 characters are required.',
        });
    }

    const claimedState = await SetupState.findOneAndUpdate(
        { _id: 'initial-setup', completed: false, setupInProgress: false },
        { $set: { setupInProgress: true } },
        { new: true }
    );

    if (!claimedState) {
        return res.status(409).json({
            error: true,
            message: 'Initial setup has already been completed or is currently in progress.',
        });
    }

    try {
        const existingUser = await User.findOne({ username: new RegExp(`^${username}$`, 'i') });
        if (existingUser) {
            await SetupState.updateOne(
                { _id: 'initial-setup', completed: false },
                { $set: { setupInProgress: false } }
            );
            return res.status(400).json({ error: true, message: 'Username already exists.' });
        }

        await User.create({
            fullName,
            username: username.toLowerCase(),
            password: await hashPassword(password),
            siteName,
            colorTheme: 'dark',
            isSuperAdmin: true,
            profilePicture: 'Default',
        });

        await SetupState.updateOne(
            { _id: 'initial-setup' },
            { $set: { completed: true, setupInProgress: false } }
        );

        return res.status(201).json({ error: false, message: 'Initial administrator created successfully.' });
    } catch (error) {
        await SetupState.updateOne(
            { _id: 'initial-setup', completed: false },
            { $set: { setupInProgress: false } }
        );
        return res.status(500).json({ error: true, message: 'Unable to create the initial administrator.' });
    }
};

module.exports = { setupStatus, createInitialAdmin };
