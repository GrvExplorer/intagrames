import { Models } from "appwrite";
import React from "react";
import PostCard from "./PostCard/PostCard";

type PostCardProps = {
  posts: Models.DocumentList<Models.Document>;
};

function PostCards({ posts }: PostCardProps) {
  return (
    <div className="flex flex-col gap-10">
      {posts?.documents.map((post: Models.Document) => (
        <div key={post.creator.name + post.$id}>
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
}

export default PostCards;
