import {
  DynamicModule,
  FactoryProvider,
  Global,
  Module,
  Type,
} from '@nestjs/common';
import { configBuilder } from './config.builder';

@Module({})
@Global()
export class ConfigModule {
  static forFeature(configurations: Type[]): DynamicModule {
    const configProviders: FactoryProvider[] = configurations.map(
      (configuration) => ({
        provide: configuration,
        useFactory: () => configBuilder(configuration),
      }),
    );

    return {
      module: ConfigModule,
      providers: [...configProviders],
      exports: [...configurations],
    };
  }
}
