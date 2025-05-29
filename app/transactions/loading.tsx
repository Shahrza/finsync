import Loader from "@/components/layout/Loader";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader size={70} />
    </div>
  );
};
export default Loading;
