import { SetMetadata } from '@nestjs/common';

export interface Ownership {
  model: string;
  lookupKey: string;
  value?: any;
}

export const OWNERSHIP_KEY = 'ownership';
export const Ownership = (input: Ownership) =>
  SetMetadata(OWNERSHIP_KEY, input);
