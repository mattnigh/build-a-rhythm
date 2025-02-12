
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Home = () => {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Welcome to Rhythm Minder</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your comprehensive tool for managing and visualizing team meeting rhythms. Get started by exploring our features below.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Team Rhythms</CardTitle>
              <CardDescription>View and manage your team's meeting schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Access a comprehensive overview of your team's meeting schedules, organized by category. View details such as attendees, duration, and frequency.
              </p>
              <Link 
                to="/team-rhythms"
                className="text-primary hover:text-primary/90 font-medium"
              >
                View Team Rhythms →
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Rhythm Visualizer</CardTitle>
              <CardDescription>Analyze meeting time distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Visualize your team's meeting time allocation with interactive charts. See monthly, quarterly, and annual breakdowns by category.
              </p>
              <Link 
                to="/visualizer"
                className="text-primary hover:text-primary/90 font-medium"
              >
                Open Visualizer →
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Rhythm Builder</CardTitle>
              <CardDescription>Create custom meeting rhythms</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Build your team's meeting rhythm from scratch or use our templates. Customize meeting details, attendees, and frequencies to match your needs.
              </p>
              <Link 
                to="/builder"
                className="text-primary hover:text-primary/90 font-medium"
              >
                Start Building →
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started Guide */}
        <Card className="mt-12 border-border">
          <CardHeader>
            <CardTitle>How to Use Rhythm Builder</CardTitle>
            <CardDescription>Follow these steps to create your team's meeting rhythm</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
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
