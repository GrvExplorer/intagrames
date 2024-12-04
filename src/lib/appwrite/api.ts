import { useToast } from "@/components/ui/use-toast";
import { INewPost, INewUser, IUpdatePost, updatePostProp } from "@/types";
import { ID, Models, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases, storage } from "./config";

export async function saveUserToDB(user: {
  accountId: string;
  username: string;
  name: string;
  email: string;
  imageUrl: URL;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user,
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file,
    );
    return uploadFile;
  } catch (error) {
    console.log(error);
  }
}

export async function getUploadedFile(fileId: string) {
  try {
    const storedFile = await storage.getFile(appwriteConfig.storageId, fileId);
    return storedFile;
  } catch (error) {
    console.log(error);
  }
}

export async function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100,
    );

    if (!fileUrl) throw Error;
    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFile(fileId: string) {
  try {
    if (!fileId) throw new Error();

    const deleteFile = await storage.deleteFile(
      appwriteConfig.storageId,
      fileId,
    );
    return deleteFile;
  } catch (error) {
    console.log(error);
  }
}

// User
export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name,
    );

    if (!newAccount)
      throw new Error("Something went wrong while creating account");

    const avatarUrl = avatars.getInitials(user.name, 256, 256);

    const newUser = await saveUserToDB({
      name: user.name,
      email: user.email,
      username: user.username,
      accountId: newAccount.$id,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const loginAccount = await account.createEmailSession(
      user.email,
      user.password,
    );
    return loginAccount;
  } catch (error) {
    console.log(error);
  }
}
export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)],
    );

    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function signOutAccount() {
  try {
    const logoutAccount = await account.deleteSession("current");
    return logoutAccount;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserPosts(userId: string) {
  if (!userId) return;

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")],
    );
    console.log(posts);

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function getPostById(postId: string) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserSaves(userId: string) {
  try {
    const userSavedPost = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
    );
    if (!userSavedPost) throw new Error();

    return userSavedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserDetails() {}

export async function setUserDetails() {}

export async function getUserLikes() {}

export async function getAllUsers() {
  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(10)],
    );

    if (!users) throw new Error("user not found");

    return users;
  } catch (error) {
    console.log(error);
  }
}

// Posts
export async function createPost(post: INewPost) {
  try {
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    const fileUrl = await getFilePreview(uploadedFile.$id);

    if (!fileUrl) throw Error;

    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      },
    );
    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(10)],
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function updatePost(post: IUpdatePost) {
  try {

    const fileImageChange = post.file.length > 0

    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (fileImageChange) {
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;

      const fileUrl = await getFilePreview(uploadedFile.$id);
      if (!fileUrl) throw Error;

      image.imageId = uploadedFile.$id
      image.imageUrl = fileUrl

    }

    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    const updatePost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        location: post.location,
        tags: tags,
        imageUrl: image.imageUrl,
        imageId:  image.imageId,
      },
    );

    if (!updatePost && fileImageChange) {
      await deleteFile(image.imageId);
      console.log("Photo deleted from storage");
      throw Error;
    }

    return updatePost;
  } catch (error) {
    console.log(error);
  }
}

export async function getPopularPosts() {
try {
  const popular = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
  )

  if (!popular) throw new Error

  return popular;
  
} catch (error) {
  console.log(error);
}

}

export async function setPostLikes(postId: string, likesArray: string[]) {
  try {
    const setLike = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      },
    );

    if (!setLike) throw new Error("Not able to set the like");
    console.log(setLike);

    return setLike;
  } catch (error) {
    console.log(error);
  }
}
export async function setPostSaves(post: string | undefined, user: string) {
  try {
    const postSaved = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.saveCollectionsID,
      ID.unique(),
      {
        user,
        post,
      },
    );

    if (!postSaved) throw new Error("Not able to Save");

    return postSaved;
  } catch (error) {
    console.log(error);
  }
}
export async function setDeletePostSaves(postId: string) {
  try {
    const deletePostSave = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.saveCollectionsID,
      postId,
    );

    if (!deletePostSave) throw new Error("Not able to remove save");

    return deletePostSave;
  } catch (error) {
    console.log(error);
  }
}

export async function deletePost(postId: string | undefined, postImageId: string) {
  try {

    const deletedPhoto = deleteFile(postImageId)

    if (!deletedPhoto) throw new Error("No able to delete the post due to photo");

    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
    )

    if (!statusCode) throw new Error

    return { status: 'Ok'};
  } catch (error) {
    console.log(error);
  }
}
