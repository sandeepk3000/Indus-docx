import { useForm, Controller } from "react-hook-form";
import Input from "./Input";
import TextArea from "./TextArea";
import Button from "./Button";

import { useState } from "react";
import useCreateTest from "../hooks/useCreateTest";
import useUpload from "../hooks/useUpload";

export type TestFormValues = {
  title: string;
  description: string;
  duration: number;
  thumbnail: FileList | null;
  status: "LIVE" | "COMPLETED" | "UPCOMING";
  access: "PUBLIC" | "PRIVATE";
};
interface TestFormProps {
  onTestSubmit: (isTestCreated: boolean) => void;
}
const TestForm = ({ onTestSubmit }: TestFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createTest } = useCreateTest();
  const { upload } = useUpload();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TestFormValues>();

  const onSubmit = async (data: TestFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const thumbnail = data.thumbnail?.[0];
      if (thumbnail) {
        const thumbnailRes = await upload(thumbnail);
        console.log("thumbnailRes");
        console.log(thumbnailRes);
        if (thumbnailRes) {
          const test = await createTest({
            ...data,
            userId: "695e2dcc002e7344aebe",
            thumbnail: thumbnailRes.$id,
          });
          console.log("test");
          console.log(test);
          if (test) {
            onTestSubmit(true);
          }
        }
      }
    } catch (err) {
      console.log(err.message);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="max-w-xl mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">Create Test</h2>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Controller
              name="title"
              rules={{ required: "Title is required" }}
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="Enter test title"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              )}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <Controller
              name="description"
              rules={{ required: "Description is required" }}
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                  rows={4}
                  value={field.value}
                  placeholder="Enter test description"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Duration (minutes)
            </label>
            <Controller
              name="duration"
              rules={{ required: "Duration is required" }}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  type="number"
                  placeholder="Enter duration in minutes"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              )}
            />
            {errors.duration && (
              <p className="text-red-500 text-sm mt-1">
                {errors.duration.message}
              </p>
            )}
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium mb-1">Thumbnail</label>
            <Controller
              name="thumbnail"
              rules={{ required: "Thumbnail is required" }}
              control={control}
              render={({ field: { onChange } }) => (
                <Input
                  type="file"
                  onChange={(e) => onChange(e.target.files)}
                  accept="image/*"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                />
              )}
            />
            {errors.thumbnail && (
              <p className="text-red-500 text-sm mt-1">
                {errors.thumbnail.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Controller
              name="status"
              control={control}
              rules={{ required: "Status is required" }}
              render={({ field }) => (
                <select
                  {...field}
                  value={field.value}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select status</option>
                  <option value="LIVE">Live</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="UPCOMING">Upcoming</option>
                </select>
              )}
            />
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">
                {errors.status.message}
              </p>
            )}
          </div>

          {/* Access */}
          <div>
            <label className="block text-sm font-medium mb-1">Access</label>
            <Controller
              name="access"
              rules={{ required: "Access is required" }}
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select access</option>
                  <option value="PUBLIC">Public</option>
                  <option value="PRIVATE">Private</option>
                </select>
              )}
            />
            {errors.access && (
              <p className="text-red-500 text-sm mt-1">
                {errors.access.message}
              </p>
            )}
          </div>
        </form>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <Button
          onClick={handleSubmit(onSubmit)}
          className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default TestForm;
