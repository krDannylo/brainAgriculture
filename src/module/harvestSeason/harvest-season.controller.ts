import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { CreateHarvestSeasonDto } from "./dto/create-harvest-season.dto";
import { HarvestSeasonService } from "./harvest-season.service";
import { NonEmptyBodyPipe } from "src/common/pipes/non-empy-body.pipe";
import { UpdateHarvestSeasonDto } from "./dto/update-harvest-season.dto";
import { ResponseHarvestSeasonDto } from "./dto/response-harvest-season.dto";
import { MessageResponseDto } from "src/common/dto/message-response.dto";

@Controller('/harvests')
export class HarvestSeasonController {
  constructor(private readonly harvestSeasonService: HarvestSeasonService) { }

  @Post()
  createHarvestSeason(@Body() createHarvestSeasonDto: CreateHarvestSeasonDto): Promise<ResponseHarvestSeasonDto> {
    return this.harvestSeasonService.createOne(createHarvestSeasonDto)
  }

  @Get(':id')
  findHarvestById(@Param('id', ParseIntPipe) id: number): Promise<ResponseHarvestSeasonDto> {
    return this.harvestSeasonService.findOne(id)
  }

  @Get()
  findHarvests(): Promise<ResponseHarvestSeasonDto[]> {
    return this.harvestSeasonService.findAll()
  }

  @Patch(':id')
  updateFarmById(
    @Param('id', ParseIntPipe) id: number,
    @Body(new NonEmptyBodyPipe()) updateHarvestSeasonDto: UpdateHarvestSeasonDto
  ): Promise<ResponseHarvestSeasonDto> {
    return this.harvestSeasonService.updateOne(id, updateHarvestSeasonDto)
  }

  @Delete(':id')
  deleteFarmById(@Param('id', ParseIntPipe) id: number): Promise<MessageResponseDto> {
    return this.harvestSeasonService.deleteOne(id)
  }
}