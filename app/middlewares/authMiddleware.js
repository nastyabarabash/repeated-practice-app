const restrictedPaths = ["/topics", "/quiz"];
const adminRestrictedPaths = [
  "/topics/:id/delete",
];

const authMiddleware = async (context, next) => {
  const user = await context.state.session.get("user");

  const currentPath = context.request.url.pathname;

  if (!user) {
    if (restrictedPaths.some((path) => context.request.url.pathname.startsWith(path))) {
      const redirectTo = context.request.url.pathname;
      await context.state.session.set("redirectTo", redirectTo);
      context.response.redirect("/auth/login");
      return;
    }
  } else {
    context.user = user;

    if (!user.admin && adminRestrictedPaths.some((path) => currentPath.startsWith(path))) {
      context.response.status = 403;
      context.response.body = "Access denied. Admin privileges required.";
      return;
    }
  }
  
  await next();
};

export { authMiddleware };