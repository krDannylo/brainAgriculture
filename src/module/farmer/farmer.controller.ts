import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { FarmerService } from './farmer.service';
import { NonEmptyBodyPipe } from 'src/common/pipes/non-empy-body.pipe';
import { UpdateFarmerDto } from './dto/update-farmer.dto';

@Controller('/farmers')
export class FarmerController {

  constructor(
    private readonly farmerService: FarmerService,
  ) { }


  @Post()
  createFarmer(@Body() createFarmerDto: CreateFarmerDto) {
    return this.farmerService.create(createFarmerDto);
  }

  @Get(':id')
  findFarmerById(@Param('id', ParseIntPipe) id: number) {
    return this.farmerService.findOne(id);
  }

  @Get()
  findFarmers() {
    return this.farmerService.findAll();
  }

  @Patch(':id')
  updateFarmer(@Param('id', ParseIntPipe) id: number, @Body(new NonEmptyBodyPipe()) updateFarmerDto: UpdateFarmerDto) {
    return this.farmerService.updateOne(id, updateFarmerDto);
  }

  @Delete(':id')
  deleteFarmerById(@Param('id', ParseIntPipe) id: number) {
    return this.farmerService.deleteOne(id)
  }
}
