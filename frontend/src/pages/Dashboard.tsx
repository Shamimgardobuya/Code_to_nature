import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import EcoCard from "../components/EcoCard";
import { useAuth } from "../contexts/AuthContext";
import {
  Leaf,
  Code,
  Clock,
  MapPin,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-nature-coding.jpg";

const Dashboard = () => {
  const { user } = useAuth();
  // console.log("user: ", user)

  if (!user) return null;
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={heroImage}
          alt="Coding in nature"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-success/60" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="text-white max-w-2xl">
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {user.github_username}!
              </h1>
              <p className="text-lg text-white/90">
                Continue your eco-coding journey and make a positive
                environmental impact.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <EcoCard
            title="Total Eco-Credits"
            value={user.eco_credits}
            subtitle="+23 this week"
            icon={<Leaf className="w-5 h-5" />}
            trend="up"
          />
          <EcoCard
            title="Locked Credits"
            value={user.locked_credits}
            subtitle="Awaiting verification"
            icon={<Clock className="w-5 h-5" />}
            trend="neutral"
          />
          {/* <EcoCard
            title="Coding Hours"
            value={`${user.codingHours}h`}
            subtitle="This month"
            icon={<Code className="w-5 h-5" />}
            trend="up"
          />
          <EcoCard
            title="Leaderboard Rank"
            value={`#${user.rank} `}
            subtitle="Top 15%"
            icon={<Trophy className="w-5 h-5" />}
            trend="up"
          /> */}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                Log Coding Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Track your development work to earn locked eco-credits.
              </p>
              <Link to="/coding">
                <Button className="w-full" size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Coding Hours
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-success" />
                Submit Outdoor Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Verify your nature time to unlock your earned credits.
              </p>
              <Link to="/activities">
                <Button variant="secondary" className="w-full" size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Activity
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;