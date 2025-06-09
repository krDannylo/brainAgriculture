import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { FarmerService } from './farmer.service';
import { NonEmptyBodyPipe } from 'src/common/pipes/non-empy-body.pipe';
import { UpdateFarmerDto } from './dto/update-farmer.dto';
import { ResponseFarmerDto } from './dto/response-farmer.dto';
import { MessageResponseDto } from 'src/common/dto/message-response.dto';

@Controller('/farmers')
export class FarmerController {

  constructor(
    private readonly farmerService: FarmerService,
  ) { }


  @Post()
  createFarmer(@Body() createFarmerDto: CreateFarmerDto): Promise<ResponseFarmerDto> {
    return this.farmerService.create(createFarmerDto);
  }

  @Get(':id')
  findFarmerById(@Param('id', ParseIntPipe) id: number): Promise<ResponseFarmerDto> {
    return this.farmerService.findOne(id);
  }

  @Get()
  findFarmers(): Promise<ResponseFarmerDto[]> {
    return this.farmerService.findAll();
  }

  @Patch(':id')
  updateFarmer(
    @Param('id', ParseIntPipe) id: number,
    @Body(new NonEmptyBodyPipe()) updateFarmerDto: UpdateFarmerDto
  ): Promise<ResponseFarmerDto> {
    return this.farmerService.updateOne(id, updateFarmerDto);
  }

  @Delete(':id')
  deleteFarmerById(@Param('id', ParseIntPipe) id: number): Promise<MessageResponseDto> {
    return this.farmerService.deleteOne(id)
  }
}
