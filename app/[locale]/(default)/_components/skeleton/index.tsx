import { Skeleton } from "@/components/ui/skeleton";

export default function () {
  return (
    <>
      {[1, 2, 3, 4, 5].map((v: number) => {
        return (
          <div className="flex items-center mb-8" key={v}>
            <Skeleton className="h-12 w-12 mr-4 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-60" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        );
      })}
    </>
  );
}
