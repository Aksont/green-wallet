// users.service.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
// import { User } from './interfaces/user.interface';
import { User } from './schemas/user.schema';
import { UsersRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(private userRepo: UsersRepository) {}
  // private users: User[] = [
  //   {
  //     id: '70d81692-2aa6-4651-bfb0-ff965a4377e7',
  //     email: 'nadia@gmail.com',
  //     password: '$2b$10$kgXm5EBUs6In3YPN45wVGe1Ig5DepZt81ty6FYdEiBnByhzh09yL2',
  //     name: 'Nadia',
  //     isVerified: true,
  //   },
  //   {
  //     id: '60381692-2aa6-4651-bfb0-ff965a4377e7',
  //     email: 'aleksa@gmail.com',
  //     password: '$2b$10$1XgUXUMLvlJebuwHLqDtpeePPMDTUrpT9bYkEfb5otd70OxpkxQyO',
  //     name: 'Aleksa',
  //     isVerified: true,
  //   },
  // ];

  async register(dto: UserDto): Promise<void> {
    const userWithEmail = await this.userRepo.findByEmail(dto.email); // this.users.find((u) => u.email === dto.email);
    if (userWithEmail) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    // const user: User = {
    //   // id: uuid(),
    //   name: dto.name,
    //   email: dto.email,
    //   password: hashedPassword,
    //   isVerified: false,
    // };
    // this.users.push(user);
    await this.userRepo.create({
      id: uuid(),
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      isVerified: false,
    });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepo.findByEmail(email);
    // const user = this.users.find((u) => u.email === email);
    if (!user || !user.isVerified) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : null;
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepo.findById(id);
    // return this.users.find((u) => u.id === id);
  }

  async findByEmail(email: string): Promise<User | null> {
    // return this.users.find((u) => u.email === email);
    return await this.userRepo.findByEmail(email);
  }

  // getUserStats(id: string) {
  //   const trips = this.tripsService.findUserTrips(id);
  //   const proofs = this.compensationService.findUserProofs(id);
  //   const infos = this.compensationService.findUserInfos(id);
  //   const totalCo2 = trips.reduce((sum, trip) => {
  //     return sum + (trip.totalCo2emissionInKg ?? 0);
  //   }, 0);
  //   const totalKm = trips.reduce((sum, trip) => {
  //     return sum + (trip.totalDistanceInKm ?? 0);
  //   }, 0);

  //   return {
  //     userId: id,
  //     trees: infos.reduce((sum, info) => {
  //       return sum + (info.donation?.trees ?? 0);
  //     }, 0),
  //     hours: infos.reduce((sum, info) => {
  //       return sum + (info.volunteering?.hours ?? 0);
  //     }, 0),
  //     totalCo2: totalCo2,
  //     compensatedCo2: infos.reduce((sum, info) => {
  //       return sum + (info.compensatedCo2 ?? 0);
  //     }, 0),
  //     averageCo2PerKm: totalCo2 / totalKm,
  //     totalTrips: trips.length,
  //     compensatedTrips: proofs.length,
  //   };
  // }
}
