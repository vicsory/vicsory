"use client";

import { useContext, use } from "react";
import { useQuery } from "@tanstack/react-query";

import CircularLoading from "@/components/misc/CircularLoading";
import NotFound from "@/app/not-found";
import BackToArrow from "@/components/misc/BackToArrow";
import { AuthContext } from "@/app/(vicsory)/layout";
import { getUserPost } from "@/utilities/fetch";
import SinglePost from "@/components/post/SinglePost";

export default function SinglePostPage({
  params: paramsPromise,
}: {
  params: Promise<{ username: string; postId: string }>;
}) {
  const params = use(paramsPromise); // unwraps the promise
  const { username, postId } = params;

  const queryKey = ["posts", username, postId];
  const { token, isPending } = useContext(AuthContext);

  const { isLoading, data, isFetched } = useQuery({
    queryKey: queryKey,
    queryFn: () => getUserPost(postId, username),
  });

  if (!isLoading && !data?.post) return <NotFound />;

  let backToProps = {
    title: username,
    url: `/${username}`,
  };

  if (isFetched && data?.post?.isReply) {
    backToProps = {
      title: "Post",
      url: `/${data.post.repliedTo.author.username}/posts/${data.post.repliedTo.id}`,
    };
  }

  return (
    <div>
      {isFetched && <BackToArrow title={backToProps.title} url={backToProps.url} />}
      {isLoading || isPending ? (
        <CircularLoading />
      ) : (
        <SinglePost post={data.post} token={token} />
      )}
    </div>
  );
}
