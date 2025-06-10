import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProjectType } from '../enums/project-type.enum';
import { JoinType } from '../enums/join-type.enum';

export type ProjectDocument = Project & Document;

@Schema()
export class Project {
  @Prop({ required: true })
  id!: string;

  @Prop({ required: true, enum: ProjectType })
  type!: ProjectType;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true })
  country!: string;

  @Prop({ required: true })
  coordinates!: string;

  @Prop({ required: true })
  cause!: string;

  @Prop({
    type: [String],
    validate: [(val: string[]) => val.length <= 5, 'Max 5 tags'],
  })
  tags!: string[];

  @Prop()
  startDate?: Date;

  @Prop()
  endDate?: Date;

  @Prop({ required: true })
  image!: string; // can be URL or base64 blob, depending on frontend/backend decision

  // Specific to DonationProject
  @Prop()
  unitPrice?: number;

  @Prop()
  currency?: string;

  // Specific to VolunteerProject
  @Prop({ enum: JoinType })
  joinType?: JoinType;

  // Specific to Challenge
  @Prop()
  challengeSteps?: string;

  @Prop()
  reward?: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
