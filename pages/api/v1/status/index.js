import database from "infra/database";

async function status(_req, res) {
  const updatedAt = new Date().toISOString();

  const dbVersionResult = await database.query("SHOW server_version;");
  const dbVersion = dbVersionResult.rows[0].server_version;

  const dbMaxConnResult = await database.query("SHOW max_connections;");
  const dbMaxConn = dbMaxConnResult.rows[0].max_connections;

  const dbName = process.env.POSTGRES_DB;
  const dbOpenedConnResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [dbName],
  });
  const dbOpenedConn = dbOpenedConnResult.rows[0].count;

  res.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: dbVersion,
        max_connections: Number(dbMaxConn),
        opened_connections: dbOpenedConn,
      },
    },
  });
}

export default status;
