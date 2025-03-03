/*import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource } from "typeorm";
import { Role } from "../../role.enum";
import * as bcrypt from "bcryptjs";
import { User } from "src/users/entities/user.entity";


export default class AdminSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await userRepository.insert({
      email: "admin@example.com",
      password: hashedPassword,
      name: "Admin",
      role: Role.ADMIN, // Utilisation de l'énumération
    });

    console.log("✅ Admin créé avec succès !");
  }
}*/
