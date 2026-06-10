import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const admin = await this.adminService.validateUser(loginDto.username, loginDto.password);
    if (!admin) throw new UnauthorizedException('نام کاربری یا رمز عبور اشتباه است');

    const payload = { sub: admin.id, username: admin.username, role: admin.role };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      expires_in: '24h',
      admin: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
      },
    };
  }
}