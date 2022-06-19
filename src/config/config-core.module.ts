import {
  DynamicModule,
  Global,
  Inject,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigOptions } from './config.options';
import { expand } from 'dotenv-expand';
import { config } from 'dotenv';

const CONFIG_OPTIONS = Symbol('provide:config_options');

@Global()
@Module({})
export class ConfigCoreModule implements OnModuleInit {
  static forRoot(options: ConfigOptions = {}): DynamicModule {
    return {
      module: ConfigCoreModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
      ],
    };
  }

  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: ConfigOptions,
  ) {}

  onModuleInit(): void {
    expand(config(this.options));
  }
}