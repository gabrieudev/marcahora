import { Controller, Get } from "@nestjs/common";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";

@Controller()
export class HealthController {
  @Get()
  @AllowAnonymous()
  ok() {
    return "OK";
  }
}
