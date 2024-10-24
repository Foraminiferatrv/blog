"use client";

import { getPostById } from "@/app/services/posts.service";
import { Card, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import PlaceholderImg from "@/app/assets/img/website.jpg";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getImageById } from "@/app/utils/files";

import { BlockNoteView } from "@blocknote/shadcn";
import { Suspense, useEffect, useMemo, useState } from "react";
import type { Post } from "@/app/models/posts.model";
import Loading from "../loading";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { Separator } from "@/components/ui/separator";

type Props = {
  params: {
    post_id?: string;
  };
};

export default function Post({ params: { post_id } }: Props) {
  const [postData, setPostData] = useState<Post | null>(null);

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
      });
    }
  }, []);

  if (editor === undefined || !postData) {
    return <Loading />;
  }

  return (
    <section className="mt-3">
      <Link href="/" className="m-4">
        <Button> {"<- Back"}</Button>
      </Link>
      <Card className="h-fit max-w-[1000px] m-6 pb-2 relative">
        <Suspense fallback={<Loading />}>
          <CardHeader className=" p-0 h-[400px] rounded-t-xl overflow-hidden">
            <Image
              src={
                postData?.image ? getImageById(postData.image) : PlaceholderImg
              }
              width={1920}
              height={1080}
              alt=""
              className="w-full h-full object-cover bg-center"
            />
          </CardHeader>

          <article className="p-5 ">
            <h1 className="text-4xl font-bold text-center">
              {postData?.title}
            </h1>
            <Separator className="my-4" />

            <p className="italic text-gray-500 text-center">
              {postData?.shortDescription}
            </p>

            <Separator className="my-4" />

            <BlockNoteView editor={editor} editable={false} />
          </article>

          <Link href={"/posts/" + post_id + "/edit"} className="m-4">
            <Button>Edit Post</Button>
          </Link>
        </Suspense>
      </Card>
    </section>
  );
}
