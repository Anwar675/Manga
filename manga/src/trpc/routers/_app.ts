import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { categoryRouter } from '@/modules/category/server/procedure';
import { bannerRouter } from '@/modules/brand/server/procedure';
import { authRouter } from '@/modules/auth/server/procedures';


export const appRouter = createTRPCRouter({
    category: categoryRouter,
    brand: bannerRouter,
    auth: authRouter

});
// export type definition of API
export type AppRouter = typeof appRouter;