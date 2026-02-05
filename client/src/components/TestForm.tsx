import { useForm, Controller } from "react-hook-form";
import Input from "./Input";
import TextArea from "./TextArea";
import Button from "./Button";
import useTest from "../hooks/useTest";
import useMedia from "../hooks/useMedia";
import { ID } from "appwrite";
import type { TestDoc, Test } from "../../types";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

export interface TestFormValues extends Omit<Test, "thumbnail"> {
  thumbnail: FileList | null;
}
interface TestFormProps {
  test?: TestDoc;
  onTestSubmit: (isTestCreated: boolean) => void;
}
const TestForm = ({ onTestSubmit, test }: TestFormProps) => {
  const { createTest, updateTest } = useTest();
  const { user } = useAuth0();
  const userId = user?.sub;
  const { upload, deleteFile, getFileView } = useMedia();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<TestFormValues>({
    defaultValues: {
      title: test?.title || "",
      description: test?.description || "",
      duration: test?.duration || "",
      thumbnail: null,
      status: test?.status || "PUBLISHED",
      access: test?.access || "PUBLIC",
      userId: test?.userId,
      $id: test?.$id || "",
    },
  });

  const onSubmit = async (data: TestFormValues) => {
    if (!userId) {
      alert("Please login to create a test");
      return;
    }
    try {
      if (test) {
        const thumbnail = data.thumbnail?.[0]
          ? await upload(data.thumbnail[0])
          : null;
        if (thumbnail) {
          console.log("available thum", test.thumbnail);
          await deleteFile(test.thumbnail);
        }
        const updatedTest = await updateTest({
          ...data,
          thumbnail: thumbnail?.$id || test.thumbnail,
        });
        if (updatedTest) {
          alert("Test updated successfully");
          onTestSubmit(true);
        }
      } else {
        const thumbnail = data.thumbnail?.[0];
        if (thumbnail) {
          const thumbnailRes = await upload(thumbnail);
          if (thumbnailRes) {
            const test = await createTest({
              ...data,
              $id: ID.unique(),
              userId: userId,
              thumbnail: thumbnailRes.$id,
            });
            console.log(test);
            if (test) {
              alert("Test created successfully");
              reset({
                title: "",
                description: "",
                duration: "",
                thumbnail: null,
                status: "PUBLISHED",
                access: "PUBLIC",
                userId: "",
                $id: "",
              });
              onTestSubmit(true);
            }
          }
        }
      }
    } catch (err: unknown) {
      // show error messag in alter
      alert("something went wrong");
      throw err;
    }
  };
  useEffect(() => {
    // trim all fields
    watch((data) => {
      if (data.title) {
        data.title = data.title.trim();
      }
      if (data.description) {
        data.description = data.description.trim();
      }
      if (data.duration) {
        data.duration = data.duration.trim();
      }
    });
  }, [watch]);

  return (
    <div className="min-h-screen  pb-24">
      <div className="max-w-2xl mx-auto px-4 pt-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {test ? "Update Test" : "Create New Test"}
          </h2>
          <p className="text-sm text-gray-500">
            Fill test details carefully before publishing
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border">
          <form className="p-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Title */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Test Title
              </label>
              <Controller
                name="title"
                control={control}
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <Input
                    type="text"
                    {...field}
                    placeholder="Eg. Maths Live Test – Algebra"
                    className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                )}
              />
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <Controller
                name="description"
                control={control}
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    rows={4}
                    placeholder="Brief test overview"
                    className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                )}
              />
            </div>

            {/* Duration */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Duration (Minutes)
              </label>
              <Controller
                name="duration"
                control={control}
                rules={{ required: "Duration is required" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    placeholder="60"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                )}
              />
            </div>

            {/* Thumbnail */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Thumbnail
              </label>

              <Controller
                name="thumbnail"
                control={control}
                render={({ field: { onChange } }) => (
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onChange(e.target.files)}
                    className="mt-1 w-full rounded-lg border bg-white px-3 py-2"
                  />
                )}
              />

              {test && (
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={getFileView(test.thumbnail)}
                    className="h-16 w-16 rounded-lg object-cover border"
                  />
                  <span className="text-xs text-gray-500">
                    Current thumbnail
                  </span>
                </div>
              )}
            </div>

            {/* Status + Access */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Status */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PUBLISHED">Published</option>
                      <option value="UPCOMING">Upcoming</option>
                    </select>
                  )}
                />
              </div>

              {/* Access */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Access
                </label>
                <Controller
                  name="access"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="mt-1 w-full rounded-lg border px-3 py-2"
                    >
                      <option value="PUBLIC">Public</option>
                      <option value="PRIVATE">Private</option>
                    </select>
                  )}
                />
              </div>
            </div>
          </form>
        </div>
        <Button
          onClick={handleSubmit(onSubmit)}
          className="w-full mt-4 rounded-lg bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700"
        >
          {test ? "Update Test" : "Create Test"}
        </Button>
      </div>

      {/* Fixed Bottom Action */}
      <div className="border-t shadow-sm"></div>
    </div>
  );
};

export default TestForm;
