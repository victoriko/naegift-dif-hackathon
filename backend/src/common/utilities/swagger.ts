import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

// Keep the token value even after refreshing the web page
const swaggerCustomOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
};

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('Naegift DID Admin. API V2 Docs V.0.1')
    .setDescription('Naegift DID Admin. API Usage Guide')
    .setVersion('0.1')
    // JWT token settings
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);

  // Change group order
  document.tags = [
    {
      name: 'Authentication API',
      description: 'APIs related to authentication',
    },
    { name: 'Code API', description: 'APIs related to code information' },
    { name: 'Gift API', description: 'APIs related to gift information' },
    {
      name: 'Shop User API',
      description: 'APIs related to shop user information',
    },
    {
      name: 'Received Gift API',
      description: 'APIs related to received gift information',
    },
    { name: 'PG API', description: 'APIs related to PG payment' },
    {
      name: 'Purchase API',
      description: 'APIs related to purchase information',
    },
    { name: 'PG-TOSS API', description: 'APIs related to PG-TOSS' },
    { name: 'QNA API', description: 'APIs related to QNA information' },
    { name: 'Refund API', description: 'APIs related to refund information' },
    { name: 'Store API', description: 'APIs related to store information' },
    {
      name: 'Shop Manager API',
      description: 'APIs related to shop manager information',
    },
    {
      name: 'Platform API',
      description: 'APIs related to platform information',
    },
  ];

  SwaggerModule.setup('api-docs', app, document, swaggerCustomOptions);
}
