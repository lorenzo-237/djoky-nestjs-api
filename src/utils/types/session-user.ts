import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserSession {
  @ApiProperty()
  id: number;
  @ApiProperty()
  username: string;
  @ApiProperty({ enum: ['ADMIN', 'USER', 'MANAGER'] })
  role: Role;
  @ApiProperty()
  email: string;
  @ApiProperty()
  lastname: string;
  @ApiProperty()
  firstname: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}

export class SessionPassport {
  @ApiProperty()
  cookie: {
    path: string;
    _expires: Date;
    originalMaxAge: number;
    httpOnly: boolean;
    secure: false;
  };
  passport: {
    user: UserSession;
  };
}
