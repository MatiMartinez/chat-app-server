const users = [];

function joinUser({ id, name }) {
  name = name.trim().toLowerCase();

  const existingUser = users.find((user) => user.name === name);

  if (existingUser) {
    return { error: "User already exists" };
  }

  const user = { id, name };
  users.push(user);
  return { user };
}

function disconnectUser(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function getUser(id) {
  return users.find((user) => user.id === id);
}

function getUsers() {
  return users;
}

module.exports = { joinUser, disconnectUser, getUser, getUsers };
