const e = require("express");
const express = require("express");
const db = require("./database");

const server = express();
const port = 9000;

server.use(express.json());

server.post("/api/users", (req, res) => {
  const { name, bio } = req.body;
  if (!name || !bio) {
    res.status(400).json({
      errorMessage: "Please provide name and bio for the user.",
    });
  } else if (name && bio) {
    const newUser = {
      name: name,
      bio: bio,
    };
    res.status(201).json(newUser);
    db.createUser(newUser);
  } else {
    res.status(500).json({
      errorMessage: "There was an error while saving the user to the database.",
    });
  }
});
server.get("/api/users", (req, res) => {
  const users = db.getUsers();
  if (users) {
    res.status(200).json(users);
  } else {
    res.status(500).json({
      errorMessage: "Could not retrieve the users information.",
    });
  }
});
server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const user = db.getUserById(id);
  if (!user) {
    res.status(404).json({
      errorMessage: "The user with the specified ID does not exist.",
    });
  } else if (user) {
    res.status(200).json(user);
  } else {
    res.status(500).json({
      errorMessage: "The user information could not be retrieved.",
    });
  }
});
server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const user = db.getUserById(id);
  if (!user) {
    res.status(404).json({
      errorMessage: "The user with the specified ID does not exist.",
    });
  } else if (user) {
    db.deleteUser(id);
    res.status(200).json(user);
  } else {
    res.status(500).json({
      errorMessage: "The user could not be removed.",
    });
  }
});
server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const user = db.getUserById(id);
  const { name, bio } = req.body;
  const updates = {
    name: name,
    bio: bio,
  };
  if (!user) {
    res.status(404).json({
      errorMessage: "The user with the specified ID does not exist.",
    });
  } else if (user && (!name || !bio)) {
    res.status(400).json({
      errorMessage: "Please provide a name and/or bio for the user.",
    });
  } else if (user && name && bio) {
    db.updateUser(id, updates);
    res.status(200).json(updates);
  } else {
    res.status(500).json({
      errorMessage: "The user information could not be modified.",
    });
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
