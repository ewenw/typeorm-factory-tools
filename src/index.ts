import { EntityManager } from 'typeorm';
import { testContext } from './transactionalTestContext';
import { FactoryProps, factory } from './factory';

let connection;
let contextFunction;
let defaultsFunction;

/**
 * Sets the default artifacts to create for every test case that uses transact() or start().
 *
 * @returns void
 */
export function setDefaults(func): void {
  defaultsFunction = func;
}

/**
 * Execute the function in a transaction and roll back afterwards.
 *
 * @export
 * @param {() => Promise<void>} func
 * @returns {() => Promise<void>}
 */
export function transact(func: () => Promise<void>): (any) => Promise<void> {
  return async (done): Promise<void> => {
    try {
      await start();
      await func();
    } catch (e) {
      done(e);
    }
    await finish();
    done();
  };
}

/**
 * Connect to the PG database and provide connection object to factories and the transaction context.
 *
 * @export
 * @returns {Promise<Connection>}
 */
export async function setConnection(conn): Promise<void> {
  connection = conn;
  factory.setManager(conn.manager);
  testContext.setConnection(conn);
}

/**
 * Disconnect from PG.
 *
 * @export
 * @returns {Promise<void>}
 */
export async function disconnect(): Promise<void> {
  await connection.close();
  contextFunction = undefined;
}

/**
 * Start a transaction.
 *
 * @export
 * @returns {Promise<void>}
 */
export async function start(): Promise<void> {
  await testContext.start();
  if (defaultsFunction !== undefined) {
    await defaultsFunction();
  }
  if (contextFunction !== undefined) {
    await contextFunction();
  }
}
/**
 * Rollback the current test transaction.
 *
 * @export
 * @returns {Promise<void>}
 */
export async function finish(): Promise<void> {
  await testContext.finish();
}

/**
 * Define a factory with default properties.
 *
 * In addition to the props that are assigned to the artifact, there are
 * a couple of special props:
 * - context: special values that the entity needs to be created properly
 * - save: should the artifact be saved?
 * - afterSave: function to be executed after saving the object, which gets passed in
 * See examples in entityFactories.ts
 * @export
 * @template T
 * @param {{ new (): T }} Entity the BaseEntity subclass to be created
 * @param {FactoryProps} [props={}]
 * @param {string} [variant=null] the variation of the entity to define
 */
export function define<T>(
  Entity: { new(): T },
  props: FactoryProps = {},
  variant: string = null,
): void {
  factory.define(Entity, props, variant);
}

/**
 * Makes an artifact from the given factory.
 *
 * @export
 * @template T
 * @param {({ new (): T } | string)} entityOrName the name or class of the entity to make
 * @param {FactoryProps} [props={}]
 * @param {string} [variant=null] the variation of the entity to make
 * @param managerOverride {EntityManager} use this connection manager instead of the default
 * @returns {Promise<T>}
 */
export async function make<T>(
  entityOrName: { new(): T } | string,
  props: FactoryProps = {},
  variant: string = null,
  managerOverride?: EntityManager,
): Promise<T> {
  const artifact = await factory.make(entityOrName, props, variant, managerOverride);
  return artifact;
}

/**
 * Make N number of artifacts from the given factory.
 *
 * @export
 * @template T
 * @param {({ new (): T } | string)} entityOrName
 * @param {number} n
 * @param {FactoryProps} [props={}]
 * @param {string} [variant=null]
 * @returns {Promise<T[]>}
 */
export async function makeMany<T>(
  entityOrName: { new(): T } | string,
  n: number,
  props: FactoryProps = {},
  variant: string = null,
): Promise<T[]> {
  return Promise.all(
    Array<number>(n)
      .fill(n)
      .map(() => make(entityOrName, props, variant)),
  );
}

/**
 * Context to be executed inside each transact() call. Useful for defining artifacts that needs to be created
 * before each test case and rolled back after each case.
 *
 * @export
 * @param {() => void} func the function to execute in the transaction
 */
export function context(func: () => void): void {
  contextFunction = func;
}

export async function relate<T>(
  Entity: { new(): T },
  relationName: string,
  instance: T,
  relative: T,
): Promise<void> {
  await factory.relate(Entity, relationName, instance, relative);
}
