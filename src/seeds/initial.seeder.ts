import { Injectable } from '@nestjs/common';
import { CreateRankDto, RanksDto } from 'src/ranks/models/ranks.dto';
import { RanksService } from 'src/ranks/services/ranks.service';
import { UserRolesService } from 'src/userRoles/services/userRoles.service';

@Injectable()
export class InitialSeeder {
  constructor(
    private readonly ranksService: RanksService, // Inject UsersService
    private readonly userRolesService: UserRolesService, // Inject UsersService
  ) {}

  async run() {
    try {
      console.log('Starting initial data seeding...');

      const ranksToSeed: CreateRankDto[] = [
        {
          number: 0,
          order: 1,
          name: 'Poborowy',
          corps: 'Strzelców',
        },
        {
          number: 3,
          order: 2,
          name: 'Szeregowy',
          corps: 'Strzelców',
        },
        {
          number: 6,
          order: 3,
          name: 'Starszy Szeregowy',
          corps: 'Strzelców',
        },
        {
          number: 30,
          order: 7,
          name: 'Sierżant',
          corps: 'Podoficerów',
        },
        {
          number: 9,
          order: 4,
          name: 'Kapral',
          corps: 'Strzelców',
        },
        {
          number: 51,
          order: 14,
          name: 'Pułkownik',
          corps: 'Oficerów',
        },
      ];

      for (const rankData of ranksToSeed) {
        try {
          const createdRank = await this.ranksService.createRank(rankData);
          console.log(`Seeded rank: ${createdRank.name}`);
        } catch (error) {
          console.error(`Error seeding rank ${rankData.name}:`, error.message);
          throw error; // Re-throw unexpected errors
        }
      }

      const userRolesToSeed = [{ name: 'member' }];

      for (const roleData of userRolesToSeed) {
        try {
          const createdRole = await this.userRolesService.createRole(roleData);
          console.log(`Seeded role: ${createdRole.name}`);
        } catch (error) {
          console.error(`Error seeding role ${roleData.name}:`, error.message);
          throw error; // Re-throw unexpected errors
        }
      }
    } catch (error) {
      console.error('Error during initial seeding:', error.message);
      throw error; // Re-throw unexpected errors
    }
    console.log('All initial data seeding complete.');
  }
}
