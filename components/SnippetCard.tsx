import Image from "next/image";
import { Snippet } from "@/lib/types";

export default function SnippetCard({ title, thumbnail }: Snippet) {
  return (
    <>
      <h1 className=" mb-2 font-semibold">Currently Listening to</h1>
      <div className="flex border p-3 rounded-sm shadow-sm">
        <div className="w-full">
          <div className="flex">
            <Image src={thumbnail} width={100} height={100} alt={title} />
            <div className=" ml-3">
              <p className=" font-bold">{title.replaceAll("&#39;", "'")}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
