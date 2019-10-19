const Sequelize = require('sequelize')
const sequelize = new Sequelize('postgres://postgres:secret@localhost:5432/postgres')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 4000

const Movie = sequelize.define('movie', {
  title: Sequelize.STRING,
  yearOfRelease: Sequelize.INTEGER,
  synopsis: Sequelize.STRING
})


sequelize.sync({ force: true })
  //Use the model `create()` method to insert 3 rows
  .then(() => Promise.all([
    Movie.create({
      title: 'Harry Potter',
      yearOfRelease: 2001,
      synopsis: 'Harry Potter and the Philosopher’s Stone is an enthralling start to Harry’s journey toward coming to terms with his past and facing his future'
    }),
    Movie.create({
      title: 'Twilight',
      yearOfRelease: 2008,
      synopsis: 'This film focuses on the development of the relationship between Bella Swan (a teenage girl) and Edward Cullen (a vampire), and the subsequent efforts of Edward and his family to keep Bella safe from a coven of evil vampires.'
    }),
    Movie.create({
      title: 'Snow White and the Huntsman',
      yearOfRelease: 2012,
      synopsis: 'Snow White grows up imprisoned by her evil stepmother, Queen Ravenna, a powerful sorceress.After Snow White escapes into the forest, Ravenna tells Eric, the Huntsman that she will bring back his dead wife if he captures Snow White.'
    }),
  ]))
  .then(() => Movie.findAll())
  .catch(err => {
    console.error('Unable to create tables, shutting down...', err);
    process.exit(1);
  })


app.use(bodyParser.json())

//create a new movie resource
app.post('/', (req, res, next) => {
  Movie.create(req.body)
    .then(user => res.json(user))
    .catch(next)
})

//read all movies
app.get('/', (req, res, next) => {
  const limit = req.query.limit || 25
  const offset = req.query.offset || 0

  Movie
    .findAndCountAll({ limit, offset })
    .then(result => res.send({ data: result.rows, total: result.count }))
    .catch(next)
})

//read all movies - Implement pagination on the "read all" collections resource
app.get('/read-all', (req, res, next) => {
  const limit = req.query.limit || 25
  const offset = req.query.offset || 0

  Movie
    .findAndCountAll({ limit, offset })
    .then(result => res.send({ data: result.rows, total: result.count }))
    .catch(next)
})


//read a single movie resource
app.get('/:id', (req, res, next) => {
  Movie
    .findByPk(req.params.id)
    .then(movie => {
      if (movie) {
        return res.json(movie)
      }
      return res.status(404).end()
    })
    .catch(error => next(error))
})


//update a single movie resource
app.patch('/:id', (req, res, next) => {
  Movie.findByPk(req.params.id)
    .then(movie => {
      if (movie) {
        return movie.update(req.body)
      }
      return res.status(404).end()
    })
    .then(movie => res.send(movie))
    .catch(next)
})

app.put('/:id', (req, res, next) => {
  Movie.findByPk(req.params.id)
    .then(movie => {
      if (movie) {
        return movie.update(req.body)
      }
      return res.status(404).end()
    })
    .then(movie => res.send(movie))
    .catch(next)
})

//delete a single movie resource
app.delete('/:id', (req, res, next) => {
  Movie.destroy({ where: { id: req.params.id } })
    .then(number => res.send({ number }))
    .catch(next)
})

app.listen(port, () => console.log(`Listening on :${port}`))