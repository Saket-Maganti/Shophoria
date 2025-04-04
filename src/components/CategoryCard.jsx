import { useNavigate } from "react-router-dom";

function CategoryCard({ title, image }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/?category=${encodeURIComponent(title)}`);
    setTimeout(() => {
      const section = document.getElementById("filtered-products");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <button
      onClick={handleClick}
      className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 w-full"
    >
      <img
        src={image}
        alt={title}
        className="w-full h-40 object-cover transform group-hover:scale-105 group-hover:brightness-75 transition duration-300"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent group-hover:from-black/70 transition-all duration-300 flex items-center justify-center">
        <h3 className="text-white text-lg font-semibold tracking-wide">{title}</h3>
      </div>
    </button>
  );
}

export default CategoryCard;
