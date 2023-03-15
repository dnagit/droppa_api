import express from 'express';
import cors from 'cors'
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import httpResponse from './handles/httpresponse';
import allRoutes from './routes/all.routes';
import config from './config';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import pkg from 'express-fileupload'
const fileUpload = pkg;

const app = express();
app.use(cors());
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));
const swaggerDocument = YAML.load('./swagger.yml');
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// app.disable('etag'); disable cache 304
app.use(express.json({limit: '50mb'}));
app.use(
  express.urlencoded({
    limit: '50mb',
    extended: true,
  })
);


const dirname = path.resolve();
app.use('/public/img', express.static(`${dirname}/public/img`));
app.use(cookieParser());
app.use(logger('dev'));

app.use(allRoutes(app));
app.use(httpResponse);

const port = config.port;
app.listen(port, () => {
  console.log(`Server Listen At http://localhost:${port}`);
  console.log(`Server Listen At http://localhost:${port}/swagger`);
});
