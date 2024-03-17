/**
 * App entry point
 */

const express = require('express')
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

const CacheService = require('./services/cache'); // adjust the path according to your project structure
const redisConfig = require('./config/redis'); // adjust the path according to your project structure

dotenv.config({ path:'.env' });
global.__basedir = __dirname;
const passport = require('passport');

require('./utils/dbService');
const models = require('./model');

const routes =  require('./routes');
let logger = require('morgan');

const { passportStrategy } = require('./config/passportStrategy');

const app = express();
app.use(require('./utils/response/responseHandler'));
const httpServer = require('http').createServer(app);

const corsOptions = { origin: process.env.ALLOW_ORIGIN, };
app.use(cors(corsOptions));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

passportStrategy(passport);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const eventSocketMonitor = require('./jobs/eventSocketMonitor');
const cacheService = new CacheService(redisConfig);
app.get('/', (req, res) => {
    res.render('index');
});

if (process.env.NODE_ENV !== 'test' ) {
    models.sequelize.sync ({ alter:true }).then(()=>{

    }).finally(()=>{
        app.use(routes);
        cacheService.initCompany();
        eventSocketMonitor.start().then(r => {
            console.log('Socket Monitor started');
        });
    }).catch((err) => {
        console.error('Unable to connect to the database:', err);
    })
    httpServer.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
  });
}else{
    module.exports = app
}

