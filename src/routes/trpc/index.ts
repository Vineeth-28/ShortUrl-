import { router } from "./context";
import { urlRouter } from "./url";


export const TrpcRouter = router({
  url: urlRouter,
});