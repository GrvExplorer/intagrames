import { Models } from "appwrite";
import { Link } from "react-router-dom";

function SaveCard({ save }: {save: Models.Document}) {
  return (
    <div className="">
      <div className="flex rounded-md border shadow-md shadow-primary-600">
        <div className="">
          <img src={save.imageUrl} alt="save image" className="w-40 rounded-md h-40" />
        </div>

    <div className=" px-4
    ">
            <Link to={`/post-details/${save.$id}`}>
        <div className="small-medium lg:base-medium  py-5">
          <p className="">{save.caption}</p>
          <ul className="my-2 flex gap-1">
            {save?.tags?.map((tag: string, i: string) => (
              <li key={`${tag}${i}`} className="small-regular text-light-3">
                #{tag}
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </div>

      </div>
    </div>
  );
}

export default SaveCard;
