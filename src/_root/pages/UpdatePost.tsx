import FormController from "@/components/shared/form/FormControl";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";
import { Loader } from "lucide-react";
import { useParams } from "react-router-dom";

function UpdatePost() {
  const { postId } = useParams();
  const { data, isLoading } = useGetPostById(postId);

  return (
    <div className="flex justify-center">
      <div className="mr-6 flex flex-col justify-center gap-8 ">
        <h1 className="flex gap-4 text-3xl font-bold">
          <img
            className="invert-white w-8"
            src="/assets/icons/gallery-add.svg"
            alt=""
          />
          Edit Post
        </h1>

        {isLoading ? (
          <div className="flex-center h-full w-full">
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          </div>
        ) : (
          <FormController isUpdate={true} data={data} />
        )}
      </div>
    </div>
  );
}

export default UpdatePost;
