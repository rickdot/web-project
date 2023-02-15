import * as userService from "../../services/userService.js";
import { bcrypt } from "../../deps.js";

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

const processLogin = async ({ request, response, state, render }) => {
  const body = request.body({ type: "form" });
  const params = await body.value;

  const data = await getData(request);

  const userFromDatabase = await userService.findUserByEmail(
    params.get("email"),
  );
  // email doesn't exist
  if (userFromDatabase.length != 1) {
    data.errors = { email: { ifExist : "Email doesn't exist!"} };
    render("login.eta", data);
    return;
  }
  // compare password
  const user = userFromDatabase[0];
  const passwordMatches = await bcrypt.compare(
    params.get("password"),
    user.password,
  );
  // wrong password
  if (!passwordMatches) {
    data.errors = { password: { isCorrect : "Password is not correct!"} }
    render("login.eta", data);
    return;
  }
  // login succeed, add user to session
  await state.session.set("user", user);

  response.redirect("/questions");
};

const showLoginForm = ({ render }) => {
  render("login.eta");
};


const logout = async ({response, state}) => {
  const temp = (await state.session.context.state.sessionCache);
  delete temp.user;
  state.session.context.state.sessionCache = temp;

  response.redirect("/")
}


export { processLogin, 
  showLoginForm,
  logout,
 };