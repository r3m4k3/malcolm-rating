import {Controller, Get} from '@nestjs/common';
import {
    DiskHealthIndicator, GRPCHealthIndicator,
    HealthCheck,
    HealthCheckService,
    MemoryHealthIndicator,
    TypeOrmHealthIndicator,
} from '@nestjs/terminus';


@Controller('health_check')
export class HealthController {
    constructor(
        private healthCheckService: HealthCheckService,
        private typeOrmHealthIndicator: TypeOrmHealthIndicator,
        private diskHealthIndicator: DiskHealthIndicator,
        private memoryHealthIndicator: MemoryHealthIndicator,
        private grpcHealthIndicator: GRPCHealthIndicator
    ) {
    }

    @Get()
    @HealthCheck()
    readiness() {
        return this.healthCheckService.check([
            () => this.typeOrmHealthIndicator.pingCheck('database', {timeout: 300}),
            () => this.diskHealthIndicator.checkStorage('storage', {thresholdPercent: 0.7, path: '/'}),
            () => this.memoryHealthIndicator.checkHeap('memory_rss', 250 * 1024 * 1024),
            () => this.grpcHealthIndicator.checkService('grpc_service', 'RatingsRpcService')
        ]);
    }
}
