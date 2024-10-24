"use client";

import { getPostById, updatePost } from "@/app/services/posts.service";
import { Card, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import PlaceholderImg from "@/app/assets/img/website.jpg";
import { Post } from "@/app/models/posts.model";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import EditIcon from "@/app/assets/img/edit.png";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import Loading from "../../loading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { getImageById } from "@/app/utils/files";
import { revalidatePath } from "next/cache";
type Props = {
  params: {
    post_id?: string;
  };
};

export default function EditPost({ params: { post_id } }: Props) {
  // const postData = await getPostById(post_id);
  const [postData, setPostData] = useState<Post | null>(null);
  const [postTitle, setPostTitle] = useState<string>("");
  const [postDescription, setPostDescription] = useState<string>("");
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const router = useRouter();

  const uploadImageRef = useRef<HTMLInputElement>(null);

  const [editorState, setEditorState] = useState<
    PartialBlock[] | undefined | "loading"
  >("loading");

  const editor = useMemo(() => {
    if (editorState === "loading") {
      return undefined;
    }
    return BlockNoteEditor.create({ initialContent: editorState });
  }, [editorState]);

  useEffect(() => {
    if (post_id) {
      getPostById(post_id).then((data) => {
        setPostData(data);

        try {
          setEditorState(JSON.parse(data.content));
        } catch {
          setEditorState("");
        }

        setPostDescription(data.shortDescription);
        setPostTitle(data.title);
      });
    }
  }, [post_id]);

  const handleClickUpload = () => {
    uploadImageRef.current?.click();
  };

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);

    fetch(process.env.NEXT_PUBLIC_API_URL + "/upload/uploadImage", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data: { fileName: string }) => {
        setImageFileName(data.fileName);
      });
  };

  const onSave = () => {
    if (editor && postData?._id) {
      const content = JSON.stringify(editor.document);

      const updatedPostData = {
        title: postTitle,
        content: content,
        image: imageFileName || postData.image,
        shortDescription: postDescription,
      };

      router.refresh();

      updatePost(postData._id, updatedPostData).then((data) => {
        router.push("/posts/" + post_id);
      });
    }
  };

  if (editor === undefined || !postData) {
    return <Loading />;
  }

  return (
    <Card className="h-fit max-w-[1000px] m-6 ">
      <CardHeader className=" p-0 h-[400px] rounded-t-xl overflow-hidden relative">
        <Image
          src={
            imageFileName
              ? getImageById(imageFileName)
              : postData.image
              ? getImageById(postData.image)
              : PlaceholderImg
          }
          width={1920}
          height={1080}
          alt=""
          className="w-full h-full object-cover bg-center"
        />

        <Button
          className="size-[50px] absolute top-[10px] right-[10px] rounded-full bg-white"
          onClick={handleClickUpload}
        >
          <Image src={EditIcon} alt="Edit Icon" width={20} height={20} />
        </Button>
        <input
          type="file"
          hidden
          ref={uploadImageRef}
          onChange={handleChangeImage}
        />
      </CardHeader>

      <section className="p-5">
        <Label className="font-bold">Title</Label>
        <Input
          className="font-bold"
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
        />

        <Label className="font-bold">Description</Label>
        <Input
          className="italic"
          value={postDescription}
          onChange={(e) => setPostDescription(e.target.value)}
        />
        <BlockNoteView
          editor={editor}
          sideMenu={false}
          formattingToolbar
          className="border-2 rounded mt-2"
        />

        <p className="text-[10px] text-gray-500 italic">
          *Select text to format it.
        </p>
        <Button onClick={onSave} className="mt-4 ml-auto">
          Save
        </Button>
      </section>
    </Card>
  );
}
