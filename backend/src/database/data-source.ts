/*import "reflect-metadata";
import { User } from "src/users/entities/user.entity";
import { DataSource } from "typeorm";
import { runSeeders } from "typeorm-extension";

export const AppDataSource = new DataSource({
  type: "mysql", 
  host: "localhost",
  port: 3306,
  username: 'root',
  password: '',
  database: 'db-rh',
  entities: [User],
  synchronize: true, 
  migrations: ["src/database/migrations/*.ts"],
});

export const seedDatabase = async () => {
  await AppDataSource.initialize();
  await runSeeders(AppDataSource);
}; */
