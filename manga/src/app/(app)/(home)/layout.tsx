import { getPayload } from "payload";
import configPromise from "@payload-config";

import { Category } from "@/payload-types";
import { Navbar } from "@/modules/navabr/navbar";
import { BackgroundSlider } from "@/modules/home/background-slide";



interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const payload = await getPayload({
    config: configPromise,
  });
  const data = await payload.find({
    collection: "categories",
    depth: 1,
    pagination: false,
    where: {
      parent: {
        exists: false,
      },
    },
    sort: "order",
  });

  const dataSlide = await payload.find({
    collection: "banners",
    pagination: false,
    where: {
        active: {
        equals: true,
        },
    },
  sort: "order",

  })

  const slides = dataSlide.docs.map((banner) => (
    {
        id: banner.id,
        title: banner.title,
        link: banner.link,
        image: banner.image
    }
  ))
  console.log(slides)

  const formatData = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
      ...(doc as Category),
    })),
  }));
  return (
    <div className="relative">
      <Navbar data={formatData} />
      <BackgroundSlider slides={slides} />
      {children}
    </div>
  );
};
export default Layout;
