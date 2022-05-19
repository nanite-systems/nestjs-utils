import { FactoryProvider, Logger, Type } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { configStorage } from './config.storage';

export function configBuilder(config: Type): FactoryProvider {
  return {
    provide: config,
    useFactory: async () => {
      const logger = new Logger('Config');
      const base = {} as any;

      // Hydrate the base instance
      for (const property of configStorage.getEnvProperties(config)) {
        const options = configStorage.getEnvMetadata(config, property);

        if (options && process.env[options.env])
          base[property] = process.env[options.env];
      }

      // Transform the base instance
      const instance = plainToInstance(config, base, {
        excludeExtraneousValues: true,
      });

      try {
        // Validate the values
        await validateOrReject(instance);
      } catch (errors) {
        logger.error('Invalid configuration', errors);
        process.exit(1);
      }

      return Object.freeze(instance);
    },
  };
}
