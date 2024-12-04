import ExplorerCard from "@/components/ui/ExplorerCard";
import { Input } from "@/components/ui/input";
import { useGetPopularPosts } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";
import { Loader2 } from "lucide-react";

function Explore() {


  const { data:popularPosts, isLoading:popularLoading } = useGetPopularPosts()


  return (
    <div className="w-4/6">
      <h1 className="mb-10 text-3xl font-bold">Search Posts</h1>

      <div className="flex w-full gap-3 rounded-lg bg-dark-4 px-4 shadow-md">
        <img
          src="/assets/icons/search.svg"
          width={24}
          height={24}
          alt="search"
        />
        <Input type="text" placeholder="Search" className="explore-search" />
      </div>
      <div className="mt-16 flex justify-between">  

      <h1 className="mb-10 text-3xl font-bold">Popular Today</h1>

      <div className="flex-center gap-3 h-12 bg-dark-3 rounded-xl px-4 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img
            src="/assets/icons/filter.svg"
            width={20}
            height={20}
            alt="filter"
          />
        </div>
      </div>

    <div className="flex gap-x-20 gap-y-10 flex-wrap">
      {popularLoading ? (
        <div className="flex justify-center w-full mt-6">
          <Loader2 className="animate-spin h-8 w-8" />
        </div>
      ): (
        <>
        {popularPosts?.documents.map((popularPost: Models.Document, i) => (
            <ExplorerCard   key={i} popularPost={popularPost} />
        ))}
        </>
      )

      }
    </div>
    </div>
  );
}

export default Explore;
