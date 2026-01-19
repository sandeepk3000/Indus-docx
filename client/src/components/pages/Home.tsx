import Input from "../Input";
import { useState } from "react";
import Card from "../Card";
import Typo from "../Typo";
import { FaSearch } from "react-icons/fa";
import { useAuth0 } from "@auth0/auth0-react";
const Home = () => {
  const [search, setSearch] = useState<string>("");
  const { logout, isLoading, isAuthenticated } = useAuth0();

  const cardsData = [
    {
      title: "Blog 1",
      description:
        "**Java Description**Java is a high-level, object-oriented programming language developed by **James Gosling** at **Sun Microsystems** in **1995**. It is designed to be **platform-independent**, meaning Java programs can run on any operating system that has a Java Virtual Machine (JVM). This feature is commonly known as **“Write Once, Run Anywhere.",
      image: "https://picsum.photos/200/300",
      tags: ["Javascript's", "React"],
    },
    {
      title: "Blog 2",
      description: "Description 2",
      image: "https://picsum.photos/200/300",
      tags: ["Javascript's", "React"],
    },
    {
      title: "Blog 3",
      description: "Description 3",
      image: "https://picsum.photos/200/300",
      tags: ["Javascript's", "React"],
    },
  ];
  return (
    <div>
      {!isLoading && <div>{String(isAuthenticated)}</div>}
      <Typo className="text-2xl font-bold mb-4 text-center text-neutral900 text-[45px]">
        Indus Docx
      </Typo>

      <Input
        rightIcon={<FaSearch />}
        placeholder="Search"
        type="text"
        className="w-full"
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        value={search}
      />
      <button onClick={() => logout()}>Login</button>
      <Typo className="mt-4">Blogs</Typo>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {cardsData &&
          cardsData.map((card, index) => {
            return <Card key={index} {...card} />;
          })}
      </div>
    </div>
  );
};

export default Home;
