import { create, decode, Payload } from "https://deno.land/x/djwt@v2.4/mod.ts";
import { OpineRequest, OpineResponse,  } from "https://deno.land/x/opine@2.1.2/mod.ts";


function getToken(req: OpineRequest, _res: OpineResponse) : string | null {
    const authorization = req.headers.get("authorization");
    if (authorization && authorization.startsWith("Bearer ")) {
        return authorization.substring(7, authorization.length);
    }
    return null;
}

async function crypto() : Promise<CryptoKey> {
    const key = await window.crypto.subtle.generateKey(
        {name: "HMAC", hash: "SHA-512" }, true, ["sign", "verify"]);

    return key;

}

const jwt = {
    decode(token: string) : Payload {
        const [_headers, payload, _signature] = decode(token);
        return payload as Payload;
    },

    async create(options?: Record<string, unknown>) {
        const key = await crypto();
        return await create({alg: "HS512", typ: "JWT",}, {...options}, key);
    },

    check(req: OpineRequest, res: OpineResponse, next: () => void) {
        const token = getToken(req, res);
        if (!token) {
            res.setStatus(401).send({
                message: "No token provided",
            });
            return;
        }
        req.app.locals.user = {};
        try {
            const payload = jwt.decode(token);
            req.app.locals.user = payload;
        } catch (_) {
            return res.sendStatus(401).send({
                message: "Token not valid",
            });
        }
        next();
    }
}

export default jwt;