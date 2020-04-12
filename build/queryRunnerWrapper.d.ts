/**
 * Code from the typeorm-transactional-tests npm package.
 * https://github.com/viniciusjssouza/typeorm-transactional-tests
 * The package does not work properly when imported into our repo
 * because it would attempt to monkey-patch a different version of
 * TypeOrm.
 *
 * Wraps the original TypeORM query runner to intercept some calls
 * and manipulate the transactional context.
 */
import { QueryRunner } from 'typeorm';
interface QueryRunnerWrapper extends QueryRunner {
    releaseQueryRunner(): Promise<void>;
}
declare const wrap: (originalQueryRunner: QueryRunner) => QueryRunnerWrapper;
export { QueryRunnerWrapper, wrap };
