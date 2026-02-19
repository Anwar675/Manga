"use client";

export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";

const Page = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: session, isLoading } = useQuery(
    trpc.auth.session.queryOptions()
  );

  const uploadAvatar = useMutation(
    trpc.auth.uploadAvatar.mutationOptions()
  );

  const updateProfile = useMutation(
    trpc.auth.updateProfile.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.auth.session.queryFilter()
        );
      },
    })
  );

  const [displayName, setDisplayName] = useState("");

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      await queryClient.invalidateQueries(
        trpc.auth.session.queryFilter()
      );
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!session) return <div>Not logged in</div>;

  return (
    <div className="bg-popular">
      <div className="bg-rank flex flex-col gap-4 p-4 mx-auto w-200 items-center ">
        <h1 className="text-2xl font-bold">Profile Details</h1>

        <div className="flex flex-col items-center">
          <Image
            src={
              typeof session.user?.avatar === "string"
                ? session.user.avatar
                : session.user?.avatar?.url ||
                  "/img/background.png"
            }
            width={64}
            height={64}
            className="h-16 w-16 rounded-full"
            alt="Avatar"
          />
        </div>

        <label>
          <Button asChild disabled={uploadAvatar.isPending}>
            <span>
              {uploadAvatar.isPending
                ? "Uploading..."
                : "Upload Avatar"}
            </span>
          </Button>

          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleUpload}
          />
        </label>

        <div className="w-[80%]">
          <p>Email</p>
          <h4 className="p-4 border rounded-xl bg-gray-300">
            {session.user?.email}
          </h4>
        </div>

        <div className="w-[80%]">
          <p>Tên hiển thị</p>
          <Input
            className="w-full"
            value={displayName}
            onChange={(e) =>
              setDisplayName(e.target.value)
            }
            placeholder={
              session.user?.username || "Unknown User"
            }
          />
        </div>

        <Button
          onClick={() =>
            updateProfile.mutate({
              name: displayName,
            })
          }
          disabled={updateProfile.isPending}
        >
          {updateProfile.isPending
            ? "Updating..."
            : "Update"}
        </Button>
      </div>
    </div>
  );
};

export default Page;
