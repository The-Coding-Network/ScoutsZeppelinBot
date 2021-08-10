import { SimpleError } from "../SimpleError";
import { Connection, createConnection } from "typeorm";

let connectionPromise: Promise<Connection>;

export let connection: Connection;

export function connect() {
  if (!connectionPromise) {
    connectionPromise = createConnection().then(async (newConnection) => {
      if (process.argv.includes('init')) {
        const staff = (process.env.STAFF ?? "").split(',');
        // Build the global config
        const config = {
          "prefix": "!",
          "plugins": {
            "utility": {}
          }
        };
        staff.map(id => config["owners"][id] = 100)

        await newConnection.query(`
          INSERT IGNORE INTO configs (id, \`key\`, config, is_active, edited_by)
          VALUES (1, "global", ?, true, 106391128718245888)
        `, [JSON.stringify(config)])
      }
      // Verify the DB timezone is set to UTC
      const r = await newConnection.query("SELECT TIMEDIFF(NOW(), UTC_TIMESTAMP) AS tz")
      if (r[0].tz !== "00:00:00") {
        throw new SimpleError(`Database timezone must be UTC (detected ${r[0].tz})`);
      }

      connection = newConnection
      return newConnection
    });
  }

  return connectionPromise;
}