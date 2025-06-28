import { faker } from '@faker-js/faker';

export interface FarmerFactoryData {
  id?: number;
  name: string;
  document: string;
  email: string;
  password: string;
}

export class FarmerFactory {
  static create(overrides: Partial<FarmerFactoryData> = {}): FarmerFactoryData {
    return {
      name: faker.person.fullName(),
      document: faker.helpers.replaceSymbols('###.###.###-##'),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 8 }),
      ...overrides,
    };
  }

  static createWithValidCPF(overrides: Partial<FarmerFactoryData> = {}): FarmerFactoryData {
    return this.create({
      document: '123.456.789-09',
      ...overrides,
    });
  }

  static createWithValidCNPJ(overrides: Partial<FarmerFactoryData> = {}): FarmerFactoryData {
    return this.create({
      document: '12.345.678/0001-95',
      ...overrides,
    });
  }

  static createMany(count: number, overrides: Partial<FarmerFactoryData> = {}): FarmerFactoryData[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  static createManyWithValidCPF(count: number, overrides: Partial<FarmerFactoryData> = {}): FarmerFactoryData[] {
    return Array.from({ length: count }, () => this.createWithValidCPF(overrides));
  }

  static createManyWithValidCNPJ(count: number, overrides: Partial<FarmerFactoryData> = {}): FarmerFactoryData[] {
    return Array.from({ length: count }, () => this.createWithValidCNPJ(overrides));
  }
} 