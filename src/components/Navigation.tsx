
import { Link } from "react-router-dom";
import { BarChart2, Calendar, Plus, Home } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="bg-background border-b border-border">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 text-primary hover:text-primary/90">
              <Home className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </Link>
            <Link to="/team-rhythms" className="flex items-center space-x-2 text-primary hover:text-primary/90">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Team Rhythms</span>
            </Link>
            <Link to="/visualizer" className="flex items-center space-x-2 text-primary hover:text-primary/90">
              <BarChart2 className="w-5 h-5" />
              <span className="font-medium">Rhythm Analysis</span>
            </Link>
            <Link to="/builder" className="flex items-center space-x-2 text-primary hover:text-primary/90">
              <Plus className="w-5 h-5" />
              <span className="font-medium">Rhythm Builder</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
