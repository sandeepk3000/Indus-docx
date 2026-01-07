const TestForm = () => {
  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="max-w-xl mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">Create Test</h2>

        <form className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              placeholder="Enter test title"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              rows="4"
              placeholder="Enter test description"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              placeholder="e.g. 60"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium mb-1">Thumbnail</label>
            <input
              type="file"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="live">Live</option>
              <option value="completed">Completed</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>

          {/* Access */}
          <div>
            <label className="block text-sm font-medium mb-1">Access</label>
            <select className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </form>
      </div>

      {/* Fixed Bottom Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition">
          Continue
        </button>
      </div>
    </div>
  );
};
export default TestForm;
