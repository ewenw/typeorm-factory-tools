import { Connection } from 'typeorm';
export default class TransactionalTestContext {
    private queryRunner;
    private originQueryRunnerFunction;
    private connection;
    setConnection(connection: Connection): void;
    start(): Promise<void>;
    finish(): Promise<void>;
    private buildWrappedQueryRunner;
    private monkeyPatchQueryRunnerCreation;
    private restoreQueryRunnerCreation;
    private cleanUpResources;
}
declare const testContext: TransactionalTestContext;
export { testContext };
