module.exports = {
    async up(db) {
        const users = db.collection('users');
        const listings = db.collection('listings');
        const setupState = db.collection('setup_state');

        // Remove only the known factory account from the original migration.
        const factoryHashes = [
            'e10adc3949ba59abbe56e057f20f883e', // 123456
            '0192023a7bbd73250516f069df18b500', // admin123
        ];
        const factoryUser = await users.findOne({
            username: 'admin',
            isSuperAdmin: true,
            password: { $in: factoryHashes },
        });

        if (factoryUser) {
            await listings.deleteMany({ userId: factoryUser._id });
            await users.deleteOne({ _id: factoryUser._id });
        }

        const userCount = await users.countDocuments();
        await setupState.updateOne(
            { _id: 'initial-setup' },
            {
                $setOnInsert: {
                    completed: userCount > 0,
                    setupInProgress: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            },
            { upsert: true }
        );
    },

    async down(db) {
        await db.collection('setup_state').deleteOne({ _id: 'initial-setup' });
    },
};
