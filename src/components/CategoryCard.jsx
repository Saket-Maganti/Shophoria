import { Link } from "react-router-dom";

function CategoryCard({ title, image }) {
  return (
    <Link
      to={`/?category=${encodeURIComponent(title)}`}
      className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
    >
      <img
        src={image}
        alt={title}
        className="w-full h-40 object-cover transform group-hover:scale-105 group-hover:brightness-75 transition duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent group-hover:from-black/70 transition-all duration-300 flex items-center justify-center">
        <h3 className="text-white text-lg font-semibold tracking-wide">{title}</h3>
      </div>
    </Link>
  );
}

export default CategoryCard;
