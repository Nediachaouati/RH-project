import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { FindUsersDto } from './dto/find-users.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MailerService } from '@nestjs-modules/mailer';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService,
    private mailerService: MailerService,
  ) {}

  // lister et filtrer uniquement les RH
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('rh')
  findRH(@Query() query: FindUsersDto) {
    return this.usersService.findUsersByRoles([Role.RH], query);  
  }

  // lister et filtrer uniquement les Candidats
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('candidats')
  findCandidats(@Query() query: FindUsersDto) {
    return this.usersService.findUsersByRoles([Role.CANDIDAT], query);  
  }

  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return user;
  }

  // update users
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@CurrentUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user.id, updateUserDto);
  }

  // add RH 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('add-rh')
  async addRh(@Body() createUserDto: CreateUserDto) {
  const { user, plainPassword } = await this.usersService.createWithRole(createUserDto, Role.RH);

  try {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Détails de votre compte RH',
      template: 'welcome-rh',
      context: {
        name: user.name || 'RH',
        email: user.email,
        password: plainPassword,
      },
    });
    console.log('Email envoyé avec succès à', user.email);
  } catch (error) {
    console.error('Erreur lors de l’envoi de l’email :', error);
    throw error; 
  }

  return user;
}

  // delete user
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.usersService.delete(+id);
    return { message: `Utilisateur avec l'ID ${id} supprimé avec succès` };
  }

}