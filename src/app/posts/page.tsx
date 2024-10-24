import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllPosts } from "../services/posts.service";
import Image from "next/image";
import PlaceholderImg from "@/app/assets/img/website.jpg";

import testImg from "@/app/assets/img/test.jpg";
import Link from "next/link";
import { Suspense } from "react";
import Loading from "./loading";
import { getImageById } from "../utils/files";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default async function Posts() {
  const postsData = await getAllPosts();

  const renderPosts = () => {
    if (postsData.length === 0)
      return <div className="text-center">No posts yet...</div>;

    return postsData.map((post) => {
      return (
        <Card
          key={post._id}
          className="hover:scale-105 transition-all overflow-hidden cursor-pointer"
        >
          <Link href={"posts/" + post._id} key={post._id}>
            <CardHeader className="h-full p-0 max-h-[70%]">
              <Image
                src={post.image ? getImageById(post.image) : PlaceholderImg}
                width={1920}
                height={1080}
                alt=""
                className="w-full h-full object-cover"
              />
            </CardHeader>
            <div className="p-2">
              <CardTitle className="overflow-ellipsis whitespace-nowrap overflow-hidden">
                {post.title || "no title"}
              </CardTitle>
              <CardDescription className="overflow-ellipsis whitespace-nowrap overflow-hidden">
                {post.shortDescription}
              </CardDescription>
            </div>
          </Link>
        </Card>
      );
    });
  };

  if (postsData)
    return (
      <section className="pb-4">
        <div className="h-full grid grid-cols-[repeat(auto-fit,_minmax(250px,1fr))] gap-4 auto-rows-[200px] p-4">
          <Suspense fallback={<Loading />}>{renderPosts()}</Suspense>
        </div>
        {/* <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>

            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>

            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination> */}
      </section>
    );
}
