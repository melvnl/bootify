import React, { useState } from "react";
import { Form, FormState } from "lib/types";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

export default function SearchBar() {
  const [form, setForm] = useState<FormState>({ state: Form.Initial });
  const [searchValue, setSearchValue] = useState("");
  const [videoId, setVideoId] = useState("");

  const searchSong = async (e: any) => {
    e.preventDefault();

    console.log(searchValue);
    const title = searchValue.replaceAll(" ", "%20");
    const YOUTUBE_SEARCH =
      "https://www.googleapis.com/youtube/v3/search?maxResults=1&q=";
    const res: any = await fetch(
      `${YOUTUBE_SEARCH}${title}&type=video&videoCategoryId=10&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
    );
    const data = await res.json();

    if (res) {
      setVideoId(data.items[0].id.videoId);
      setForm({
        state: Form.Success,
        message: `Success`,
      });
    }
  };

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
        <iframe
          className=" w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={searchValue}
        />
      ) : null}
    </div>
  );
}
