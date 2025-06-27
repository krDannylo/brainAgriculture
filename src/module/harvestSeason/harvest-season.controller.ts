import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { CreateHarvestSeasonDto } from "./dto/create-harvest-season.dto";
import { HarvestSeasonService } from "./harvest-season.service";
import { NonEmptyBodyPipe } from "src/common/pipes/non-empy-body.pipe";
import { UpdateHarvestSeasonDto } from "./dto/update-harvest-season.dto";
import { ResponseHarvestSeasonDto } from "./dto/response-harvest-season.dto";
import { MessageResponseDto } from "src/common/dto/message-response.dto";
import { AuthTokenGuard } from "../auth/guard/auth-token.guard";
import { TokenPayloadParam } from "../auth/param/token-payload.params";
import { PayloadTokenDto } from "../auth/dto/payload-token.dto";
import { ApplyUserIdInterceptor } from "src/common/interceptors/apply-id.interceptor";

@UseGuards(AuthTokenGuard)
@Controller('/harvests')
export class HarvestSeasonController {
  constructor(private readonly harvestSeasonService: HarvestSeasonService) { }


  @Post()
  @UseInterceptors(ApplyUserIdInterceptor)
  createHarvestSeason(
    @TokenPayloadParam() payload: PayloadTokenDto,
    @Body() createHarvestSeasonDto: CreateHarvestSeasonDto): Promise<ResponseHarvestSeasonDto> {
    if (payload.role === 'admin') {
      return this.harvestSeasonService.createOne(createHarvestSeasonDto)
    }
    return this.harvestSeasonService.createOneByFarmer(createHarvestSeasonDto, payload.sub);
  }

  @Get(':id')
  findHarvestById(
    @TokenPayloadParam() payload: PayloadTokenDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseHarvestSeasonDto> {
    if (payload.role === 'admin') {
      return this.harvestSeasonService.findOne(id);
    }
    return this.harvestSeasonService.findOneByFarmer(id, payload.sub);
  }

  @Get()
  @UseInterceptors(ApplyUserIdInterceptor)
  findHarvests(
    @TokenPayloadParam() payload: PayloadTokenDto
  ): Promise<ResponseHarvestSeasonDto[]> {
    if (payload.role === 'admin') {
      return this.harvestSeasonService.findAll();
    }

    const farmerId = typeof payload.sub === 'string' ? parseInt(payload.sub, 10) : payload.sub;
    return this.harvestSeasonService.findAllByFarmer(farmerId);
  }

  @Patch(':id')
  updateFarmById(
    @TokenPayloadParam() payload: PayloadTokenDto,
    @Param('id', ParseIntPipe) id: number,
    @Body(new NonEmptyBodyPipe()) updateHarvestSeasonDto: UpdateHarvestSeasonDto
  ): Promise<ResponseHarvestSeasonDto> {
    if (payload.role === 'admin') {
      return this.harvestSeasonService.updateOne(id, updateHarvestSeasonDto)
    }

    const farmerId = typeof payload.sub === 'string' ? parseInt(payload.sub, 10) : payload.sub;
    return this.harvestSeasonService.updateOneByFarmer(id, farmerId, updateHarvestSeasonDto);
  }

  @Delete(':id')
  deleteFarmById(
    @TokenPayloadParam() payload: PayloadTokenDto,
    @Param('id', ParseIntPipe) id: number
  ): Promise<MessageResponseDto> {

    if (payload.role === 'admin') {
      return this.harvestSeasonService.deleteOne(id);
    }

    const farmerId = typeof payload.sub === 'string' ? parseInt(payload.sub, 10) : payload.sub;
    return this.harvestSeasonService.deleteOneByFarmer(id, farmerId);
  }
}