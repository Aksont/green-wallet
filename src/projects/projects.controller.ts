import { Controller, Get, Param } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './interfaces/project.interface';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async findAll(): Promise<Project[]> {
    return await this.projectsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Project | null> {
    return await this.projectsService.findById(id);
  }
}
