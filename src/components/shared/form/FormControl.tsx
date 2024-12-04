import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import {
  useCreatePost,
  useUpdatePost,
} from "@/lib/react-query/queriesAndMutations";
import { CreatePostValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Models } from "appwrite";
import { useForm } from "react-hook-form";
import { useNavigate} from "react-router-dom";
import { z } from "zod";
import FileUploader from "../FileUploader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import React from "react";

function FormController({
  isUpdate,
  data
}: {
  isUpdate: boolean;
  data: Models.Document | undefined;
}) {
  const { user } = useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { mutateAsync: createPost, isLoading: isCreatePostIsLoading } =
    useCreatePost();
  const { mutateAsync: updatePost, isLoading: isUpdatePostIsLoading } =
    useUpdatePost();

  const form = useForm({
    resolver: zodResolver(CreatePostValidation),
    defaultValues: {
      caption: data ? data?.caption : "",
      file: [],
      location: data ? data?.location : "",
      tags: data ? data?.tags.join(",") : "",
    },
  });

  async function onHandleSubmit(details: z.infer<typeof CreatePostValidation>) {
    try {
      if (isUpdate && data) {
        const getUpdatePost = await updatePost({
          ...details,
          postId: data?.$id,
          imageId: data?.imageId,
          imageUrl: data?.imageUrl,
        });

        if (!getUpdatePost) {
          throw new Error("Error while updating post try again.");
        }

        toast({
          title: "Post Updated",
          description: "Your post has been updated successfully",
        });
        navigate("/");
        return getUpdatePost;
      }
      const newPost = await createPost({
        ...details,
        userId: user?.id,
      });

      if (!newPost) {
        throw new Error("post failed. Please try again.");
      }

      toast({
        title: "Post Created",
        description: "Your post has been created successfully",
      });
      navigate("/");

      return newPost;
    } catch (error) {
      console.log(error);
      toast({
        title: `${error?.message}`,
        description:
          "This may due to file extension allowed type is .png, .svg, .jpg, .jpge",
        variant: "destructive",
      });
    }
  }

  async function handleCancel(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    if (!isUpdate) {
      form.reset()
      return;
    }
    navigate('/')
  }

  return (
    <div>
      <Form {...form}>
        <form
          className="flex flex-col gap-10"
          onSubmit={form.handleSubmit(onHandleSubmit)}
        >
          <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Caption</FormLabel>
                <FormControl className="shad-textarea">
                  <Textarea rows={5} cols={100} {...field} id="caption" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add Photos</FormLabel>
                <FormControl className="file_uploader-box border-none bg-dark-3">
                  <FileUploader
                    fieldChange={field.onChange}
                    mediaUrl={isUpdate ? data?.imageUrl : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add Location</FormLabel>
                <FormControl className="shad-input">
                  <Input {...field} id="location" type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add Tags (separated by comma ",")</FormLabel>

                <FormControl className="shad-input">
                  <Input {...field} id="tags" type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end gap-4">
            <Button className="shad-button_dark_4"
            onClick={(e) => handleCancel(e)}
            >Cancel</Button>
            <Button className="shad-button_primary" type="submit">
              {isCreatePostIsLoading || isUpdatePostIsLoading ? (
                <div className="flex-center gap-2">
                  <Loader className="mr-2 h-4 w-4 animate-spin" /> Loading...
                </div>
              ) : (
                <>{isUpdate ? "Update" : "Create"} Post</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default FormController;
