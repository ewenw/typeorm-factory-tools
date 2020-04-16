import { createConnection, Connection } from "typeorm";
import { User } from "./entities/User";
import { Photo } from "./entities/Photo";
import { Tag } from "./entities/Tag";
import { make, setConnection, disconnect, transact, context, relate } from "../src/index";

require('./factories');
let connection;
beforeAll(async () => {
    connection = setConnection(await createConnection({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "cluser",
        password: "cltest",
        database: "test",
        entities: [
            User,
            Tag,
            Photo,
        ],
        synchronize: true,
    }));
});

afterAll(async () => await disconnect());

let tag1;
context(async () => {
    tag1 = await make(Tag);
});

describe('test factory', async () => {
    const getRepo = (repo) => connection.manager.getRepository(repo);
    it('creates a user with related tags and photos in a transaction', transact(async () => {
        const newUser = await make<User>(User, {}, 'withTagsAndPhotos');
        const [retrievedUser] = await getRepo(User).findByIds([newUser.id], { relations: ['photos', 'tags'] });
        expect(newUser).toMatchObject(retrievedUser);
        expect(retrievedUser.tags.length).toEqual(1);
        expect(retrievedUser.photos.length).toEqual(2);
        expect((await getRepo(User).findAndCount())[1]).toEqual(2);
    }));
    it('lets us override props', transact(async () => {
        const newUser = await make<User>(User, { name: 'Typeorm McFactorytoolsFace' });
        const [retrievedUser] = await getRepo(User).findByIds([newUser.id]);
        expect(retrievedUser.name).toEqual('Typeorm McFactorytoolsFace');
    }));
    it('uses the tag instance created in the context', transact(async () => {
        const newUser = await make<User>(User);
        await relate(User, 'tags', newUser, tag1);
        const [retrievedUser] = await getRepo(User).findByIds([newUser.id], { relations: ['tags'] });
        expect(retrievedUser.tags).toEqual(expect.arrayContaining([tag1]));
    }));
    it('creates the instances inside setDefaults() in factories.ts', transact(async () => {
        expect((await getRepo(User).findAndCount())[1]).toEqual(1);
    }));
    it('creates a photo instance and the required user without violating the non-null userId constraint', transact(async () => {
        const photo = await make(Photo);
        const [retrievedPhoto] = await getRepo(Photo).findByIds([photo.id], { relations: ['user'] });
        expect(retrievedPhoto.user).toBeDefined();
    }));
});
