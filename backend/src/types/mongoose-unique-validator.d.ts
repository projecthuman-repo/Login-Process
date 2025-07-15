declare module 'mongoose-unique-validator' {
  import { Schema } from 'mongoose';
  function plugin(schema: Schema, options?: any): void;
  export = plugin;
}