import { Button } from "@/components/ui/button";

export default function () {
  return (
    <div>
      <h2 className="border-b border-base-200 py-4 text-lg font-bold">
        #3. Preview Song
      </h2>

      <div className="mt-4 flex justify-center">
        <img
          src="https://cdn1.suno.ai/image_a4f209ec-ec1d-4ae3-8181-5e7bb9d9dc57.png"
          alt=""
          className="w-40 h-40 rounded-md"
        />
      </div>

      <div className="text-center mt-4 font-bold">My Stupid Heart</div>

      <div className="mt-4 text-center flex justify-center gap-x-3">
        <Button className="cursor-pointer">Play</Button>
        <Button className="cursor-pointer bg-info text-info-content">
          Share
        </Button>
      </div>
    </div>
  );
}
