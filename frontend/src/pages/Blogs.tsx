import { useBlogs } from "../hooks";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Appbar, BlogCard, BlogSkeleton } from "@/components";

export const Blogs = () => {
  const { loading, blogs } = useBlogs();
  const navigate = useNavigate();

  const [buffer, setBuffer] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signup");
    } else {
      setBuffer(false);
    }
  }, []);
  if (buffer) {
    return <div></div>;
  }

  return (
    <div className="min-h-screen h-full w-full flex  md:justify-center bg-black/[0.90] antialiased bg-grid-white/[0.04] relative overflow-hidden">
      {/* <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="white"
            /> */}
      <div className="z-20 w-full">
        <Appbar />
        {loading ? (
          <div className="flex justify-center flex-col items-center mt-32">
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
          </div>
        ) : blogs.length > 0 ? (
          <div className="flex justify-center items-center flex-col mt-32">
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                id={blog.id}
                authorName={blog.author.name || "Anonymous"}
                title={blog.title}
                content={blog.content}
                publishedDate={blog.Date}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center mt-32">
            <p className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
              No Blogs
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
