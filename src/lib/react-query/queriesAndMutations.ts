import { INewPost, INewUser, IUpdatePost } from "@/types";
import {
  // useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createPost,
  createUserAccount,
  deletePost,
  getAllUsers,
  getPopularPosts,
  getPostById,
  getRecentPosts,
  getUserSaves,
  setDeletePostSaves,
  setPostLikes,
  setPostSaves,
  signInAccount,
  signOutAccount,
  updatePost,
} from "../appwrite/api";
import { QUERY_KEYS } from "./queryKeys";

// User
export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};
export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: () => signOutAccount(),
  });
};

export const useGetUserSaves = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_SAVE_POSTS, userId],
    queryFn: () => getUserSaves(userId),
  });
};

export const useGetUserPosts = () => {
  return;
};

export const useGetUserDetails = () => {
  return;
};

export const useSetUserDetails = () => {
  return;
};

export const useGetUserLikes = () => {
  return;
};

export const useGetCurrentUser = () => {
  return;
};

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: getAllUsers,
  });
};

// Posts
export const useCreatePost = () => {
  return useMutation({
    mutationFn: (details: INewPost) => createPost(details),
  });
};

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  });
};

export const useGetPopularPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POPULAR_POSTS],
    queryFn: getPopularPosts,
  });
};
export const useSetPostLikes = () => {
  return useMutation({
    mutationFn: ({
      postId,
      likesArray,
    }: {
      postId: string | undefined;
      likesArray: string[];
    }) => setPostLikes(postId, likesArray),
  });
};
export const useSetPostSaves = () => {
  return useMutation({
    mutationFn: ({ post, user }: { post: string | undefined; user: string }) =>
      setPostSaves(post, user),
  });
};
export const useSetDeletePostSaves = () => {
  return useMutation({
    mutationFn: (postId: string) => setDeletePostSaves(postId),
  });
};

export const useUpdatePost = () => {
  const cache = useQueryClient();
  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
    onSuccess: (data) => {
      cache.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
    },
  });
};

export function useGetPostById(postId: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
}

export const useDeletePost = () => {
  return useMutation({
    // @ts-expect-error Object literal may only specify known properties, and mutationFn does not exist in type
    mutationFn: (postId: string | undefined, postImageId: string) =>
      deletePost(postId, postImageId),
  });
};
