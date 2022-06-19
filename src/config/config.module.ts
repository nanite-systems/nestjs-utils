import { DynamicModule, FactoryProvider, Module, Type } from '@nestjs/common';
import { configBuilder } from './config.builder';
import { expand } from 'dotenv-expand';
import { config, DotenvConfigOptions } from 'dotenv';

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

  private static getProviders(configurations: Type[]): FactoryProvider[] {
    return configurations.map((configuration) => ({
      provide: configuration,
      useFactory: () => configBuilder(configuration),
    }));
  }
}
