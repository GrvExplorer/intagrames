import FormController from "@/components/shared/form/FormControl";

function CreatePost() {
  return (
    <div className="flex justify-center">
      <div className="mr-6 flex flex-col justify-center gap-8 ">
        <h1 className="flex gap-4 text-3xl font-bold">
          <img
            className="invert-white w-8"
            src="/assets/icons/gallery-add.svg"
            alt=""
          />
          Create Post
        </h1>

        <FormController isUpdate={false} data={undefined} />
      </div>
    </div>
  );
}

export default CreatePost;
