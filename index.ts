import { opine, json } from "https://deno.land/x/opine@2.1.2/mod.ts";
import user from "./routes/user.routes.ts";
import db from "./config/db.config.ts";

const app = opine();

db.sync({ drop: true });
app.use(json());
user(app);

app.listen(
  3000,
  () => console.log("server has started on http://localhost:3000 🚀"),
);