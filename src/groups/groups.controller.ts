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
import { GroupEntity, GroupResponse } from './entities';

@Controller('groups')
@ApiTags('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @ApiCreatedResponse({ type: GroupEntity })
  async create(
    @Body() createGroupDto: CreateGroupDto,
    @Session() session: Record<string, any>,
  ) {
    if (!session?.passport?.user?.id) {
      throw new UnauthorizedException();
    }

    const userId = session.passport.user.id;
    return new GroupEntity(
      await this.groupsService.create(userId, createGroupDto),
    );
  }

  @Get('all')
  @ApiOkResponse({ type: GroupResponse })
  async findAll() {
    const groups = await this.groupsService.findAll();
    return { count: groups.length, rows: groups };
  }

  @Get()
  @ApiOkResponse({ type: GroupResponse })
  async findValidGroup() {
    const groups = await this.groupsService.findAllValid();
    return { count: groups.length, rows: groups };
  }

  @Get(':id')
  @ApiOkResponse({ type: GroupEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new GroupEntity(await this.groupsService.findOne(id));
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: GroupEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return new GroupEntity(await this.groupsService.update(id, updateGroupDto));
  }

  @Delete(':id')
  @ApiOkResponse({ type: GroupEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new GroupEntity(await this.groupsService.remove(id));
  }
}
