import { Application, Session } from "./deps.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import renderMiddleware from "./middlewares/renderMiddleware.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import { serveStaticMiddleware } from "./middlewares/serveStaticMiddleware.js";  //wrong

import { router } from "./routes/routes.js";

const app = new Application();
const session = new Session();
app.use(session.initMiddleware());

app.use(errorMiddleware);
app.use(authMiddleware);
app.use(serveStaticMiddleware);
app.use(renderMiddleware);
app.use(router.routes());


export {app}
// app.listen({ port: 7777 });