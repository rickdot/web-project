import { bcrypt } from "../../deps.js";
import * as userService from "../../services/userService.js";
import {
  isEmail,
  minLength,
  required,
  validate,
} from "../../deps.js";

const validationRules = {
  email: [required, isEmail],
  password: [required, minLength(4), ],
};

const getData = async (request) => {
  const data = {
    email: "",
    password: "",
    errors: null,
  };

  if (request) {
    const body = request.body();
    const params = await body.value;
    data.email = params.get("email");
    data.password = params.get("password");
  }

  return data;
};

const registerUser = async ({ request, response, render }) => {
  const body = request.body({ type: "form" });
  const params = await body.value;

  const data = await getData(request);
  const [passes, errors] = await validate(data, validationRules);
  // check if email already exists
  const res = await userService.findUserByEmail(data.email);
  if (res.length !== 0) {
    data.errors = { email: { ifExist : "Email already exists!"} };
    render("registration.eta", data);
  } else if (!passes) {
    // if email or password are wrong
    data.errors = errors;
    render("registration.eta", data);
  } else {
    // save to database
    await userService.addUser(
    params.get("email"),
    await bcrypt.hash(params.get("password")),
    );
    response.redirect("/auth/login");
  }

};

const showRegistrationForm = ({ render }) => {
  const data = {
    email: "",
    password: "",
    errors: null,
  };
  render("registration.eta", data);
};

export { registerUser, showRegistrationForm };