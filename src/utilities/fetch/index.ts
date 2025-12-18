import {
  NotificationContent,
  NotificationTypes,
} from "@/types/NotificationProps";

const HOST_URL = process.env.NEXT_PUBLIC_HOST_URL;

export const getAllPosts = async (page = "1") => {
  const response = await fetch(`${HOST_URL}/api/posts/all?page=${page}`, {
    next: {
      revalidate: 0,
    },
  });
  const json = await response.json();
  if (!json.success)
    throw new Error(json.message ? json.message : "Something went wrong.");
  return json;
};

export const getRelatedPosts = async () => {
  const response = await fetch(`${HOST_URL}/api/posts/related`, {
    next: {
      revalidate: 0,
    },
  });
  const json = await response.json();
  if (!json.success)
    throw new Error(json.message ? json.message : "Something went wrong.");
  return json;
};

export const getUserPosts = async (username: string) => {
  const response = await fetch(`${HOST_URL}/api/posts/${username}`, {
    next: {
      revalidate: 0,
    },
  });
  const json = await response.json();
  if (!json.success)
    throw new Error(json.message ? json.message : "Something went wrong.");
  return json;
};

export const getUserLikes = async (username: string) => {
  const response = await fetch(`${HOST_URL}/api/posts/${username}/likes`, {
    next: {
      revalidate: 0,
    },
  });
  const json = await response.json();
  if (!json.success)
    throw new Error(json.message ? json.message : "Something went wrong.");
  return json;
};

export const getUserMedia = async (username: string) => {
  const response = await fetch(`${HOST_URL}/api/posts/${username}/media`, {
    next: {
      revalidate: 0,
    },
  });
  const json = await response.json();
  if (!json.success)
    throw new Error(json.message ? json.message : "Something went wrong.");
  return json;
};

export const getUserReplies = async (username: string) => {
  const response = await fetch(`${HOST_URL}/api/posts/${username}/replies`, {
    next: {
      revalidate: 0,
    },
  });
  const json = await response.json();
  if (!json.success)
    throw new Error(json.message ? json.message : "Something went wrong.");
  return json;
};

export const getUserPost = async (postId: string, postAuthor: string) => {
  const response = await fetch(
    `${HOST_URL}/api/posts/${postAuthor}/${postId}`,
    {
      next: {
        revalidate: 0,
      },
    }
  );
  const json = await response.json();
  if (!json.success)
    throw new Error(json.message ? json.message : "Something went wrong.");
  return json;
};

export const createPost = async (post: string) => {
  const response = await fetch(`${HOST_URL}/api/posts/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: post,
  });
  const json = await response.json();
  if (!json.success)
    throw new Error(json.message ? json.message : "Something went wrong.");
  return json;
};

export const logIn = async (candidate: string) => {
  const response = await fetch(`${HOST_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: candidate,
  });
  return response.json();
};

export const logInAsTest = async () => {
  const testAccount = {
    username: "test",
    password: "123456789",
  };
  return await logIn(JSON.stringify(testAccount));
};

export const logout = async () => {
  await fetch(`${HOST_URL}/api/auth/logout`, {
    next: {
      revalidate: 0,
    },
  });
};

export const createUser = async (newUser: string) => {
  const response = await fetch(`${HOST_URL}/api/users/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: newUser,
  });
  return response.json();
};

export const getUser = async (username: string) => {
  const response = await fetch(`${HOST_URL}/api/users/${username}`, {
    next: {
      revalidate: 0,
    },
  });
  const json = await response.json();
  if (!json.success)
    throw new Error(json.message ? json.message : "Something went wrong.");
  return json;
};

export const editUser = async (updatedUser: string, username: string) => {
  const response = await fetch(`${HOST_URL}/api/users/${username}/edit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: updatedUser,
  });
  return response.json();
};

export const updatePostLikes = async (
  postId: string,
  postAuthor: string,
  tokenOwnerId: string,
  isLiked: boolean
) => {
  const route = isLiked ? "unlike" : "like";
  const response = await fetch(
    `${HOST_URL}/api/posts/${postAuthor}/${postId}/${route}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: tokenOwnerId,
    }
  );
  const json = await response.json();
  if (!json.success)
    throw new Error(json.message ? json.message : "Something went wrong.");
  return json;
};

export const updateReposts = async (
  postId: string,
  postAuthor: string,
  tokenOwnerId: string,
  isReposted: boolean
) => {
  const route = isReposted ? "unrepost" : "repost";
  const response = await fetch(
    `${HOST_URL}/api/posts/${postAuthor}/${postId}/${route}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: tokenOwnerId,
    }
  );
  const json = await response.json();
  if (!json.success)
    throw new Error(json.message ? json.message : "Something went wrong.");
  return json;
};

export const updateUserFollows = async (
  followedUsername: string,
  tokenOwnerId: string,
  isFollowed: boolean
) => {
  const route = isFollowed ? "unfollow" : "follow";
  const response = await fetch(
    `${HOST_URL}/api/users/${followedUsername}/${route}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: tokenOwnerId,
    }
  );
  const json = await response.json();
  if (!json.success)
    throw new Error(json.message ? json.message : "Something went wrong.");
  return json;
};


export const updateUserLikes = async (
  followedUsername: string,
  tokenOwnerId: string,
  isLiked: boolean
) => {
  const route = isLiked ? "unlike" : "like";
  const response = await fetch(
    `${HOST_URL}/api/users/${followedUsername}/${route}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: tokenOwnerId,
    }
  );
  const json = await response.json();
  if (!json.success)
    throw new Error(json.message ? json.message : "Something went wrong.");
  return json;
};

export const deletePost = async (
  postId: string,
  postAuthor: string,
  tokenOwnerId: string
) => {
  const response = await fetch(
    `${HOST_URL}/api/posts/${postAuthor}/${postId}/delete`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: tokenOwnerId,
    }
  );
  const json = await response.json();
  if (!json.success)
    throw new Error(json.message ? json.message : "Something went wrong.");
  return json;
};

export const createReply = async (
  reply: string,
  postAuthor: string,
  postId: string
) => {
  const response = await fetch(
    `${HOST_URL}/api/posts/${postAuthor}/${postId}/reply`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: reply,
    }
  );
  const json = await response.json();
  if (!json.success)
    throw new Error(json.message ? json.message : "Something went wrong.");
  return json;
};

export const getReplies = async (postAuthor: string, postId: string) => {
  const response = await fetch(
    `${HOST_URL}/api/posts/${postAuthor}/${postId}/reply`,
    {
      next: {
        revalidate: 0,
      },
    }
  );
  const json = await response.json();
  if (!json.success)
    throw new Error(json.message ? json.message : "Something went wrong.");
  return json;
};

export const search = async (text: string) => {
  const response = await fetch(`${HOST_URL}/api/search?q=${text}`);
  return response.json();
};

export const getRandomThreeUsers = async () => {
  const response = await fetch(`${HOST_URL}/api/users/random`);
  const json = await response.json();
  if (!json.success)
    throw new Error(json.message ? json.message : "Something went wrong.");
  return json;
};

export const createMessage = async (message: string) => {
  const response = await fetch(`${HOST_URL}/api/messages/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: message,
  });
  const json = await response.json();
  if (!json.success)
    throw new Error(json.message ? json.message : "Something went wrong.");
  return json;
};

export const getUserMessages = async (username: string) => {
  const response = await fetch(`${HOST_URL}/api/messages/${username}`, {
    next: {
      revalidate: 0,
    },
  });
  const json = await response.json();
  if (!json.success)
    throw new Error(json.message ? json.message : "Something went wrong.");
  return json;
};

export const checkUserExists = async (username: string) => {
  const response = await fetch(`${HOST_URL}/api/users/exists?q=${username}`);
  return response.json();
};

export const deleteConversation = async (
  participants: string[],
  tokenOwnerId: string
) => {
  const response = await fetch(`${HOST_URL}/api/messages/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ participants, tokenOwnerId }),
  });
  const json = await response.json();
  if (!json.success)
    throw new Error(json.message ? json.message : "Something went wrong.");
  return json;
};

export const getNotifications = async () => {
  const response = await fetch(`${HOST_URL}/api/notifications`, {
    next: {
      revalidate: 0,
    },
  });
  const json = await response.json();
  if (!json.success)
    throw new Error(json.message ? json.message : "Something went wrong.");
  return json;
};

export const createNotification = async (
  recipient: string,
  type: NotificationTypes,
  secret: string,
  notificationContent: NotificationContent = null
) => {
  const response = await fetch(`${HOST_URL}/api/notifications/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ recipient, type, secret, notificationContent }),
  });
  const json = await response.json();
  if (!json.success)
    throw new Error(json.message ? json.message : "Something went wrong.");
  return json;
};

export const markNotificationsRead = async () => {
  const response = await fetch(`${HOST_URL}/api/notifications/read`, {
    next: {
      revalidate: 0,
    },
  });
  const json = await response.json();
  if (!json.success)
    throw new Error(json.message ? json.message : "Something went wrong.");
  return json;
};
