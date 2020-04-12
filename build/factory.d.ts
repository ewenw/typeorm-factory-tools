import { EntityManager } from 'typeorm';
export declare type FactoryAttribute = string | number | boolean | Date | Function | Record<string, any> | any;
export declare type CustomProps = {
    context?: Record<string, any>;
    save?: boolean;
    afterSave?: (artifact: any) => Promise<any>;
};
export declare type FactoryProps = CustomProps | {};
export declare type FactoryEntry<T = {}> = {
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
export declare class Factory {
    private factories;
    private manager;
    setManager(manager: EntityManager): void;
    has(name: string): boolean;
    clear(): void;
    factoryWithVariantName(name: string, variant: string): string;
    define<T>(Entity: {
        new (): T;
    }, props?: FactoryProps, variant?: string): void;
    evaluate<T>(props: FactoryProps, context: {}): Promise<T>;
    make<T>(entityOrName: {
        new (): T;
    } | string, props?: FactoryProps, variant?: string, managerOverride?: EntityManager): Promise<T>;
    parse(val: FactoryAttribute, context: {}): Promise<FactoryAttribute>;
    relate<T>(Entity: {
        new (): T;
    }, relationName: string, instance: T, relative: T): Promise<void>;
}
export declare const factory: Factory;
