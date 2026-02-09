import { Global, Module } from "@nestjs/common";
import { db } from "@marcahora/db";
import { DRIZZLE_DB } from "./database.constants";

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE_DB,
      useValue: db,
    },
  ],
  exports: [DRIZZLE_DB],
})
export class DatabaseModule {}
