import {
  DynamicModule,
  FactoryProvider,
  Global,
  Inject,
  Module,
  OnModuleInit,
  Type,
} from '@nestjs/common';
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { configBuilder } from './config.builder';
import { ConfigOptions } from './config.options';

const CONFIG_OPTIONS = Symbol('provide:config_options');

@Module({})
@Global()
export class ConfigModule implements OnModuleInit {
  static forRoot(options: ConfigOptions): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
      ],
    };
  }

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

  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: ConfigOptions,
  ) {}

  onModuleInit(): void {
    expand(config(this.options));
  }
}
