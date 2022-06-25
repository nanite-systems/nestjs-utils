import {
  DynamicModule,
  FactoryProvider,
  Logger,
  Module,
  Type,
} from '@nestjs/common';
import { expand } from 'dotenv-expand';
import { config, DotenvConfigOptions } from 'dotenv';
import { configStorage } from './config.storage';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

@Module({})
export class ConfigModule {
  static forRoot(options?: DotenvConfigOptions): void {
    expand(config(options));
  }

  static forFeature(configurations: Type<object>[]): DynamicModule {
    return {
      module: ConfigModule,
      providers: [...this.getProviders(configurations)],
      exports: [...configurations],
    };
  }

  static async resolveConfig<T extends object>(
    configuration: Type<T>,
  ): Promise<T> {
    const logger = new Logger('Config');
    const base = {} as any;

    // Hydrate the base instance
    for (const property of configStorage.getEnvProperties(configuration)) {
      const options = configStorage.getEnvMetadata(configuration, property);

      if (options && process.env[options.env])
        base[property] = process.env[options.env];
    }

    // Transform the base instance
    const instance = plainToInstance(configuration, base, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });

    try {
      // Validate the values
      await validateOrReject(instance);
    } catch (errors) {
      logger.error('Invalid configuration', errors);
      process.exit(1);
    }

    return Object.freeze(instance);
  }

  private static getProviders(configurations: Type[]): FactoryProvider[] {
    return configurations.map((configuration) => ({
      provide: configuration,
      useFactory: () => this.resolveConfig(configuration),
    }));
  }
}
