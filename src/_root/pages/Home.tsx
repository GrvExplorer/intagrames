import PostCards from "@/components/shared/PostCards/PostCards";
import { useUserContext } from "@/context/AuthContext";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";
import { Loader } from "lucide-react";
import { Navigate } from "react-router-dom";

function Home() {
  const { isAuthenticated } = useUserContext();
  const { data: posts, isLoading: isPostLoading } = useGetRecentPosts();

  return (
    <div>
      {isAuthenticated ? (
        <>
          <h1 className="mb-10 text-3xl font-bold">Home Feed</h1>
          {isPostLoading ? (
            <Loader className="mr-2 h-10 w-10 animate-spin" />
          ) : (
            <PostCards posts={posts} />
          )}
        </>
      ) : (
        <Navigate to="/sign-up" />
      )}
    </div>
  );
}

export default Home;
