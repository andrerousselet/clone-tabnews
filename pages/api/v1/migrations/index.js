import MigrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function migrations(req, res) {
  if (req.method === "GET") {
    const migrations = await MigrationRunner({
      databaseUrl: process.env.DATABASE_URL,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    });
    return res.status(200).json(migrations);
  }
  if (req.method === "POST") {
    const migrations = await MigrationRunner({
      databaseUrl: process.env.DATABASE_URL,
      dryRun: false,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    });
    return res.status(201).json(migrations);
  }
  return res.status(405).end();
}
