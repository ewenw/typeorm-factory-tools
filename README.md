`typeorm-factory-tools` is a factory package for `typeorm` that
helps your team write clean, transactional tests.

It is inspired by the `factory-bot` gem and uses viniciusjssouza's [typeorm-transactional-tests](https://github.com/viniciusjssouza/typeorm-transactional-tests) code to monkeypatch typeorm for transaction handling.

### Installation
```
npm install --save-dev typeorm-factory-tools
```

### Features
- Define multiple factory variations for the same entity in a simple yet featureful syntax
- Use factories to build instances with overridden properties
- Support complex entity relationships without violating key constraints
- Wrap up test cases in a transaction context to prevent disk-writes and enable fast tests
- Create common instances used in multiple cases

### Overview

This awesome package provides a simple API that to define factories, create instances from those factories, and wrap tests in transactions:
- `define` - defines factories with default properties
- `relate` - creates relationships between instances (for any cardinality)
- `make` - makes an instance of a factory
- `makeMany` - makes multiple instances of a factory
- `transact` - runs the test function in a single transaction by overriding typeorm's `connection` object
- `context` - creates common instances for each test case that uses `transact`

### Usage
Below is an example of how you could structure your project to integrate this package.
```
/entities
    Photo.ts
    Tag.ts
    User.ts
/tests
    factories.ts
    example.test.ts
```

For demonstration purpose, we'll first create the `User`, `Photo`, and `Tag` entities. `User` has a one-to-many relationship with `Photo`, and many-to-many relationship with `Tag`.
```
// User.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from "typeorm";
import { Photo } from "./Photo";
import { Tag } from "./Tag";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @OneToMany(type => Photo, photo => photo.user)
    photos: Photo[];

    @ManyToMany(type => Tag, tag => tag.users)
    tags: Tag[];

}

// Photo.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Photo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @ManyToOne(type => User, user => user.photos)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ nullable: false })
    userId: number;

}

// Tag.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { User } from "./User";

@Entity()
export class Tag {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(type => User, user => user.tags, {
        cascade: true
    })
    @JoinTable()
    users: User[];

    @Column()
    name: string;

}
```

Next, let's make a file called `factories.ts` to define our factories and additional test utilities.

```
// factories.ts
import { define, make, makeMany, setDefaults, relate } from 'typeorm-factory-tools';
import * as faker from 'faker';
import { Photo } from './entities/Photo';
import { User } from './entities/User';
import { Tag } from './entities/Tag';

setDefaults(async () => {
    // code in here will be run inside every transaction in every test case. In this case, we will make
    // a User instance with tags and photos before each test.
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
        // the code here will be run after an instance of User has been created
        // we'll make a Tag instance, and relate it to the user
        const tag = await make(Tag);
        await relate(User, 'tags', user, tag);
        // we can also make multiple photos, and assign them to the user
        const photos = await makeMany(Photo, 2, { userId: user.id });
        await relate(User, 'photos', user, photos);
    }
}, 'withTagsAndPhotos');

define(Photo, {
    // we can also make a User first here then take its id (since the userId cannot be null)
    userId: async () => (await make(User)).id,
    url: () => faker.image.imageUrl(),
});

define(Tag, {
    name: () => faker.lorem.slug(),
});


```

Now that our factories are defined, we can create a User with 1 tag and 2 photos attached by simply calling `await make(User)`.

We can also override the User's email by adding it as a prop: `await make(User, { email: 'override@gmail.com'})`. How cool is that?

Time for the exciting part - our first test!

```
// example.test.ts

import { createConnection, Connection } from "typeorm";
import { User } from "./entities/User";
import { Photo } from "./entities/Photo";
import { Tag } from "./entities/Tag";
import { make, setConnection, disconnect, transact, context, relate } from "typeorm-factory-tools";

require('./factories');
let connection;
beforeAll(async () => {
    connection = setConnection(await createConnection(...your connection settings));
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
```

This package was developed by Ewen and the Certain Lending team.
https://www.certainlending.com/