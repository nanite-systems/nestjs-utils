import {
  DynamicModule,
  FactoryProvider,
  Global,
  Module,
  Type,
} from '@nestjs/common';
import { configBuilder } from './config.builder';
import { ConfigOptions } from './config.options';
import { ConfigCoreModule } from './config-core.module';

@Module({})
@Global()
export class ConfigModule {
  static forRoot(options?: ConfigOptions): DynamicModule {
    return {
      module: ConfigModule,
      imports: [ConfigCoreModule.forRoot(options)],
      providers: this.getProviders(options?.configurations ?? []),
      exports: options?.configurations,
    };
  }

  static forFeature(configurations: Type[]): DynamicModule {
    return {
      module: ConfigModule,
      providers: this.getProviders(configurations),
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
