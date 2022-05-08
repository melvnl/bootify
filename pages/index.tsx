import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import SearchBar from "../components/SearchBar";

const Home: NextPage = () => {
  return (
    <div className=" max-w-lg mx-auto">
      <SearchBar />
    </div>
  );
};

export default Home;
