const customersModel = require("../models/customers.model");

exports.getAll = async (filter) => {
  try {
    const ListCustomer = await customersModel.find(filter);
    return ListCustomer;
  } catch (err) {
    console.log(err);
  }
};

exports.getById = async (id) => {
  try {
    const Customer = await customersModel.findById(id);
    return Customer;
  } catch (err) {
    console.log(err);
  }
};

exports.getByEmail = async (Email) => {
  try {
    const customer = await customersModel.find({ email: Email });
    if (customer.length > 0) {
      return customer;
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
    const phone = values.phone;
    const password = values.password;
    const email = values.email;

    const passwordHashed = bcrypt.hashSync(password, salt);
    let newCustomer = new customersModel({
      fullName,
      email,
      phone,
      password: passwordHashed,
    });
    return newCustomer
      .save()
      .then(() => {
        console.log("Add Customer success!");
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

exports.Login = async (values) => {
  try {
    const { email, password } = values;
    const user = await customersModel.findOne({ email: email });
    if (!user) {
      return { success: false, error: "Email not found" };
    } else {
      const bcrypt = require("bcrypt");
      const password_db = user.password;
      const passwordCompared = bcrypt.compareSync(password, password_db);
      if (!passwordCompared) {
        return { success: false, error: "Password error" };
      } else if (user.isActive == false) {
        return { success: false, error: "Account is not active" };
      } else {
        return user;
      }
    }
  } catch (err) {
    console.log(err);
  }
};

exports.update = async (id, values) => {
  return await customersModel
    .updateOne({ _id: id }, values)
    .then(() => true)
    .catch((error) => false);
};

module.exports.changePassword = async (id, values) => {
  const bcrypt = require("bcrypt");
  var salt = bcrypt.genSaltSync(10);

  const user = await customersModel.findOne({ _id: id });
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

  return await customersModel
    .updateOne({ _id: id }, { password: newPassword })
    .then(() => true)
    .catch((error) => false);
};
