const RecentBox = ({ data }) => {
  return (
    <div className="p-2 w-full">
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 rounded-lg shadow-lg flex flex-col items-center justify-center  p-8 mb-2">
        <span className="text-2xl font-semibold text-white mb-2">{data?.title}</span>
        <span className="text-5xl font-bold text-white">{data?.count}</span>
      </div>
    </div>
  );
};

export default RecentBox;
