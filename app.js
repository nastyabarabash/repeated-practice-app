import { Application, Session } from "../app/deps.js";
import { authMiddleware } from "./app/middlewares/authMiddleware.js";
import { errorMiddleware } from "./app/middlewares/errorMiddleware.js";
import { renderMiddleware } from "./app/middlewares/renderMiddleware.js";
import { serveStaticMiddleware } from "./app/middlewares/serveStaticMiddleware.js"

import { router } from "./app/routes/routes.js";

const app = new Application();
app.use(Session.initMiddleware());

app.use(errorMiddleware);
app.use(authMiddleware);
app.use(renderMiddleware);
app.use(serveStaticMiddleware);
app.use(router.routes());

app.listen({ port: 7777 });
//export { app };