import { prisma } from "./prisma";

/** Convert SQLite-style ? placeholders to PostgreSQL $1, $2, … */
export function pgSql(sql: string, params: unknown[]) {
  let i = 0;
  const text = sql.replace(/\?/g, () => `$${++i}`);
  return { text, params };
}

export function queryRawUnsafe<T>(sql: string, params: unknown[]) {
  const { text, params: values } = pgSql(sql, params);
  return prisma.$queryRawUnsafe<T>(text, ...values);
}
