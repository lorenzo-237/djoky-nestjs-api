import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GroupResponse, GroupRow } from './entities';
import { Roles } from 'src/utils/decorators';
import { Role } from 'src/utils/enums';
import { SessionPassport } from 'src/utils/types';

@Controller('groups')
@ApiTags('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @ApiCreatedResponse({ type: GroupRow })
  @Roles(Role.Admin, Role.Manager)
  async create(
    @Body() createGroupDto: CreateGroupDto,
    @Session() session: SessionPassport,
  ) {
    if (!session.passport.user.id) {
      throw new UnauthorizedException();
    }

    const userId = session.passport.user.id;
    return await this.groupsService.create(userId, createGroupDto);
  }

  @Get()
  @ApiOkResponse({ type: GroupResponse })
  async findValidGroups() {
    const groups = await this.groupsService.findAll();
    return { count: groups.length, rows: groups };
  }

  @Get(':id')
  @ApiOkResponse({ type: GroupRow })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.groupsService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: GroupRow })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return await this.groupsService.update(id, updateGroupDto);
  }

  @Patch(':id/validate')
  @ApiOkResponse({ type: GroupRow })
  @Roles(Role.Admin, Role.Manager)
  async validateCategory(@Param('id', ParseIntPipe) id: number) {
    return await this.groupsService.validate(id);
  }

  @Patch(':id/pending')
  @ApiOkResponse({ type: GroupRow })
  @Roles(Role.Admin, Role.Manager)
  async pendingCategory(@Param('id', ParseIntPipe) id: number) {
    return await this.groupsService.pending(id);
  }

  @Delete(':id')
  @ApiOkResponse({ type: GroupRow })
  @Roles(Role.Admin)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.groupsService.remove(id);
  }
}
