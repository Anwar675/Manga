export const revalidate = 60;


import HomeClient from "./home-client";
import {  createCaller } from "@/trpc/server";



const Page = async () => {
  const caller = await createCaller();

  const [category, comments, mangas] = await Promise.all([
    caller.category.getSubMany(),
    caller.comments.getMany(),
    caller.magas.getMany(),
  ]);

  return (
    <HomeClient
      category={category}
      comments={comments}
      mangas={mangas}
    />
  );
};
export default Page