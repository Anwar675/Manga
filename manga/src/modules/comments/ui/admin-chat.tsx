import Image from "next/image"

export const AdminChat = () => {
    return (
        <div className="mx-40 my-10 relative rounded-md h-75 bg-rank">
            <div className="p-4 items-center justify-center bg-kind gap-4 translate-y-4 relative flex rounded-md mx-4 font-bold">
                <Image src="/img/speaker.png" alt="name" width={50} height={50} />
                <h1 className="text-3xl">
                    THÔNG BÁO TỪ BAN QUẢN TRỊ  
                </h1>
            </div>

            <div>
                
            </div>
        </div>
    )
}       