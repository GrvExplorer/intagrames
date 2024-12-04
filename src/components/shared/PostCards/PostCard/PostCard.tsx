import { useUserContext } from "@/context/AuthContext";
import { multiFormatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";
import { useQueryClient } from "@tanstack/react-query";

type PostCardProps = {
  post: Models.Document | undefined;
};

function PostCard({ post }: PostCardProps) {
  const { user } = useUserContext();
  const cache = useQueryClient()

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to="">
            <img
              src={
                post.creator?.imageUrl ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="w-12 rounded-full lg:h-12"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator.name}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular ">
                {multiFormatDateString(post.$createdAt)}
              </p>
              •
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>

        <Link
          to={`/update-post/${post.$id}`}
          className={`${user.id !== post.creator.$id && "hidden"}`}
          onClick={() => {cache.invalidateQueries({
            queryKey: ['getPostById', post.$id]
          })}}
        >
          <img
            src={"/assets/icons/edit.svg"}
            alt="edit"
            width={20}
            height={20}
          />
        </Link>
      </div>

      <Link to={`/post-details/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p className="">{post.caption}</p>
          <ul className="my-2 flex gap-1">
            {post?.tags?.map((tag: string, i: string) => (
              <li key={`${tag}${i}`} className="small-regular text-light-3">
                #{tag}
              </li>
            ))}
          </ul>

          <img
            src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="post image"
            className="post-card_img"
          />
        </div>
      </Link>

      <PostStats post={post} userId={user.id} />
    </div>
  );
}

export default PostCard;
