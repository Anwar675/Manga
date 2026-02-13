import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Page = () => {
  return (
    <div className="bg-popular">
      <div className="bg-rank flex flex-col gap-4 p-4 mx-auto w-200 items-center ">
        <h1 className="text-2xl font-bold">Profile Details</h1>
        <div className="flex flex-col items-center">
          <img
            src="/img/rank.png"
            className="h-16 w-16 rounded-full"
            alt="Settings Icon"
          />
          <p>Max size: 12GB</p>
        </div>
        <div className="text-center">
          <h4>Upload your new avatar</h4>
          <Button>Upload</Button>
        </div>
        <div className="w-[80%]">
          <p>Tên đăng nhập</p>
          <h4 className="p-4 border border-gray-600 rounded-xl bg-gray-300">Almed Anwar</h4>
        </div>
        <div className="w-[80%]">
          <p>Địa chỉ Email</p>
          <h4 className="p-4 border border-gray-600 rounded-xl bg-gray-300">example@example.com</h4>
        </div>
        <div className="w-[80%]">
          <p>Tên hiển thị</p>
          <Input className="w-full" />
        </div>
      </div>
    </div>
  );
};
export default Page;
