import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { CropService } from "./crop.service";
import { CreateCropDto } from "./dto/create-crop.dto";
import { NonEmptyBodyPipe } from "src/common/pipes/non-empy-body.pipe";
import { UpdateCropDto } from "./dto/update-crop.dto";

@Controller('/crops')
export class CropCrontroller {
  constructor(private readonly cropService: CropService,) { }

  @Post()
  createCrop(@Body() createCropDto: CreateCropDto) {
    return this.cropService.createOne(createCropDto)
  }

  @Get(':id')
  findCropById(@Param('id', ParseIntPipe) id: number) {
    return this.cropService.findOne(id);
  }

  @Get()
  findCrops() {
    return this.cropService.findAll();
  }

  @Patch(':id')
  updateCropById(@Param('id', ParseIntPipe) id: number, @Body(new NonEmptyBodyPipe()) updateCropDto: UpdateCropDto) {
    return this.cropService.updateOne(id, updateCropDto)
  }

  @Delete(':id')
  deleteFarmById(@Param('id', ParseIntPipe) id: number) {
    return this.cropService.deleteOne(id)
  }
}