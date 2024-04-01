import MigrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function migrations(req, res) {
  const defaultMigrationOptions = {
    databaseUrl: process.env.DATABASE_URL,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (req.method === "GET") {
    const pendingMigrations = await MigrationRunner(defaultMigrationOptions);
    return res.status(200).json(pendingMigrations);
  }

  if (req.method === "POST") {
    const executedMigrations = await MigrationRunner({
      ...defaultMigrationOptions,
      dryRun: false,
    });
    if (executedMigrations.length > 0) {
      return res.status(201).json(executedMigrations);
    }
    return res.status(200).json(executedMigrations);
  }

  return res.status(405).end();
}
