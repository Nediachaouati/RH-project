import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { FindUsersDto } from './dto/find-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository:Repository<User>,
  ){}

  async create(dto: CreateUserDto):Promise<User>{
    const {email,password,name}=dto;

    const salt =await bcrypt.genSalt();
    const hashedPassword =await bcrypt.hash(password,salt);
    const user=this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
    });

    const newUser=await this.usersRepository.save(user);

    delete newUser.password;

    return newUser;
  }

  async findMany(dto:FindUsersDto){
    return this.usersRepository.createQueryBuilder('user').getMany();
  }

  async findOne(
    email:string,
    selectSecrets:boolean=false,
  ): Promise<User | null>{
    return this.usersRepository.findOne({
      where:{email},
      select:{
        id:true,
        email:true,
        name:true,
        password:selectSecrets,
      },
    });
  }  
}
