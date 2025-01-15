export const TopBar = () => (
  <div className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-10">
    <div className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center space-x-4">
        <LayoutGrid className="h-6 w-6 text-blue-600" />
        <h1 className="text-xl font-semibold text-gray-800">
          მშენებარე ბინების მართვა
        </h1>
      </div>
    </div>
  </div>
);
