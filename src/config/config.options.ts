import { DotenvConfigOptions } from 'dotenv';
import { Type } from '@nestjs/common';

export interface ConfigOptions extends DotenvConfigOptions {
  configurations?: Type[];
}
