import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ResourceCard = ({ data }) => {
  return (
    <Link to={`/division-id/${data._id}`} className="block h-full"> {/* Added h-full to Link for consistent card height in grids */}
      <div className="bg-white/90 backdrop-blur-sm p-7 rounded-2xl shadow-lg flex flex-col h-full // h-full here too
                      border border-white/20 hover:shadow-xl hover:border-indigo-200
                      transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up">
        <h2 className="text-2xl font-bold text-gray-900 mb-3
                       bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">
          {data.train_Name}
        </h2>
        <div classNamename="space-y-2 text-gray-700">
          <p className="font-medium"><span className="font-semibold text-gray-800">Train Number:</span> {data.train_Number}</p>
          <p className="font-medium"><span className="font-semibold text-gray-800">Zone:</span> {data.division}</p>
        </div>
      </div>
    </Link>
  );
};

// PropTypes for ResourceCard
ResourceCard.propTypes = {
  data: PropTypes.shape({
    train_Name: PropTypes.string.isRequired,
    train_Number: PropTypes.string.isRequired,
    division: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

export default ResourceCard;