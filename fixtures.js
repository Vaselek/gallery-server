const mongoose = require('mongoose');
const config = require('./config');
const nanoid = require('nanoid');

const Photo = require('./models/Photo');
const User = require('./models/User');

const run = async () => {
    await mongoose.connect(config.dbUrl, config.mongoOptions);

    const connection = mongoose.connection;

    const collections = await connection.db.collections();
    for (let collection of collections) {
        await collection.drop();
    }

    const [user1, user2] = await User.create({
        username: 'user',
        password: '123',
        token: nanoid()
    }, {
        username: 'admin',
        password: '123',
        token: nanoid()
    });


    let photos = await Photo.create(
        {
            title: 'Recovery',
            user: user1._id,
            image: 'lp.jpg'
        },
        {
            title: 'Forever',
            user: user1._id,
            image: 'lp_album.jpg',
        },
        {
            title: 'Simulation Theory',
            user: user1._id,
            image: 'simulation_theory_album.jpg',
        },
        {
            title: 'Recovery',
            user: user1._id,
            image: 'recovery_album.jpg'
        },
        {
            title: 'Forever',
            user: user1._id,
            image: 'lp_forever_album.jpg',
        },
        {
            title: 'Simulation Theory',
            user: user2._id,
            image: 'muse.jpg',
        }
    );

    await connection.close();
};

run().catch(error => {
    console.error('Smt went wrong', error);
});

