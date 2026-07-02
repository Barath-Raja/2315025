import express from "express";
import {getSchedule} from "../controllers/schedulerController.js";

const router=express.Router();

router.get("/schedule", getSchedule);

export default router;