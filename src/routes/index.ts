import { Router } from "express";
import { apiProductRouter } from "./product.routes";
import { apiCategoryRouter } from "./category.routes";
import { brandRouter } from "./brand.routes";
import { apiOrderRouter } from "./order.routes";
import { authRouter } from "./auth.routes";

const router = Router();

router.use("/category", apiCategoryRouter);

router.use("/product", apiProductRouter);

router.use("/order", apiOrderRouter);

router.use("/brand", brandRouter);

router.use("/admin", authRouter);

export { router as rootRouter };
