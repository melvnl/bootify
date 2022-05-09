import React, { useRef, useState } from "react";
import { Form, FormState } from "lib/types";
import LoadingSpinner from "./LoadingSpinner";
import SnippetCard from "./SnippetCard";
import ErrorMessage from "./ErrorMessage";
import Image from "next/image";

export default function SearchBar() {
  const [form, setForm] = useState<FormState>({ state: Form.Initial });
  const [searchValue, setSearchValue] = useState("");
  const [videoId, setVideoId] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeVideoRef = useRef<HTMLIFrameElement | null>(null);

  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const searchSong = async (e: any) => {
    e.preventDefault();

    console.log(searchValue);
    const title = searchValue.replaceAll(" ", "%20");
    const YOUTUBE_SEARCH =
      "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=";
    const res: any = await fetch(
      `${YOUTUBE_SEARCH}${title}&type=video&videoCategoryId=10&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
    );
    const data = await res.json();

    if (data) {
      setVideoId(data.items[0].id.videoId);
      setTitle(data.items[0].snippet.title);
      setThumbnail(data.items[0].snippet.thumbnails.default.url);
      setForm({
        state: Form.Success,
        message: `Success`,
      });
    }
  };

  const sendCommand = (func: string, args?: any) => {
    setIsPlaying(!isPlaying);
    const iframe = iframeVideoRef.current;
    if (iframe) {
      const src = iframe.getAttribute("src");
      if (src) {
        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage(
            JSON.stringify({
              event: "command",
              func: func,
              args: args || [],
            }),
            "*"
          );
        }
      }
    }
  };

  const iframeURL = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;

  return (
    <div className=" font-sans w-full border border-gray-200 p-4 rounded-md">
      <form className=" my-2 text-secondary" onSubmit={searchSong}>
        <div className="flex flex-col md:flex-row mb-2">
          <input
            aria-label="Search articles"
            type="text"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search Music"
            className="block w-full px-4 py-2 text-secondary font-medium bg-white border border-gray-200 rounded-md "
          />
          <button
            className=" w-full p-2 my-2 md:w-1/6 md:ml-2 md:my-0 font-bold text-sm bg-primary text-secondary md:text-base rounded-md"
            type="submit"
          >
            {form.state === Form.Loading ? <LoadingSpinner /> : "Search"}
          </button>
        </div>
      </form>
      {form.state === Form.Error ? (
        <ErrorMessage>{form.message}</ErrorMessage>
      ) : form.state === Form.Success ? (
        <>
          <iframe
            className=" hidden"
            ref={iframeVideoRef}
            src={iframeURL}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={searchValue}
          />
          <SnippetCard title={title} thumbnail={thumbnail} />
        </>
      ) : null}
      {form.state === Form.Success ? (
        !isPlaying ? (
          <button
            onClick={() => sendCommand("playVideo")}
            className=" w-full py-2 mt-2 font-bold text-sm bg-primary text-secondary rounded-md"
          >
            <Image
              src="/play-button.svg"
              width={32}
              height={32}
              alt="play control"
            />
          </button>
        ) : (
          <button
            onClick={() => sendCommand("pauseVideo")}
            className=" w-full py-2 mt-2 font-bold text-sm bg-primary text-secondary rounded-md"
          >
            <Image
              src="/stop-button.svg"
              width={32}
              height={32}
              alt="stop control"
            />
          </button>
        )
      ) : null}
    </div>
  );
}
