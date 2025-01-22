const RoomAreas = ({ data }) => {
  const rooms = [
    { key: "studio_area", label: "სტუდიო" },
    { key: "bedroom_area", label: "საძინებელი" },
    { key: "bedroom2_area", label: "საძინებელი 2" },
    { key: "living_room_area", label: "მისაღები" },
    { key: "bathroom_area", label: "სველი წერტილი" },
    { key: "bathroom2_area", label: "სველი წერტილი 2" },
    { key: "balcony_area", label: "აივანი" },
    { key: "balcony2_area", label: "აივანი 2" },
  ];

  return (
    <div className="space-y-3">
      {rooms.map(
        (room) =>
          data[room.key] > 0 && (
            <div
              key={room.key}
              className="bg-white/50 border border-gray-200 hover:border-gray-300 p-3 rounded-lg flex justify-between items-center shadow-sm transition-all duration-200 hover:shadow-md group"
            >
              <div className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                {room.label}
              </div>
              <div className="text-base font-medium text-gray-900">
                {data[room.key]} მ²
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default RoomAreas;
