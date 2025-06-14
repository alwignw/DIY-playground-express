import 'dotenv/config'
import { Options } from "sequelize";
interface DatabaseConfig extends Options {
    user: string;
}

const dbConfig: DatabaseConfig = {
    user: process.env[`DB_USER_${[process.env.NODE_ENV]}`] ?? "sa",
    username: process.env[`DB_USER_${[process.env.NODE_ENV]}`] ?? "",
    password: process.env[`DB_PWD_${[process.env.NODE_ENV]}`] ?? "",
    host: process.env[`DB_HOST_${[process.env.NODE_ENV]}`] ?? "127.0.0.1",
    dialect: 'postgres',
    dialectOptions: {
        useUTC: false, // for reading from database
    },
    port: Number(process.env[`DB_PORT_${[process.env.NODE_ENV]}`]) ?? 1433,
    timezone: '+07:00',
    // logging:false,

};

export {dbConfig};
