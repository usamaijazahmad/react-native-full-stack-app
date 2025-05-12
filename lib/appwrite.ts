import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://fra.cloud.appwrite.io/v1",
  platform: "com.practice.aora",
  projectId: "680b26ac0009a8c7c6dd",
  databaseId: "680b28e60022a55b34b8",
  userCollectionId: "680b290300090427edd5",
  videoCollectionId: "680b29270004981b85ab",
  storageId: "680b2b0300065136c17e",
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    const newAccount = account.create(ID.unique(), email, password, username);

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: (await newAccount).$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (e) {
    console.log(e);
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (e) {
    console.log(e);
  }
};

export const getAccount = async () => {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    console.log(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId
    );

    return posts.documents;
  } catch (error) {
    console.log(error);
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt", Query.limit(7))]
    );

    return posts.documents;
  } catch (error) {
    console.log(error);
  }
};

export const searchPosts = async (query: any) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search("title", query)]
    );

    return posts.documents;
  } catch (error) {
    console.log(error);
  }
};

export const searchUserLikedPosts = async (query: any, userId: any) => {
  if (!userId) return [];

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search("title", query), Query.limit(100)]
    );

    const likedPosts = posts.documents.filter(
      (post: any) =>
        Array.isArray(post.likes) &&
        post.likes.some((user: any) => user.$id === userId)
    );

    return likedPosts;
  } catch (error) {
    console.error("Error searching liked posts:", error);
    return [];
  }
};

export const getUserPosts = async (userId: any) => {
  if (!userId) return [];
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal("creator", userId)]
    );
    return posts.documents;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getUserLikedPosts = async (userId: any) => {
  if (!userId) return [];

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId
    );

    const likedPosts = posts.documents.filter((post: any) =>
      post.likes?.some((user: any) => user.$id === userId)
    );

    return likedPosts;
  } catch (error) {
    console.error("Error fetching liked posts:", error);
    return [];
  }
};

export const toggleLikePost = async (videoId: any, userId: any) => {
  if (!videoId || !userId) return null;

  try {
    const video = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      videoId
    );

    const currentLikes: { $id: string }[] = video.likes || [];

    const currentLikeIds = currentLikes.map((user) => user.$id);

    let updatedLikes;

    if (currentLikeIds.includes(userId)) {
      updatedLikes = currentLikes.filter((user) => user.$id !== userId);
    } else {
      updatedLikes = [...currentLikes, { $id: userId }];
    }

    const updatedVideo = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      videoId,
      {
        likes: updatedLikes,
      }
    );

    return updatedVideo;
  } catch (error) {
    console.error(error);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    console.log(error);
  }
};

export const uploadFile = async (file: any, type: any) => {
  console.log(file, "fileeeeeeeeeeeeee");
  if (!file) return;

  // const { mimeType, ...rest } = file;
  // const asset = {
  //   name: file.fileName,
  //   type: file.mimeType,
  //   size: file.fileSize,
  //   uri: file.uri,
  // };

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file.file
    );

    // const fileUrl = await getFilePreview(uploadedFile.$id, type);

    // return fileUrl;
  } catch (error) {
    console.log(error);
  }
};

// export const getFilePreview = async (fileId: any, type: any) => {
//   let fileUrl;

//   try {
//     if (type === "video") {
//       fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
//     } else if (type === "image") {
//       fileUrl = storage.getFilePreview(
//         appwriteConfig.storageId,
//         fileId,
//         2000,
//         2000,
//         "top",
//         100
//       );
//     } else {
//       throw new Error("Invalid file type");
//     }

//     if (!fileUrl) throw Error;

//     return fileUrl;
//   } catch (error) {
//     console.log(error);
//   }
// };

export const createVideoPost = async (form: any) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    // const newPost = await databases.createDocument(
    //   appwriteConfig.databaseId,
    //   appwriteConfig.videoCollectionId,
    //   ID.unique(),
    //   {
    //     title: form.title,
    //     thumbnail: thumbnailUrl,
    //     video: videoUrl,
    //     prompt: form.prompt,
    //     creator: form.userId,
    //   }
    // );

    // return newPost;
  } catch (error) {
    console.log(error);
  }
};
