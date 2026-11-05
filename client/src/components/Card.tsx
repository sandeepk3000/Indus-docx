
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  Clock3,
} from "lucide-react";

import type { TestDoc } from "../../types";
import useMedia from "../hooks/useMedia";

interface CardProps extends TestDoc {}

const Card = ({ thumbnail, title, description }: CardProps) => {
  const { getFileView } = useMedia();

  const shortDescription =
    description?.length > 120
      ? description.slice(0, 120) + "..."
      : description;

  return (
    <Link
      to="/admin"
      className="group block h-full outline-none"
    >
      <article
        className="
          relative h-full overflow-hidden rounded-2xl
          border border-white/10 bg-[#101522]
          shadow-lg shadow-black/10
          transition-all duration-300
          hover:-translate-y-2
          hover:border-[#ff0a2b]/50
          hover:shadow-xl hover:shadow-[#ff0a2b]/10
          focus-visible:ring-2 focus-visible:ring-[#ff0a2b]
        "
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-[#080b14]">
          <img
            src={getFileView(thumbnail)}
            alt={title}
            loading="lazy"
            className="
              h-full w-full object-cover
              transition-transform duration-700
              group-hover:scale-110
            "
          />

          {/* Image Gradient */}
          <div
            className="
              absolute inset-0
              bg-gradient-to-t
              from-[#080b14]/80 via-transparent to-transparent
            "
          />

          {/* Category Badge */}
          <div className="absolute left-4 top-4">
            <span
              className="
                rounded-full border border-[#ff0a2b]/30
                bg-[#ff0a2b]/90 px-3 py-1.5
                text-xs font-semibold text-white
                shadow-lg backdrop-blur-sm
              "
            >
              <BookOpen className="mr-1 inline h-3.5 w-3.5" />
              Learning Material
            </span>
          </div>

          {/* Hover Arrow */}
          <div
            className="
              absolute bottom-4 right-4
              flex h-10 w-10 items-center justify-center
              rounded-full border border-white/20
              bg-black/40 text-white backdrop-blur-md
              transition-all duration-300
              group-hover:rotate-45
              group-hover:border-[#ff0a2b]
              group-hover:bg-[#ff0a2b]
            "
          >
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>

        {/* Content */}
        <div className="p-5">

          {/* Title */}
          <h3
            className="
              mb-3 line-clamp-2 text-lg font-bold
              leading-snug text-white
              transition-colors duration-300
              group-hover:text-[#ff0a2b]
            "
          >
            {title}
          </h3>

          {/* Description */}
          <p className="line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-gray-400">
            {shortDescription || "Explore this learning material and improve your skills."}
          </p>

          {/* Bottom Divider */}
          <div className="my-5 h-px bg-white/10" />

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Clock3 className="h-4 w-4 text-[#ff0a2b]" />
              Start Learning
            </div>

            <span
              className="
                text-sm font-semibold text-[#ff0a2b]
                transition-all duration-300
                group-hover:translate-x-1
              "
            >
              Explore
              <span className="ml-1">→</span>
            </span>
          </div>

        </div>

        {/* Bottom Accent */}
        <div
          className="
            absolute bottom-0 left-0 h-1 w-0
            bg-[#ff0a2b]
            transition-all duration-500
            group-hover:w-full
          "
        />
      </article>
    </Link>
  );
};

export default Card;
