import { EntityManager, Connection } from 'typeorm';
import { FactoryProps } from './factory';
/**
 * Sets the default artifacts to create for every test case that uses transact() or start().
 *
 * @returns void
 */
export declare function setDefaults(func: any): void;
/**
 * Execute the function in a transaction and roll back afterwards.
 *
 * @export
 * @param {() => Promise<void>} func
 * @returns {() => Promise<void>}
 */
export declare function transact(func: () => Promise<void>): (any: any) => Promise<void>;
/**
 * Connect to the PG database and provide connection object to factories and the transaction context.
 *
 * @export
 * @returns {Promise<Connection>}
 */
export declare function setConnection(conn: any): Promise<Connection>;
/**
 * Disconnect from PG.
 *
 * @export
 * @returns {Promise<void>}
 */
export declare function disconnect(): Promise<void>;
/**
 * Start a transaction.
 *
 * @export
 * @returns {Promise<void>}
 */
export declare function start(): Promise<void>;
/**
 * Rollback the current test transaction.
 *
 * @export
 * @returns {Promise<void>}
 */
export declare function finish(): Promise<void>;
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
export declare function define<T>(Entity: {
    new (): T;
}, props?: FactoryProps, variant?: string): void;
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
export declare function make<T>(entityOrName: {
    new (): T;
} | string, props?: FactoryProps, variant?: string, managerOverride?: EntityManager): Promise<T>;
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
export declare function makeMany<T>(entityOrName: {
    new (): T;
} | string, n: number, props?: FactoryProps, variant?: string): Promise<T[]>;
/**
 * Context to be executed inside each transact() call. Useful for defining artifacts that needs to be created
 * before each test case and rolled back after each case.
 *
 * @export
 * @param {() => void} func the function to execute in the transaction
 */
export declare function context(func: () => void): void;
/**
 * Adds a relationship between instance and relative. Relative could be multiple instances.
 * @param Entity
 * @param relationName
 * @param instance
 * @param relative
 */
export declare function relate<T>(Entity: {
    new (): T;
}, relationName: string, instance: T, relative: T | T[]): Promise<void>;
