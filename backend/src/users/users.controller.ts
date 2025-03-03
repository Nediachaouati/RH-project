import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { FindUsersDto } from './dto/find-users.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findMany(@Query() query: FindUsersDto) {
    return this.usersService.findMany(query);
  }

  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return user;
  }

  // pour ajouter un RH 
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(Role.ADMIN) 
  @Post('add-rh')
  async addRh(@Body() createUserDto: CreateUserDto) {
    
    const rhUser = await this.usersService.createWithRole(createUserDto, Role.RH);
    return rhUser;
  }
}