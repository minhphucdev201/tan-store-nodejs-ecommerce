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
