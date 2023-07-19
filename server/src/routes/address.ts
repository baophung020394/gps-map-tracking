import { Router } from "express";
import * as addressesController from "../controllers/addressesController";

const router = Router();

router.post("/", addressesController.createAddress);
router.get("/", addressesController.getAllAddresses);
router.get("/:addressId", addressesController.getAddressById);

export default router;
