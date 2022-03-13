import User from "../models/user.models.ts";
import { OpineRequest, OpineResponse } from "https://deno.land/x/opine@2.1.2/mod.ts";
import jwt from "../middleware/jwt.middleware.ts";

const userController = {
    getAll(_req: OpineRequest, res: OpineResponse) : void {
        User.select().all().then((users) => {
            res.send(users);
        }).catch((err) => {
            res.send(err);
        });
    },

    insert(req: OpineRequest, res: OpineResponse) : void {
        const user = new User();

        user.name = req.parsedBody.name;
        user.email = req.parsedBody.email;
        user.password = req.parsedBody.password;

        user.save().then((user) => {
            res.send(user);
        }).catch((err) => {
            res.setStatus(500).send({
                message: `Cannot insert user: ${err.message}`,
            });
        });
    },

    login(req: OpineRequest, res: OpineResponse) : void {
        const email = req.parsedBody.email;
        const password = req.parsedBody.password;


        User.where({email: email, password: password}).get().then((u) => {
            if (u.length === 0){
                res.setStatus(401).send({
                    message: "Username or password is incorrect",
                });
                return;
            }
            const users = u as User[];

            const user = users[0];

            jwt.create({id: user.id}).then((token) => {
                res.send({
                    token: token,
                });
            }).catch((err) => {
                res.setStatus(500).send({
                    message: `Cannot create token: ${err.message}`,
                });
            });
        });
    },

    update(req: OpineRequest, res: OpineResponse) : void {
        const user = new User();

        user.id = req.params.id;
        user.name = req.parsedBody.name;
        user.email = req.parsedBody.email;

        user.update().then((user) => {
            res.send(user);
        }
        ).catch((err) => {
            res.setStatus(500).send({
                message: `Cannot update user: ${err.message}`,
            });
        });
    },

    select(req: OpineRequest, res: OpineResponse) : void {

        const id = req.params.id;

        User.find(id).then((user) => {
            if (!user){
                res.setStatus(404).send({
                    message: `User not found`,
                });
            }
            res.send(user);
        }).catch((err) => {
            res.setStatus(500).send({
                message: `Cannot select user: ${err.message}`,
            });
        });
    },

    delete(req: OpineRequest, res: OpineResponse) : void {
        const id = req.params.id;

        User.where('id', id).delete().then((user) => {
            if (!user){
                res.setStatus(404).send({
                    message: `User not found`,
                });
            }
            res.send({
                success: true,
            });
        }).catch((err) => {
            res.setStatus(500).send({
                message: `Cannot delete user: ${err.message}`,
            });
        });
    }
}

export default userController;