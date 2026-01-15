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
  status: "live" | "completed" | "upcoming";
  access: "public" | "private";
};

const TestForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createTest } = useCreateTest();
  const { upload } = useUpload();
  const { control, handleSubmit } = useForm<TestFormValues>({
    defaultValues: {
      title: "",
      description: "",
      duration: 60,
      thumbnail: null,
      status: "live",
      access: "public",
    },
  });

  const onSubmit = async (data: TestFormValues) => {
    setIsLoading(true);
    setError(null);
    // console.log(JSON.stringify(data.thumbnail));
    try {
      const thumbnail = data.thumbnail;
      console.log(thumbnail?.[0].name);
      if (thumbnail) {
        const thumbnailRes = await upload(thumbnail?.[0]);

        if (thumbnailRes) {
          const test = await createTest({
            ...data,
            thumbnail: thumbnailRes.$id,
          });
          console.log(test);
        }
      }
    } catch (err) {
      console.log(err);
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
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <Controller
              name="description"
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
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Duration (minutes)
            </label>
            <Controller
              name="duration"
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
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium mb-1">Thumbnail</label>
            <Controller
              name="thumbnail"
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
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  value={field.value}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="live">Live</option>
                  <option value="completed">Completed</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              )}
            />
          </div>

          {/* Access */}
          <div>
            <label className="block text-sm font-medium mb-1">Access</label>
            <Controller
              name="access"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              )}
            />
          </div>
        </form>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <button
          onClick={handleSubmit(onSubmit)}
          className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default TestForm;
