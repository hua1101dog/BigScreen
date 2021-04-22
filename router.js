/**
 * fengjianli
 */
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let freerRouter = require('./routes/freeAction');
let spaceRouter = require('./routes/spaceAction');
let birdMapRouter = require('./routes/mapAction');
let schemeTypeRouter = require('./routes/schemeTypeAction');
let schemeRouter = require('./routes/schemeAction');
let iconRouter = require('./routes/iconAction');
let ueditorRouter = require('./routes/ueditorAction');


let urlPrefixRouter = require('./routes/urlPrefixAction');
let interfaceRouter = require('./routes/interfaceAction');
let dataNodeRouter = require('./routes/dataNodeAction');
let sceneRouter = require('./routes/sceneAction');


let instanceRouter = require('./routes/instanceAction');
let cacheRouter = require('./routes/cacheAction');

let apiRouter = require('./routes/apiAction');

let bigScreenPathRouter = require('./routes/bigscreenPathAction');

let outworkRouter = require('./routes/outworkAction');
let projectRouter = require('./routes/projectAction');
let visitorRouter = require('./routes/visitorAction');

module.exports = function (app) {
    //index
    app.use('/',indexRouter);
    app.use('/free',freerRouter );
    app.use('/users', usersRouter);
    app.use('/space', spaceRouter);
    app.use('/birdMap', birdMapRouter);
    app.use('/schemeType', schemeTypeRouter);
    app.use('/scheme', schemeRouter);
    app.use('/icon', iconRouter);
    app.use('/common', ueditorRouter);

    app.use('/urlPrefix', urlPrefixRouter);
    app.use('/interface', interfaceRouter);
    app.use('/scene', sceneRouter);
    app.use('/dataNode', dataNodeRouter);

    app.use('/instance', instanceRouter);
    app.use('/cache', cacheRouter);

    app.use('/bigScreenPath', bigScreenPathRouter);

    app.use('/outwork', outworkRouter);
    app.use('/project', projectRouter);
    app.use('/visitor', visitorRouter);

    //对大屏统一提供接口，以api 开头
    app.use('/api', apiRouter);

};
