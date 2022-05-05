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


// Get route
app.get('/', async (req, res) => {
  conn();

  console.log(req.body);

  if (Object.entries(req.body).length === 0) {
    const allUsers = await prisma.users.findMany();
    res.send(allUsers);
    console.log('null');
  } else {
    const user = await prisma.users.findFirst({
      select: {
        subjects: true
      },
      where: {
        email: {
          equals: `${req.body.email}`
        }
      }
    });
    res.send(user);
    console.log('Not null');
  }
  disconn();
});

app.listen(port, function () {
  console.log("Started application backend on port %d", port);
});