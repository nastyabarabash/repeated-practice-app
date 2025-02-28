import * as userService from "../../services/userService.js";
import { bcrypt } from "../../deps.js";

const processLogin = async ({ request, response, state }) => {
  const body = request.body({ type: "form" });
  const params = await body.value;

  const userFromDatabase = await userService.findUserByEmail(
    params.get("email"),
  );
  
  if (userFromDatabase.length != 1) {
    response.redirect("/auth/login");
    return;
  }

  const user = userFromDatabase[0];
  const passwordMatches = await bcrypt.compare(
    params.get("password"),
    user.password,
  );

  if (!passwordMatches) {
    response.redirect("/auth/login");
    return;
  }

  await state.session.set("user", user);
  const redirectTo = await state.session.get("redirectTo") || "/topics";
  response.redirect(redirectTo);

};

const showLoginForm = ({ render, request }) => {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirectTo") || "/";
  render("login.eta", { redirectTo });
};

export { processLogin, showLoginForm };