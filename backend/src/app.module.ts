import { ConfigModule } from '@nestjs/config';
import { PurchaseModule } from './purchase/purchase.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env.dev', '.env'],
    }),
    PurchaseModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
