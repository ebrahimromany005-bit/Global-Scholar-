import { Router, type IRouter } from "express";
import healthRouter from "./health";
import opportunitiesRouter from "./opportunities";
import countriesRouter from "./countries";
import statsRouter from "./stats";
import applicationsRouter from "./applications";
import adsRouter from "./ads";
import openaiRouter from "./openai";
import planRouter from "./plan";

const router: IRouter = Router();

router.use(healthRouter);
router.use(opportunitiesRouter);
router.use(countriesRouter);
router.use(statsRouter);
router.use(applicationsRouter);
router.use(adsRouter);
router.use(openaiRouter);
router.use(planRouter);

export default router;
