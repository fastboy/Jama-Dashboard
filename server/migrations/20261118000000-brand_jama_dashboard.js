module.exports = {
    async up(db) {
        const users = db.collection('users');
        const listings = db.collection('listings');
        const iconPacks = db.collection('iconpacks');

        // Replace legacy defaults in existing installations without touching
        // user-selected site names or custom icons.
        await users.updateMany(
            { siteName: 'Astroluma' },
            { $set: { siteName: 'Jama-Dashboard' } }
        );
        await users.updateMany(
            { 'siteLogo.iconUrl': 'astroluma' },
            { $set: {
                'siteLogo.iconUrl': 'jama-dashboard',
                'siteLogo.iconProvider': 'com.jama.dashboard.self'
            } }
        );
        await users.updateMany(
            { 'userAvatar.iconProvider': 'com.astroluma.self' },
            { $set: { 'userAvatar.iconProvider': 'com.jama.dashboard.self' } }
        );

        await listings.updateMany(
            { 'listingIcon.iconUrl': 'astroluma' },
            { $set: {
                'listingIcon.iconUrl': 'jama-dashboard',
                'listingIcon.iconProvider': 'com.jama.dashboard.self'
            } }
        );

        // Remove only the original seeded portal/repository links. Other user
        // listings remain untouched.
        await listings.deleteMany({
            $or: [
                { listingName: 'Astroluma Portal' },
                { listingName: 'Astroluma Repo' },
                { listingUrl: { $regex: /getastroluma\.com|github\.com\/Sanjeet990\/Astroluma/i } }
            ]
        });

        // The old default icon pack was hosted by the original project. Users
        // can add a replacement from any trusted HTTPS JSON URL.
        await iconPacks.deleteMany({
            $or: [
                { userId: null, iconProvider: 'com.astroluma.selfh.st' },
                { userId: null, jsonUrl: { $regex: /icons\.getastroluma\.com/i } }
            ]
        });
    },

    async down() {
        // Branding migrations are intentionally not reversed automatically;
        // restoring the old identity would reintroduce external dependencies.
    }
};
