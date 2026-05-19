import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL
});

async function main() {
  await client.connect();
  console.log("Connected.");

  const res = await client.query(`
    SELECT COUNT(*) FROM pages_blocks_feature_block;
  `);
  console.log("Rows count:", res.rows[0].count);

  const resRows = await client.query(`
    SELECT id, variant, columns FROM pages_blocks_feature_block LIMIT 10;
  `);
  console.log("Sample rows:");
  console.table(resRows.rows);

  await client.end();
}

main().catch(console.error);
