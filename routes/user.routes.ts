import { Opine } from "https://deno.land/x/opine@2.1.2/mod.ts";
import userController from "../controllers/user.controller.ts";
import jwt from "../middleware/jwt.middleware.ts"


const user = (router: Opine) => {
    router.get("/user", jwt.check, userController.getAll);
    router.post("/login", userController.login);
    router.post("/user", userController.insert);
    router.put("/user/:id", userController.update);
    router.get("/user/:id", userController.select);
    router.delete("/user/:id" ,userController.delete);
};
export default user;