// import React from "react";
import { Link } from "react-router-dom";
import type { TestDoc } from "../../types";
import useMedia from "../hooks/useMedia";
interface CardProps extends TestDoc {}
const Card = ({ thumbnail, title, description }: CardProps) => {
  const { getFileView } = useMedia();
  return (
    <Link to="/admin">
      <div
        className="
          bg-white rounded-lg shadow-md p-4
          transition-all duration-300 ease-in-out
          hover:-translate-y-2 hover:shadow-xl
          hover:scale-[1.02]
          cursor-pointer
        "
      >
        {/* Image */}
        <div className="overflow-hidden rounded-xl">
          <img
            src={getFileView(thumbnail)}
            alt={title}
            className="
              w-full h-48 object-cover
              transition-transform duration-300
              hover:scale-110
            "
          />
        </div>

        {/* Content */}
        <div>
          {/* Tags */}

          {/* Title */}
          <h3 className="text-lg font-semibold my-2 text-background-dark">
            {title}
          </h3>

          {/* Description */}
          <p className="text-text-muted text-sm leading-relaxed">
            {description?.length > 150
              ? description.slice(0, 150) + "..."
              : description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Card;
