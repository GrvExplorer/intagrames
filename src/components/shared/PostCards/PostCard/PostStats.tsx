import { useUserContext } from "@/context/AuthContext";
import { setDeletePostSaves } from "@/lib/appwrite/api";
import {
  useGetCurrentUser,
  useSetDeletePostSaves,
  useSetPostLikes,
  useSetPostSaves,
} from "@/lib/react-query/queriesAndMutations";
import { checkLiked } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Models } from "appwrite";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";

type PostStatsProp = {
  post: Models.Document | undefined;
  userId: string;
};

function PostStats({ post, userId }: PostStatsProp) {

  const { user } = useUserContext()

  const likesList = post?.likes.map((user: Models.Document) => user.$id);
  const saveList = post?.save.map(({user}: Models.Document) => user.$id);
  const saveArray = [...saveList]

  const cache = useQueryClient()

  const [likes, setLikes] = useState<string[]>(likesList);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (saveArray.includes(userId)) {
      setIsSaved(true)
    }
  }, [saveArray, userId])

  const { mutateAsync: setPostLike } = useSetPostLikes();


  const { mutateAsync: setPostSave } = useSetPostSaves();
  const { mutateAsync: setDeletePostSave } = useSetDeletePostSaves()


  function handlePostLike(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
    e.stopPropagation();
    let likesArray = [...likes];
    if (likesArray.includes(userId)) {
      likesArray = likesArray.filter((Id) => Id !== userId);
    } else {
      likesArray.push(userId);
    }
    setLikes(likesArray);
    setPostLike({ postId: post?.$id, likesArray });
  }

  

  async function  handlePostSave(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
    e.stopPropagation();

    if (saveArray.includes(userId)) {
      setDeletePostSave(post.$id)
      setIsSaved(false)
      return
    }
    setIsSaved(true);
    setPostSave({ post: post.$id, user: userId })
    cache.invalidateQueries({
      queryKey: ['getUserSavePosts', user.id]
    })
  }

  return (
    <div className={`z-20 flex w-full items-center justify-between`}>
      <div className="mr-5 flex gap-2">
        <img
          src={`${
            checkLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }`}
          alt="like"
          width={20}
          height={20}
          onClick={(e) => handlePostLike(e)}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">
          {likes.length}
        </p>
      </div>

      <div className="flex gap-2">
        <img
          src={
            isSaved
             ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"
          }
          alt="share"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={(e) => handlePostSave(e)}
        />
      </div>
    </div>
  );
}

export default PostStats;
