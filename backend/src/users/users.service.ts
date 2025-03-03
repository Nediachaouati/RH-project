import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'src/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

 
  async findMany(query: any): Promise<User[]> {
    
    return this.usersRepository.find(query);
  }

  async create(dto: CreateUserDto): Promise<User> {
    const { email, password, name } = dto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
      role: Role.CANDIDAT, 
    });

    const newUser = await this.usersRepository.save(user);
    delete newUser.password; 
    return newUser;
  }

  async findOne(email: string, selectSecrets: boolean = false): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true, 
        password: selectSecrets,
      },
    });
  }

  
  async createWithRole(dto: CreateUserDto, role: Role): Promise<User> {
    const { email, password, name } = dto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
      role: role, 
    });

    const newUser = await this.usersRepository.save(user);
    delete newUser.password; 
    return newUser;
  }

  
}
