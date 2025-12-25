import React from "react";
import { Link } from "react-router-dom";
interface CardProps {
  image: string;
  title: string;
  description: string;
  tags?: string[];
}
const Card = ({ image, title, description, tags }: CardProps) => {
  return (
    <Link to={"/make-test"}>
      <div className="bg-neutral800 overflow-hidden rounded-lg shadow-md overflow-hidden p-4">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover rounded-xl shadow-sm shadow-neutral800"
        />
        <div>
          <div className="flex flex-wrap gap-2 my-4">
            {tags?.map((tag, index) => (
              <span
                key={index}
                className="bg-primary text-white text-xs font-medium px-2.5 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-lg font-semibold my-4 text-white">{title}</h3>
          <p className="text-gray my-4 text-textLight">
            {description?.length > 50
              ? description?.slice(0, 150) + "..."
              : description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Card;
