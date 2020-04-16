import { define, make, makeMany, setDefaults, relate } from '../src/index';
import { Photo } from './entities/Photo';
import { User } from './entities/User';
import * as faker from 'faker';
import { Tag } from './entities/Tag';

setDefaults(async () => {
    await make(User, {}, 'withTagsAndPhotos');
});

define(User, {
    name: () => faker.name.firstName(),
    email: () => faker.internet.email(),
});

define(User, {
    name: () => faker.name.firstName(),
    email: () => faker.internet.email(),
    afterSave: async (user) => {
        const tag = await make(Tag);
        await relate(User, 'tags', user, tag);
        const photos = await makeMany(Photo, 2, { userId: user.id });
        await relate(User, 'photos', user, photos);
    }
}, 'withTagsAndPhotos');

define(Photo, {
    userId: async () => (await make(User)).id,
    url: () => faker.image.imageUrl(),
});

define(Tag, {
    name: () => faker.lorem.slug(),
});


export { makeMany, transact, relate, make, finish, start, context, setConnection } from '../src/index';
