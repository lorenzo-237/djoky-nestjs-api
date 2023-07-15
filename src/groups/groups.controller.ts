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
import { GroupEntity } from './entities';

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

  @Get()
  @ApiOkResponse({ type: GroupEntity, isArray: true })
  async findAll() {
    const groups = await this.groupsService.findAll();
    return groups.map((group) => new GroupEntity(group));
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
