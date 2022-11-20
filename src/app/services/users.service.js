const usersModel = require("../models/users.model");

exports.getAll = async (filter) => {
  try {
    const ListAdmin = await usersModel.find(filter);
    return ListAdmin;
  } catch (err) {
    console.log(err);
  }
};

exports.getByUserName = async (Username) => {
  try {
    const user = await usersModel.findOne({ userName: Username });
    if (user) {
      return user;
    }
    return false;
  } catch (err) {
    return false;
    // console.log(err);
    console.log(err);
  }
};

// get by email
exports.getByEmail = async (email) => {
  try {
    const user = await usersModel.find({ email: email });
    if (user.length > 0) {
      return user;
    }
    return false;
  } catch (err) {
    console.log(err);
  }
};

exports.createNew = async (values) => {
  try {
    const bcrypt = require("bcrypt");
    var salt = bcrypt.genSaltSync(10);
    const fullName = values.fullName;
    const userName = values.userName;
    const password = values.password;
    const email = values.email;
    const roleId = values.roleId;

    const passwordHashed = bcrypt.hashSync(password, salt);
    let newAdmin = new usersModel({
      fullName,
      email,
      userName,
      password: passwordHashed,
      roleId,
    });
    return newAdmin
      .save()
      .then(() => {
        console.log("Add User success!");
        return true;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports.changePassword = async (id, values) => {
  const bcrypt = require("bcrypt");
  var salt = bcrypt.genSaltSync(10);

  const user = await usersModel.findOne({ _id: id });
  const password_db = user.password;
  const password = values.password;
  const newPass = values.newPassword;
  const passwordCompared = bcrypt.compareSync(password, password_db);

  if (!passwordCompared) {
    console.log("wrong password");
    return false;
  }

  const passwordHashed = bcrypt.hashSync(newPass, salt);
  const newPassword = passwordHashed;

  return await usersModel
    .updateOne({ _id: id }, { password: newPassword })
    .then(() => true)
    .catch((error) => false);
};

module.exports.NewPass = async (id, password) => {
  console.log(id);
  const bcrypt = require("bcrypt");
  var salt = bcrypt.genSaltSync(10);
  const passwordHashed = bcrypt.hashSync(password, salt);
  const newPassword = passwordHashed;
  console.log(newPassword);

  return await usersModel
    .updateOne({ _id: id }, { password: newPassword })
    .then(() => true)
    .catch((error) => false);
};
