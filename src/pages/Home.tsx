
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import homeContent from "../data/home-content.md?raw";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rhythm-50 via-white to-rhythm-50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Banner Image */}
        <div className="w-full h-[400px] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400">Banner Image Placeholder</div>
        </div>

        {/* Content from Markdown */}
        <div className="prose prose-slate max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-4xl font-bold text-gray-900 text-center">{children}</h1>
              ),
              p: ({ children }) => (
                <p className="text-xl text-gray-600 max-w-3xl mx-auto text-center">{children}</p>
              ),
              h2: ({ children }) => (
                <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-8">{children}</h2>
              ),
              h3: ({ children }) => (
                <CardTitle>{children}</CardTitle>
              ),
              a: ({ href, children }) => (
                <Link 
                  to={href || "#"} 
                  className="text-rhythm-600 hover:text-rhythm-700 font-medium"
                >
                  {children}
                </Link>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-3 text-gray-600">
                  {children}
                </ol>
              ),
            }}
          >
            {homeContent}
          </ReactMarkdown>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Team Rhythms Card */}
          <Card>
            <CardHeader>
              <CardTitle>Team Rhythms</CardTitle>
              <CardDescription>View and manage your team's meeting schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Access a comprehensive overview of your team's meeting schedules, organized by category. View details such as attendees, duration, and frequency.
              </p>
              <Link 
                to="/team-rhythms"
                className="text-rhythm-600 hover:text-rhythm-700 font-medium"
              >
                View Team Rhythms →
              </Link>
            </CardContent>
          </Card>

          {/* Rhythm Visualizer Card */}
          <Card>
            <CardHeader>
              <CardTitle>Rhythm Visualizer</CardTitle>
              <CardDescription>Analyze meeting time distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Visualize your team's meeting time allocation with interactive charts. See monthly, quarterly, and annual breakdowns by category.
              </p>
              <Link 
                to="/visualizer"
                className="text-rhythm-600 hover:text-rhythm-700 font-medium"
              >
                Open Visualizer →
              </Link>
            </CardContent>
          </Card>

          {/* Rhythm Builder Card */}
          <Card>
            <CardHeader>
              <CardTitle>Rhythm Builder</CardTitle>
              <CardDescription>Create custom meeting rhythms</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Build your team's meeting rhythm from scratch or use our templates. Customize meeting details, attendees, and frequencies to match your needs.
              </p>
              <Link 
                to="/builder"
                className="text-rhythm-600 hover:text-rhythm-700 font-medium"
              >
                Start Building →
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* How to Use Guide */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>How to Use Rhythm Builder</CardTitle>
            <CardDescription>Follow these steps to create your team's meeting rhythm</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Upload an existing rhythm file or start from scratch</li>
              <li>Choose from our templates based on your team size if starting fresh</li>
              <li>Enter your organization's name and details</li>
              <li>Customize meeting details including title, attendees, and duration</li>
              <li>Organize meetings into categories (e.g., Strategic, Tactical, One-on-ones)</li>
              <li>Set meeting frequencies (daily, weekly, monthly, etc.)</li>
              <li>Add any relevant meeting links or additional notes</li>
              <li>Review and export your rhythm as a markdown file</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
