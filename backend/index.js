/* eslint-disable no-unused-vars */
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');

var app = express();
app.use(cors());

// use JSON
app.use(bodyParser.json());

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// connect to the database
async function conn() {
  await prisma.$connect();
}

// disconnects to the database
async function disconn() {
  await prisma.$disconnect();
}

// PORT
const port = 8080;

// === SERVER ===


// ====== CREATE ======
// ###### POST ROUTES ######

// Create new user
app.post('/Signup', async (req, res) => {
  conn();

  const newUser = await prisma.users.create({
    data: req.body
  });

  res.send({
    status: res.statusCode,
    valid: true
  });

  disconn();
});

// Creates a new subject
app.post('/MainApp', async (req, res) => {
  conn();

  const user = await prisma.users.findFirst({
    where: {
      id: {
        equals: req.query.id
      }
    }
  });

  const subjectCounts = user.subjects.length;

  const usera = await prisma.users.update({
    where: {
      id: req.query.id
    },
    data: {
      subjects: {
        push: {
          color: req.query.color,
          id: subjectCounts + 1,
          isFavorite: false,
          name: req.query.name,
          workspaces: []
        }
      }
    }
  });

  res.send(usera);
  disconn();
});



// ====== READ ======
// Get route

// Gets all user from database
app.get('/', async (req, res) => {
  conn();
  const allUsers = await prisma.users.findMany();
  res.send(allUsers);
  disconn();
});

// Gets only password to sign in
app.get('/Signin', async (req, res) => {
  conn();
  const user = await prisma.users.findFirst({
    select: {
      password: true
    },
    where: {
      email: {
        equals: `${req.query.email}`
      }
    }
  });
  res.send({
    status: res.statusCode,
    data: user
  });
  disconn();
});

// Gets the user based on the email
app.post('/validUser', async (req, res) => {
  conn();
  const user = await prisma.users.findFirst({
    where: {
      email: {
        equals: req.body.email
      }
    }
  });

  res.send(user);
  disconn();
});

// ====== UPDATE ======

// ====== DELETE ======

app.listen(port, function () {
  console.log("Started application backend on port %d", port);
});