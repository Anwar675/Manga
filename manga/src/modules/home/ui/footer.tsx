import Image from "next/image";

export const Footer = () => {
  return (
    <div>
      <div className="md:px-10 mt-10 relative md:text-center text-balance md:py-8 px-4 py-6 bg-rank">
        <p className="md:px-10  md:py-6 text-[#7b8084] bg-[#ecf2fa] px-4 py-3 rounded-xl">
          Tất cả truyện tranh và hình ảnh trên website đều do người dùng đăng
          tải, chia sẻ. Chúng tôi không sở hữu bản quyền và không chịu trách
          nhiệm về nội dung do thành viên cung cấp. Nếu phát hiện nội dung vi
          phạm bản quyền hoặc ảnh hưởng đến cá nhân, tổ chức, vui lòng liên hệ
          để chúng tôi kịp thời xem xét và gỡ bỏ. xem thêm điều khoản <span className="text-text-popular cursor-pointer">tại đây</span> 
        </p>
        <div className="absolute w-40 md:bottom-5 bottom-0 h-12">
            <Image src="/img/decor.png" fill alt="decor" />
        </div>
        <div className="absolute w-40 md:bottom-5 right-0 bottom-0 h-12">
            <Image  src="/img/decor.png" fill alt="decor" />
        </div>
        
      </div>
      <div className="flex text-sm items-center text-center px-4 justify-center">
        <div className="relative md:block hidden  h-10 w-10">
            <Image src="/img/logo.png" fill alt="logo" />
        </div>
        <p className="text-[#7b8084] py-2">© 2026 Alga - Algas. Ưu tiên trải nghiệm độc giả — Thế giới truyện tranh hoàn toàn miễn phí. Liên hệ: <span className="text-text-popular">anwaralmed24@gmail.com</span> </p>
      </div>
    </div>
  );
};
