import { Connection } from 'typeorm';
import { QueryRunnerWrapper, wrap } from './queryRunnerWrapper';

export default class TransactionalTestContext {
  private queryRunner: QueryRunnerWrapper | null = null;
  private originQueryRunnerFunction: any;
  private connection: Connection;

  setConnection(connection: Connection) {
    this.connection = connection;
  }

  async start(): Promise<void> {
    if (this.queryRunner) {
      await this.finish();
    }
    try {
      this.queryRunner = this.buildWrappedQueryRunner();
      this.monkeyPatchQueryRunnerCreation(this.queryRunner);

      await this.queryRunner.connect();
      await this.queryRunner.startTransaction();
    } catch (error) {
      await this.cleanUpResources();
      throw error;
    }
  }

  async finish(): Promise<void> {
    if (!this.queryRunner) {
      throw new Error('Context not started. You must call "start" before finishing it.');
    }
    try {
      await this.queryRunner.rollbackTransaction();
      this.restoreQueryRunnerCreation();
    } finally {
      await this.cleanUpResources();
    }
  }

  private buildWrappedQueryRunner(): QueryRunnerWrapper {
    const queryRunner = this.connection.createQueryRunner();
    return wrap(queryRunner);
  }

  private monkeyPatchQueryRunnerCreation(queryRunner: QueryRunnerWrapper): void {
    this.originQueryRunnerFunction = Connection.prototype.createQueryRunner;
    Connection.prototype.createQueryRunner = () => queryRunner;
  }

  private restoreQueryRunnerCreation(): void {
    Connection.prototype.createQueryRunner = this.originQueryRunnerFunction;
  }

  private async cleanUpResources(): Promise<void> {
    if (this.queryRunner) {
      await this.queryRunner.releaseQueryRunner();
      this.queryRunner = null;
    }
  }
}

const testContext = new TransactionalTestContext();

export { testContext };
