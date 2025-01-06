import { bcrypt } from "../../../deps.js";
import * as userService from "../../services/userService.js";
import { validasaur } from "../../../deps.js";

const userValidationRules = {
  email: [validasaur.required, validasaur.isEmail],
  password: [validasaur.required, validasaur.minLength(4)],
};

const getUserData = async (request) => {
  const body = request.body({ type: "form" });
  const params = await body.value;

  return {
    email: params.get("email"),
    password: params.get("password"),
  };
};

const registerUser = async ({ request, response, render, state }) => {
  const userData = await getUserData(request);

  const adminEmails = ["admin@admin.com"];

  const isAdmin = adminEmails.includes(userData.email.toLowerCase());

  const [passes, errors] = await validasaur.validate(
    userData,
    userValidationRules,
  );

  if (!passes) {
    userData.validationErrors = errors;
    render("registration.eta", userData);
    return;
  }

  await userService.addUser(
    userData.email,
    await bcrypt.hash(userData.password),
    isAdmin,
  );

  response.redirect("/auth/login");
};

const showRegistrationForm = ({ render }) => {
  render("registration.eta");
};

export { registerUser, showRegistrationForm };