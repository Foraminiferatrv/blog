export default function PostsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="mx-auto  h-full max-w-[1000px]">{children}</div>;
}
