import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { FarmerService } from './farmer.service';
import { NonEmptyBodyPipe } from 'src/common/pipes/non-empy-body.pipe';
import { UpdateFarmerDto } from './dto/update-farmer.dto';
import { ResponseFarmerDto } from './dto/response-farmer.dto';
import { MessageResponseDto } from 'src/common/dto/message-response.dto';
import { AuthTokenGuard } from '../auth/guard/auth-token.guard';
import { PayloadTokenDto } from '../auth/dto/payload-token.dto';
import { TokenPayloadParam } from '../auth/param/token-payload.params';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@UseGuards(AuthTokenGuard)
@Controller('/farmers')
export class FarmerController {

  constructor(
    private readonly farmerService: FarmerService,
  ) { }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Post()
  createFarmer(@Body() createFarmerDto: CreateFarmerDto): Promise<ResponseFarmerDto> {
    return this.farmerService.create(createFarmerDto);
  }

  @Get('me')
  findLoggedFarmer(@TokenPayloadParam() tokenPayload: PayloadTokenDto) {
    return this.farmerService.findOne(tokenPayload.sub);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get(':id')
  findFarmerById(@Param('id', ParseIntPipe) id: number): Promise<ResponseFarmerDto> {
    return this.farmerService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get()
  findFarmers(): Promise<ResponseFarmerDto[]> {
    return this.farmerService.findAll();
  }

  @Patch('me')
  updateLoggedFarmer(
    @TokenPayloadParam() tokenPayload: PayloadTokenDto,
    @Body(new NonEmptyBodyPipe()) updateFarmerDto: UpdateFarmerDto
  ): Promise<ResponseFarmerDto> {
    return this.farmerService.updateById(tokenPayload.sub, updateFarmerDto);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch(':id')
  updateFarmer(
    @Param('id', ParseIntPipe) id: number,
    @Body(new NonEmptyBodyPipe()) updateFarmerDto: UpdateFarmerDto
  ): Promise<ResponseFarmerDto> {
    return this.farmerService.updateById(id, updateFarmerDto);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete(':id')
  deleteFarmerById(@Param('id', ParseIntPipe) id: number): Promise<MessageResponseDto> {
    return this.farmerService.deleteById(id)
  }
}
