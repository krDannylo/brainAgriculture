import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { CreateHarvestSeasonDto } from "./dto/create-harvest-season.dto";
import { HarvestSeasonService } from "./harvest-season.service";
import { NonEmptyBodyPipe } from "src/common/pipes/non-empy-body.pipe";
import { UpdateHarvestSeasonDto } from "./dto/update-harvest-season.dto";

@Controller('/harvests')
export class HarvestSeasonController {
  constructor(private readonly harvestSeasonService: HarvestSeasonService) { }

  @Post()
  createHarvestSeason(@Body() createHarvestSeasonDto: CreateHarvestSeasonDto) {
    return this.harvestSeasonService.createOne(createHarvestSeasonDto)
  }

  @Get(':id')
  findHarvestById(@Param('id', ParseIntPipe) id: number) {
    return this.harvestSeasonService.findOne(id)
  }

  @Get()
  findHarvests() {
    return this.harvestSeasonService.findAll()
  }

  @Patch(':id')
  updateFarmById(@Param('id', ParseIntPipe) id: number, @Body(new NonEmptyBodyPipe()) updateHarvestSeasonDto: UpdateHarvestSeasonDto) {
    return this.harvestSeasonService.updateOne(id, updateHarvestSeasonDto)
  }

  @Delete(':id')
  deleteFarmById(@Param('id', ParseIntPipe) id: number) {
    return this.harvestSeasonService.deleteOne(id)
  }
}