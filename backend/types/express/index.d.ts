import { AuthPayload } from "../../middlewares/authMiddleware";
import { Multer } from "multer";

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}

export { };