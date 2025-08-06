import { CreateRankDto } from 'src/ranks/models/ranks.dto';
import dataSource from '../config/data-source';
import { RanksEntity } from '../ranks/models/ranks.entity';
import { UserRolesEntity } from 'src/userRoles/models/userRoles.entity';

async function runSeed() {
  await dataSource.initialize();
  const ranksEntity = dataSource.getRepository(RanksEntity);
  const userRolesEntity = dataSource.getRepository(UserRolesEntity);
  console.log({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    db: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USER,
  });
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
        await ranksEntity.save(rankData);
        console.log(`Seeded rank: ${rankData.name}`);
      } catch (error) {
        console.error(`Error seeding rank ${rankData.name}:`, error.message);
        throw error; // Re-throw unexpected errors
      }
    }

    const userRolesToSeed = [{ name: 'member' }];

    for (const roleData of userRolesToSeed) {
      try {
        await userRolesEntity.save(roleData);
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
  await dataSource.destroy(); // Close the database connection
}

runSeed().catch(console.error);
