import { Injectable } from '@nestjs/common';
import { ProjectType } from './enums/project-type.enum';
import { Project } from './interfaces/project.interface';
import { ProjectsRepository } from './projects.repository';

@Injectable()
export class ProjectsService {
  constructor(private projectsRepo: ProjectsRepository) {}

  async findAll(): Promise<Project[]> {
    return await this.projectsRepo.findAll();
  }

  async findById(id: string): Promise<Project | null> {
    return await this.projectsRepo.findById(id);
  }

  async findProjects(
    countries: string[],
    projectTypes: ProjectType[] = [],
  ): Promise<Project[]> {
    const projects = await this.projectsRepo.findAll();
    if (projectTypes.length === 0) {
      return projects.filter((p) => countries.includes(p.country));
    }

    return projects.filter(
      (p) => countries.includes(p.country) && projectTypes.includes(p.type),
    );
  }
}
