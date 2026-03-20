import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(private health: HealthCheckService) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // Health check simple del propio NestJS / App
      async (): Promise<any> => ({
        app: {
          status: 'up' as const,
        },
      }),
    ]);
  }
}