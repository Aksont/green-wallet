import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';

@Injectable()
export class ProjectsRepository {
  constructor(
    @InjectModel(Project.name)
    private model: Model<ProjectDocument>,
  ) {}

  async findById(id: string): Promise<Project | null> {
    return this.model.findOne({ id }).exec();
  }

  async findAll(): Promise<Project[]> {
    return this.model.find().exec();
  }
}
