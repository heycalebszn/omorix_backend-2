import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';
import app from './app.js';

const swaggerDocument = YAML.parse(fs.readFileSync('./docs/openapi.yaml', 'utf8'));

const swaggerApp = express();
swaggerApp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.SWAGGER_PORT || 3001;

swaggerApp.listen(PORT, () => {
    console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});

// Optional: Integrate with main app if desired
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));