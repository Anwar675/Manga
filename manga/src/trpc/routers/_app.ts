
import {  createTRPCRouter } from '../init';
import { categoryRouter } from '@/modules/category/server/procedure';
import { bannerRouter } from '@/modules/brand/server/procedure';
import { authRouter } from '@/modules/auth/server/procedures';
import { mangasRouter } from '@/modules/manga/server/procedure';


export const appRouter = createTRPCRouter({
    category: categoryRouter,
    brand: bannerRouter,
    auth: authRouter,
    magas: mangasRouter

});
// export type definition of API
export type AppRouter = typeof appRouter;