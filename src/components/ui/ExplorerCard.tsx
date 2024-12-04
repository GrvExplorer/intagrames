import { Models } from "appwrite";
import { Link } from "react-router-dom";

function ExplorerCard({ popularPost }: { popularPost: Models.Document }) {

  return (
    <Link to={`/post-details/${popularPost.$id}`}>
      <div className="relative ">
        <img
          className="rounded-2xl h-80 w-80"
          src={popularPost.imageUrl}
          alt="Post Photo"
        />
        <div className="absolute bottom-0 mb-3 ml-3 h-10 w-10 rounded-full">
          <img
            src={popularPost.creator.imageUrl}
            className="rounded-full"
            alt="creator photo"
          />
        </div>
      </div>
    </Link>
  );
}

export default ExplorerCard;
