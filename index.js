const express = require('express');
const app = express();
var cors = require('cors');
app.use(cors());
var session = require('express-session');
var exphbs  = require('express-handlebars');
var moment = require('moment');
app.use(session({
  secret: "xCubedBakesCookies",
  resave: false,
  saveUninitialized: true,
  cookie: {
      secure: false
  }
}))

app.locals.moment = require('moment');


const port = 3900;
const path=require('path');
app.use(express.static(path.join(__dirname,'public')));
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: require('./config/handlebars-helpers') //only need this
}));
app.set('view engine','hbs');
app.use(express.json());
app.use(express.urlencoded({extended:false}));

/**api section start */
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
/**api section end */

/**admin section start */
app.use('/admin/', require('./routes/admin/index'));
app.use('/admin/users/', require('./routes/admin/users'));
/**admin section end */

console.log('00000')
app.listen(port, () => {
  console.log(`Example app listenings at http://localhost:${port}`)
})