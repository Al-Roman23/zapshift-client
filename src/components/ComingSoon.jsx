// Coming Soon Placeholder Component For Unfinished Pages
const ComingSoon = ({ pageName }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
    <h1 className="text-4xl font-bold text-gray-700">{pageName}</h1>
    <p className="text-lg text-gray-500">This Page Is Under Construction!</p>
    <div className="text-6xl">🚧</div>
  </div>
);

export default ComingSoon;
