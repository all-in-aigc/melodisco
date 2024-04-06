import Describe from "../_components/create/describe";
import Info from "../_components/create/info";
import Preview from "../_components/create/preview";

export default function () {
  return (
    <div className="max-w-7xl mx-auto mt-16">
      <h1 className="text-center font-bold text-5xl">Create AI Song</h1>
      <div className="flex items-start mt-16">
        <div className="w-1/3 px-4">
          <Describe />
        </div>
        <div className="w-1/3 px-4">
          <Info />
        </div>
        <div className="flex-1">
          <Preview />
        </div>
      </div>
    </div>
  );
}
