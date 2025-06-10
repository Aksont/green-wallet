"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongodb_1 = require("mongodb");
const uri = process.env.MONGO_DB_URI;
const client = new mongodb_1.MongoClient(uri);
const users = [
    {
        id: '70d81692-2aa6-4651-bfb0-ff965a4377e7',
        email: 'nadia@gmail.com',
        password: '$2b$10$kgXm5EBUs6In3YPN45wVGe1Ig5DepZt81ty6FYdEiBnByhzh09yL2',
        name: 'Nadia',
        isVerified: true,
    },
    {
        id: '60381692-2aa6-4651-bfb0-ff965a4377e7',
        email: 'aleksa@gmail.com',
        password: '$2b$10$1XgUXUMLvlJebuwHLqDtpeePPMDTUrpT9bYkEfb5otd70OxpkxQyO',
        name: 'Aleksa',
        isVerified: true,
    },
];
const trips = [
    {
        id: '532bd9d0-76f8-4c40-8b79-3c13d7f2cdae',
        userId: '70d81692-2aa6-4651-bfb0-ff965a4377e7',
        title: 'Weekend Getaway',
        from: {
            name: 'Amsterdam',
            country: 'Netherlands',
            showName: 'Amsterdam, Netherlands',
        },
        to: {
            name: 'Paris',
            country: 'France',
            showName: 'Paris, France',
        },
        startDate: new Date('2025-07-18T00:00:00.000Z'),
        endDate: new Date('2025-07-20T00:00:00.000Z'),
        sequences: [
            {
                from: {
                    name: 'Amsterdam',
                    country: 'Netherlands',
                    showName: 'Amsterdam, Netherlands',
                },
                to: {
                    name: 'Brussels',
                    country: 'Belgium',
                    showName: 'Brussels, Belgium',
                },
                date: new Date('2025-07-18T00:00:00.000Z'),
                transportType: 'TRAIN',
                distanceInKm: 209.792,
                co2emissionInKg: 2.937088,
                numOfPassangers: 1,
            },
            {
                from: {
                    name: 'Brussels',
                    country: 'Belgium',
                    showName: 'Brussels, Belgium',
                },
                to: {
                    name: 'Paris',
                    country: 'France',
                    showName: 'Paris, France',
                },
                date: new Date('2025-07-18T00:00:00.000Z'),
                transportType: 'BUS',
                distanceInKm: 307.579,
                co2emissionInKg: 11.072844000000002,
                numOfPassangers: 1,
            },
        ],
        returnSequences: [
            {
                from: {
                    name: 'Paris',
                    country: 'France',
                    showName: 'Paris, France',
                },
                to: {
                    name: 'Brussels',
                    country: 'Belgium',
                    showName: 'Brussels, Belgium',
                },
                date: new Date('2025-07-20T00:00:00.000Z'),
                transportType: 'WALK',
                distanceInKm: 312.095,
                co2emissionInKg: 1000,
                numOfPassangers: 1,
            },
            {
                from: {
                    name: 'Brussels',
                    country: 'Belgium',
                    showName: 'Brussels, Belgium',
                },
                to: {
                    name: 'Amsterdam',
                    country: 'Netherlands',
                    showName: 'Amsterdam, Netherlands',
                },
                date: new Date('2025-07-18T00:00:00.000Z'),
                transportType: 'BICYCLE',
                distanceInKm: 10,
                co2emissionInKg: 0,
                numOfPassangers: 1,
            },
        ],
        totalCo2emissionInKg: 1014.009932000000003,
        totalDistanceInKm: 839.466,
    },
];
const projects = [
    {
        id: '0a1f54b1-1e43-4c32-8479-92b5f9df3001',
        type: 'DONATION',
        title: 'Plant Trees in Northern Forests',
        description: 'Support reforestation in northern Sweden where boreal forests are threatened by logging and wildfires.',
        country: 'Sweden',
        coordinates: '64.7511,19.0147',
        cause: 'Reforestation',
        tags: ['trees', 'carbon', 'forest', 'replanting', 'sustainability'],
        unitPrice: 60,
        currency: 'SEK',
        image: '/images/reforest.jpg',
    },
    {
        id: '0a1f54b1-1e43-4c32-8479-92b5f9df3002',
        type: 'DONATION',
        title: 'Support Green Energy in Lapland',
        description: 'Contribute to solar panel installations for small villages in Swedish Lapland to reduce fossil fuel dependence.',
        country: 'Sweden',
        coordinates: '67.1333,20.6500',
        cause: 'Renewable Energy',
        tags: ['solar', 'energy', 'off-grid', 'clean', 'future'],
        unitPrice: 60,
        currency: 'SEK',
        image: '/images/reforest.jpg',
    },
    {
        id: '0a1f54b1-1e43-4c32-8479-92b5f9df3003',
        type: 'DONATION',
        title: 'Wetland Restoration in Skåne',
        description: 'Fund the restoration of wetlands in southern Sweden to preserve biodiversity and natural flood control.',
        country: 'Sweden',
        coordinates: '55.9903,13.5953',
        cause: 'Biodiversity',
        tags: ['wetland', 'wildlife', 'ecosystem', 'restoration', 'flood'],
        unitPrice: 60,
        currency: 'SEK',
        image: '/images/reforest.jpg',
    },
    {
        id: '0a1f54b1-1e43-4c32-8479-92b5f9df3004',
        type: 'VOLUNTEER',
        title: 'Urban Garden Volunteering in Stockholm',
        description: 'Help maintain sustainable urban gardens in Stockholm and promote local organic food systems.',
        country: 'Sweden',
        coordinates: '59.3293,18.0686',
        cause: 'Sustainable Agriculture',
        tags: ['gardening', 'urban', 'community', 'organic', 'food'],
        joinType: 'FULL_LENGTH',
        image: '/images/reforest.jpg',
    },
    {
        id: '0a1f54b1-1e43-4c32-8479-92b5f9df3005',
        type: 'VOLUNTEER',
        title: 'Trail Cleanup in Swedish National Parks',
        description: 'Join weekend trail cleanups to collect litter and preserve hiking paths in national parks.',
        country: 'Sweden',
        coordinates: '63.1333,12.6333',
        cause: 'Clean Environment',
        tags: ['hiking', 'cleanup', 'nature', 'parks', 'outdoors'],
        joinType: 'ANYTIME',
        image: '/images/reforest.jpg',
    },
    {
        id: '0a1f54b1-1e43-4c32-8479-92b5f9df3006',
        type: 'CHALLENGE',
        title: 'Gothenburg Coffee Cup Cleanup Challenge',
        description: 'Collect and recycle disposable coffee cups in Gothenburg’s city center. Track your progress and earn eco-rewards!',
        country: 'Sweden',
        coordinates: '57.7089,11.9746',
        cause: 'Waste Reduction',
        tags: ['recycling', 'urban', 'coffee', 'cleanup', 'challenge'],
        challengeSteps: '1. Grab a collection bag\n2. Pick up coffee cups in designated zones\n3. Deliver to recycling bins\n4. Log your count\n5. Win eco-points!',
        reward: 'Free reusable coffee cup for 50+ collected cups',
        image: '/images/reforest.jpg',
    },
    {
        id: '0a1f54b1-1e43-4c32-8479-92b5f9df3007',
        type: 'DONATION',
        title: 'Protect Finnish Old-Growth Forests',
        description: 'Donate to preserve ancient forests in Finland from commercial logging and help biodiversity thrive.',
        country: 'Finland',
        coordinates: '64.0000,26.0000',
        cause: 'Biodiversity',
        tags: ['forest', 'protection', 'habitat', 'climate', 'wildlife'],
        unitPrice: 5,
        currency: 'EUR',
        image: '/images/reforest.jpg',
    },
    {
        id: '0a1f54b1-1e43-4c32-8479-92b5f9df3008',
        type: 'DONATION',
        title: 'Peatland Conservation Initiative',
        description: 'Support peatland conservation in central Finland — a key carbon sink vital for climate regulation.',
        country: 'Finland',
        coordinates: '62.2000,25.8000',
        cause: 'Carbon Capture',
        tags: ['peatland', 'carbon', 'ecosystem', 'conservation', 'climate'],
        unitPrice: 5,
        currency: 'EUR',
        image: '/images/reforest.jpg',
    },
    {
        id: '0a1f54b1-1e43-4c32-8479-92b5f9df3009',
        type: 'DONATION',
        title: 'Tree Planting for Carbon Offsets',
        description: 'Plant native trees in Dutch rural areas to help capture CO₂ and restore biodiversity.',
        country: 'Netherlands',
        coordinates: '52.3702,4.8952',
        cause: 'Reforestation',
        tags: ['carbon', 'trees', 'climate', 'offset', 'nature'],
        unitPrice: 5,
        currency: 'EUR',
        image: '/images/reforest.jpg',
    },
    {
        id: '0a1f54b1-1e43-4c32-8479-92b5f9df3010',
        type: 'DONATION',
        title: 'Community Solar Panel Fund',
        description: 'Support installation of community-owned solar panels in Dutch suburbs for clean local energy.',
        country: 'Netherlands',
        coordinates: '52.0302,5.2200',
        cause: 'Renewable Energy',
        tags: ['solar', 'clean', 'energy', 'community', 'green'],
        unitPrice: 5,
        currency: 'EUR',
        image: '/images/reforest.jpg',
    },
    {
        id: '0a1f54b1-1e43-4c32-8479-92b5f9df3011',
        type: 'DONATION',
        title: 'Dune Grass Restoration on the Coast',
        description: 'Donate to restore dune ecosystems on the Dutch coast, essential for erosion control and habitat.',
        country: 'Netherlands',
        coordinates: '52.4000,4.5000',
        cause: 'Erosion Control',
        tags: ['dunes', 'coast', 'habitat', 'grass', 'restoration'],
        unitPrice: 5,
        currency: 'EUR',
        image: '/images/reforest.jpg',
    },
    {
        id: '0a1f54b1-1e43-4c32-8479-92b5f9df3012',
        type: 'VOLUNTEER',
        title: 'Canal Plastic Fishing in Amsterdam',
        description: 'Join a group of eco-volunteers to fish out plastic waste from Amsterdam’s canals by boat.',
        country: 'Netherlands',
        coordinates: '52.3676,4.9041',
        cause: 'Waste Reduction',
        tags: ['plastic', 'canal', 'fishing', 'urban', 'cleanup'],
        joinType: 'ANYTIME',
        image: '/images/reforest.jpg',
    },
];
async function insertData() {
    try {
        await client.connect();
        const database = client.db(process.env.MONGO_DB_NAME);
        await database.dropCollection('users');
        await database.dropCollection('trips');
        await database.dropCollection('projects');
        await database.dropCollection('compensationinfos');
        await database.dropCollection('proofofcompensations');
        const usersCollection = database.collection('users');
        await usersCollection.insertMany(users);
        const tripsCollection = database.collection('trips');
        await tripsCollection.insertMany(trips);
        const projectsCollection = database.collection('projects');
        await projectsCollection.insertMany(projects);
        console.log('Data inserted successfully');
    }
    catch (error) {
        console.error('Error inserting data:', error);
    }
    finally {
        await client.close();
    }
}
void insertData();
//# sourceMappingURL=insert_data.js.map