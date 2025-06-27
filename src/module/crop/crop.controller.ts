import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { CropService } from "./crop.service";
import { CreateCropDto } from "./dto/create-crop.dto";
import { NonEmptyBodyPipe } from "src/common/pipes/non-empy-body.pipe";
import { UpdateCropDto } from "./dto/update-crop.dto";
import { ResponseCropDto } from "./dto/response-crop.dto";
import { MessageResponseDto } from "src/common/dto/message-response.dto";
import { AuthTokenGuard } from "../auth/guard/auth-token.guard";
import { RolesGuard } from "src/common/guards/role.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { ApplyUserIdInterceptor } from "src/common/interceptors/apply-id.interceptor";
import { TokenPayloadParam } from "../auth/param/token-payload.params";
import { PayloadTokenDto } from "../auth/dto/payload-token.dto";
import { PaginationQueryDto, PaginationResponseDto } from 'src/common/dto/pagination.dto';

@UseGuards(AuthTokenGuard)
@Controller('/crops')
export class CropCrontroller {
  constructor(private readonly cropService: CropService,) { }

  @Post()
  createCrop(
    @TokenPayloadParam() payload: PayloadTokenDto,
    @Body() dto: CreateCropDto
  ): Promise<ResponseCropDto> {
    if (payload.role === 'admin') {
      return this.cropService.createOne(dto);
    }

    const farmerId = typeof payload.sub === 'string' ? parseInt(payload.sub, 10) : payload.sub;
    return this.cropService.createOneByFarmer(dto, farmerId);
  }

  @Get(':id')
  findCropById(
    @TokenPayloadParam() payload: PayloadTokenDto,
    @Param('id', ParseIntPipe) id: number
  ): Promise<ResponseCropDto> {
    if (payload.role === 'admin') {
      return this.cropService.findOne(id);
    }

    const farmerId = typeof payload.sub === 'string' ? parseInt(payload.sub, 10) : payload.sub;
    return this.cropService.findOneByFarmer(id, farmerId);
  }

  @Get()
  @UseInterceptors(ApplyUserIdInterceptor)
  findCrops(
    @TokenPayloadParam() payload: PayloadTokenDto,
    @Query() paginationQuery: PaginationQueryDto
  ): Promise<PaginationResponseDto<ResponseCropDto>> {
    if (payload.role === 'admin') {
      return this.cropService.findAllPaginated(paginationQuery);
    }

    const farmerId = typeof payload.sub === 'string' ? parseInt(payload.sub, 10) : payload.sub;
    return this.cropService.findAllByFarmerPaginated(farmerId, paginationQuery);
  }

  @Patch(':id')
  updateCropById(
    @TokenPayloadParam() payload: PayloadTokenDto,
    @Param('id', ParseIntPipe) id: number,
    @Body(new NonEmptyBodyPipe())
    updateCropDto: UpdateCropDto
  ): Promise<ResponseCropDto> {
    if (payload.role === 'admin') {
      return this.cropService.updateOne(id, updateCropDto)
    }

    const farmerId = typeof payload.sub === 'string' ? parseInt(payload.sub, 10) : payload.sub;
    return this.cropService.updateOneByFarmer(id, farmerId, updateCropDto);
  }

  @Delete(':id')
  deleteFarmById(
    @TokenPayloadParam() payload: PayloadTokenDto,
    @Param('id', ParseIntPipe) id: number
  ): Promise<MessageResponseDto> {
    if (payload.role === 'admin') {
      return this.cropService.deleteOne(id)
    }

    const farmerId = typeof payload.sub === 'string' ? parseInt(payload.sub, 10) : payload.sub;
    return this.cropService.deleteOneByFarmer(id, farmerId);
  }
}