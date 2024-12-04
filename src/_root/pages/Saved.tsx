
import SaveCard from "@/components/ui/SaveCard";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserSaves } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";
import { Loader } from "lucide-react";

function Saved() {
  const { user } = useUserContext();
  const { data, isLoading } = useGetUserSaves(user.id);

  console.log(data);
  
  return (

    <>
      <div className="">
        <h1 className="mb-10 text-3xl font-bold">Save Page</h1>

        {isLoading ? (
          <Loader className="mr-2 h-10 w-10 animate-spin" />
        ) : (
          data?.save?.map(({post}: Models.Document) => (
            <div key={post.$id} className="my-8 lg:w-3/4">
              <SaveCard save={post} />
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Saved;
