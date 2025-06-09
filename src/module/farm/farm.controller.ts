import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateFarmDto } from './dto/create-farm.dto';
import { FarmService } from './farm.service';
import { NonEmptyBodyPipe } from 'src/common/pipes/non-empy-body.pipe';
import { UpdateFarmDto } from './dto/update-farm.dto';

@Controller('/farms')
export class FarmController {

  constructor(
    private readonly farmService: FarmService,
  ) { }


  @Post()
  createFarm(@Body() createFarmDto: CreateFarmDto) {
    return this.farmService.createOne(createFarmDto);
  }

  @Get(':id')
  findFarmById(@Param('id', ParseIntPipe) id: number) {
    return this.farmService.findOne(id);
  }

  @Get()
  findFarms() {
    return this.farmService.findAll();
  }

  @Patch(':id')
  updateFarmById(@Param('id', ParseIntPipe) id: number, @Body(new NonEmptyBodyPipe()) updateFarmDto: UpdateFarmDto) {
    return this.farmService.updateOne(id, updateFarmDto)
  }

  @Delete(':id')
  deleteFarmById(@Param('id', ParseIntPipe) id: number) {
    return this.farmService.deleteOne(id)
  }
}
