import { send } from "../../deps.js";

const serveStaticMiddleware = async (context, next) => {
  const css = context.request.url.pathname.startsWith("/css");
  const js = context.request.url.pathname.startsWith("/js");
  const image = context.request.url.pathname.startsWith("/images");

  if (css || js || image) {
    await send(context, context.request.url.pathname, {
      root: `${Deno.cwd()}/assets`,
    });
  } else {
    await next();
  }
};

export { serveStaticMiddleware };