
import { Link } from "react-router-dom";
import { BarChart2, Calendar } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 text-rhythm-600 hover:text-rhythm-700">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Rhythm Overview</span>
            </Link>
            <Link to="/visualizer" className="flex items-center space-x-2 text-rhythm-600 hover:text-rhythm-700">
              <BarChart2 className="w-5 h-5" />
              <span className="font-medium">Rhythm Visualizer</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
