const Koa = require('koa')

const config = require('./lib/config')
const handlers = require('./handlers')
const controllers = require('./controllers')
const mongooseConfig = require('./lib/mongoose-config')

const app = new Koa()

const path = require('path');
const serve = require('koa-static');

app.use(serve(path.join(__dirname, 'client/build')));

app.use(async (ctx, next) => {
  if (ctx.status === 404) {
    ctx.body = require('fs').readFileSync(path.join(__dirname, 'client/build/index.html'), 'utf-8');
  } else {
    await next();
  }
});

handlers.forEach((h) => app.use(h))

app.use(controllers.routes())
app.use(controllers.allowedMethods())

module.exports = (callback) => {
  mongooseConfig()
  app.listen(config.port, callback)
  return app
}
