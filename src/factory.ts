import { isFunction } from 'lodash';
import * as faker from 'faker';
import { EntityManager } from 'typeorm';

export type FactoryAttribute = string | number | boolean | Date | Function | Record<string, any> | any;

export type CustomProps = {
  context?: Record<string, any>;
  save?: boolean;
  afterSave?: (artifact) => Promise<any>;
};

export type FactoryProps = CustomProps | {};

export type FactoryEntry<T = {}> = {
  props: FactoryProps;
  Entity: T;
};
/**
 * Loosely inspired by the factory-bot npm package. Customized to add support for persisting objects
 * to TypeOrm, adding entity relationships, factory variations, and contexts.
 *
 * @export
 * @class Factory
 */
export class Factory {
  private factories: {} = new Map<string, FactoryEntry>();
  private manager: EntityManager;

  setManager(manager: EntityManager): void {
    this.manager = manager;
  }

  has(name: string): boolean {
    return this.factories[name] !== undefined;
  }

  clear(): void {
    this.factories = new Map<string, FactoryEntry>();
  }

  factoryWithVariantName(name: string, variant: string): string {
    return `${name}.${variant}`;
  }

  define<T>(Entity: { new(): T }, props: FactoryProps = {}, variant: string = null): void {
    const name = variant === null ? Entity.name : this.factoryWithVariantName(Entity.name, variant);
    this.factories[name] = { props, Entity };
  }

  async evaluate<T>(props: FactoryProps, context: {}): Promise<T> {
    const results = {};
    const values = await Promise.all(Object.keys(props).map(async prop => this.parse(props[prop], context)));

    Object.keys(props).forEach((prop, idx) => {
      results[prop] = values[idx];
    });
    return results as T;
  }

  async make<T>(
    entityOrName: { new(): T } | string,
    props: FactoryProps = {},
    variant: string = null,
    managerOverride?: EntityManager,
  ): Promise<T> {
    const defaultManager = this.manager;
    this.manager = managerOverride || this.manager;
    let name: string;
    if (typeof entityOrName !== 'string') {
      name = entityOrName.name;
    } else {
      name = entityOrName;
    }
    if (variant !== null) {
      name = this.factoryWithVariantName(name, variant);
    }
    const overrideProps = { ...{ id: faker.random.uuid(), }, ...props };
    const factory = this.factories[name];

    if (factory === undefined) {
      throw `Factory "${name}" does not exist`;
    }

    const finalProps: FactoryProps = { ...factory.props, ...overrideProps };

    let context = {};

    if ('context' in finalProps) {
      context = await this.evaluate(finalProps.context, {});
      delete finalProps.context;
    }

    let afterSave;

    if ('afterSave' in finalProps) {
      afterSave = finalProps.afterSave;
      delete finalProps.afterSave;
    }

    const instance = await this.evaluate(finalProps, context);

    if (!('save' in finalProps) || finalProps.save !== false) {
      await this.manager.insert(factory.Entity, instance as {});
    }

    if (afterSave !== undefined) {
      await afterSave(instance);
    }
    this.manager = defaultManager;
    return instance as T;
  }

  async parse(val: FactoryAttribute, context: {}): Promise<FactoryAttribute> {
    const value = isFunction(val) ? await val(context) : val;
    return value;
  }

  async relate<T>(Entity: { new(): T }, relationName: string, instance: T, relative: T): Promise<void> {
    await this.manager
      .createQueryBuilder()
      .relation(Entity, relationName)
      .of(instance)
      .add(relative);
    if (relationName in instance) {
      instance[relationName].push(relative);
    } else {
      // eslint-disable-next-line no-param-reassign
      instance[relationName] = [relative];
    }
  }
}

export const factory = new Factory();
