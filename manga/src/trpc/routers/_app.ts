import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { categoryRouter } from '@/modules/category/server/procedure';
import { bannerRouter } from '@/modules/brand/server/procedure';


export const appRouter = createTRPCRouter({
    category: categoryRouter,
    brand: bannerRouter

});
// export type definition of API
export type AppRouter = typeof appRouter;