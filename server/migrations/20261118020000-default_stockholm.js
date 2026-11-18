module.exports = {
    async up(db) {
        await db.collection('users').updateMany(
            {
                location: 'India',
                longitude: '77.216721',
                latitude: '28.644800',
            },
            {
                $set: {
                    location: 'Stockholm',
                    longitude: '18.0686',
                    latitude: '59.3293',
                },
            }
        );
    },

    async down(db) {
        await db.collection('users').updateMany(
            {
                location: 'Stockholm',
                longitude: '18.0686',
                latitude: '59.3293',
            },
            {
                $set: {
                    location: 'India',
                    longitude: '77.216721',
                    latitude: '28.644800',
                },
            }
        );
    },
};