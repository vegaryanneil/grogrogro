const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({ helpers });

const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

// Inform Express.js on which template engine to use
app.set('view engine', 'handlebars');
app.engine('handlebars', hbs.engine);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});

app.get('/api/notes', (req, res) => {
  fs.readFile('db/schema.sql', 'utf8', function read(err, data) {
      if (err) {
          throw err;
      }
      res.json(JSON.parse(data)); //res.json(JSON.parse(notesdata));
  });
})
app.post('/api/notes', (req, res) => {
  fs.readFile('db/schema.sql', 'utf8', function read(err, data) {
      if (err) {
          throw err;
      }
      let notes = JSON.parse(data);
      const newNote = {...req.body,id:uuidv1()}
      notes.push(newNote);
      fs.writeFile('db/schema.sql', JSON.stringify(notes), err => {
          if (err) {
              throw err;
          }
          res.json(req.body) //res.json(notes)
      })
  });
});

app.delete('/api/notes/:id', (req, res) => {
  //user wants to delete a note
  //which note do they want to delete?
  //edit our "DB" to reflect the delete

  fs.readFile('db/schema.sql', 'utf8', function read(err, data) {
      if(err) {
          throw err;
      }
      let notes = JSON.parse(data);
      console.log(notes);
      let newNotes = notes.filter((note) => {
          return req.params.id !== note.id;
      });
      console.log(newNotes);

      fs.writeFile('db/schema.sql', JSON.stringify(newNotes), err => {
          console.log(err);
          res.json({ok:true}) //res.json(notes)
      })
  });
})