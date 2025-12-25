import "./App.css";
import Container from "./components/container";
import React from "react";
import Button from "./components/Button";
import Typo from "./components/Typo";
import Card from "./components/Card";
import Input from "./components/Input"
function App() {
  console.log("Hello World");
  const [username, setUsername] = React.useState<string>("");
  const handleBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
   
    console.log(e.target);
  };
  return (
    <Container className="bg-red-500">
      <h1>Hello World {username}</h1>
      <Button clickHai={handleBtn}>
        <Typo>
       Submit
        </Typo>
      </Button>
      <Input placeholder="Enter your name" 
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}

        className="border border-gray-300 rounded-md p-2"
        />

      <Card
        image="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1"
        title="Card Title"
        description="This is a description of the card."
        tags={["Tag 1", "Tag 2", "Tag 3"]}
        link="https://example.com"
      />
    </Container>
  );
}

export default App;
