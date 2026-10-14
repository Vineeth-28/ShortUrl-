import { urlController } from '../../controllers/url.controller';
import { router } from './context';


export const urlRouter: ReturnType<typeof router> = router(urlController);
