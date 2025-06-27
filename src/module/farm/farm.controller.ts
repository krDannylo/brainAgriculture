import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateFarmDto } from './dto/create-farm.dto';
import { FarmService } from './farm.service';
import { NonEmptyBodyPipe } from 'src/common/pipes/non-empy-body.pipe';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { ResponseFarmDto } from './dto/response-farm.dto';
import { MessageResponseDto } from 'src/common/dto/message-response.dto';
import { ApplyUserIdInterceptor } from 'src/common/interceptors/apply-id.interceptor';
import { AuthTokenGuard } from '../auth/guard/auth-token.guard';
import { PayloadTokenDto } from '../auth/dto/payload-token.dto';
import { TokenPayloadParam } from '../auth/param/token-payload.params';

@UseGuards(AuthTokenGuard)
@Controller('/farms')
export class FarmController {

  constructor(
    private readonly farmService: FarmService,
  ) { }

  @Post()
  @UseInterceptors(ApplyUserIdInterceptor)
  createFarm(@Body() createFarmDto: CreateFarmDto): Promise<ResponseFarmDto> {
    return this.farmService.createOne(createFarmDto);
  }

  @Get(':id')
  findFarmById(
    @TokenPayloadParam() payload: PayloadTokenDto,
    @Param('id', ParseIntPipe) id: number
  ): Promise<ResponseFarmDto> {
    if (payload.role === 'admin') {
      return this.farmService.findOne(id);
    }
    return this.farmService.findOneByFarmer(id, payload.sub);
  }

  @Get()
  @UseInterceptors(ApplyUserIdInterceptor)
  findFarms(
    @TokenPayloadParam() payload: PayloadTokenDto
  ): Promise<ResponseFarmDto[]> {
    if (payload.role === 'admin') {
      return this.farmService.findAll();
    }

    const farmerId = typeof payload.sub === 'string' ? parseInt(payload.sub, 10) : payload.sub;
    return this.farmService.findAllByFarmer(farmerId);
  }

  @Patch(':id')
  updateFarmById(
    @TokenPayloadParam() payload: PayloadTokenDto,
    @Param('id', ParseIntPipe) id: number,
    @Body(new NonEmptyBodyPipe()) updateFarmDto: UpdateFarmDto
  ): Promise<ResponseFarmDto> {
    if (payload.role === 'admin') {
      return this.farmService.updateOne(id, updateFarmDto)
    }

    const farmerId = typeof payload.sub === 'string' ? parseInt(payload.sub, 10) : payload.sub;
    return this.farmService.updateOneByFarmer(id, farmerId, updateFarmDto);
  }

  @Delete(':id')
  deleteFarmById(
    @TokenPayloadParam() payload: PayloadTokenDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MessageResponseDto> {
    if (payload.role === 'admin') {
      return this.farmService.deleteOne(id);
    }

    const farmerId = typeof payload.sub === 'string' ? parseInt(payload.sub, 10) : payload.sub;
    return this.farmService.deleteOneByFarmer(id, farmerId);
  }
}
