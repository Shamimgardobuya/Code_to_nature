import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Trophy, 
  Medal, 
  Award,
  Leaf,
  TrendingUp,
  Users
} from "lucide-react";

const Leaderboard = () => {
  const currentUser = "johndoe"; // This would come from auth context
  
  const leaderboardData = [
    {
      rank: 1,
      username: "naturecoder",
      ecoCredits: 1247,
      activitiesCount: 45,
      codingHours: 156.5,
      trend: "up",
      badge: "Eco Champion"
    },
    {
      rank: 2,
      username: "greendev",
      ecoCredits: 1156,
      activitiesCount: 42,
      codingHours: 142.0,
      trend: "up",
      badge: "Forest Guardian"
    },
    {
      rank: 3,
      username: "trailblazer",
      ecoCredits: 987,
      activitiesCount: 38,
      codingHours: 128.5,
      trend: "down",
      badge: "Nature Explorer"
    },
    {
      rank: 4,
      username: "codecamper",
      ecoCredits: 876,
      activitiesCount: 35,
      codingHours: 115.0,
      trend: "up",
      badge: "Outdoor Enthusiast"
    },
    {
      rank: 5,
      username: "hikingdev",
      ecoCredits: 742,
      activitiesCount: 32,
      codingHours: 98.5,
      trend: "neutral",
      badge: "Trail Runner"
    },
    {
      rank: 6,
      username: "ecobuilder",
      ecoCredits: 698,
      activitiesCount: 29,
      codingHours: 89.0,
      trend: "up",
      badge: "Green Coder"
    },
    {
      rank: 7,
      username: "forestfull",
      ecoCredits: 654,
      activitiesCount: 28,
      codingHours: 85.5,
      trend: "down",
      badge: "Nature Lover"
    },
    {
      rank: 8,
      username: "wildheart",
      ecoCredits: 587,
      activitiesCount: 26,
      codingHours: 78.0,
      trend: "up",
      badge: "Adventure Seeker"
    },
    {
      rank: 9,
      username: "greenbyte",
      ecoCredits: 534,
      activitiesCount: 24,
      codingHours: 71.5,
      trend: "neutral",
      badge: "Eco Warrior"
    },
    {
      rank: 10,
      username: "outdoorcode",
      ecoCredits: 489,
      activitiesCount: 22,
      codingHours: 65.0,
      trend: "down",
      badge: "Fresh Air Fan"
    },
    {
      rank: 11,
      username: "mountaindev",
      ecoCredits: 445,
      activitiesCount: 21,
      codingHours: 58.5,
      trend: "up",
      badge: "Peak Performer"
    },
    {
      rank: 12,
      username: "johndoe",
      ecoCredits: 247,
      activitiesCount: 12,
      codingHours: 42.5,
      trend: "up",
      badge: "Nature Newbie",
      isCurrentUser: true
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-warning" />;
      case 2:
        return <Medal className="w-5 h-5 text-muted-foreground" />;
      case 3:
        return <Award className="w-5 h-5 text-warning/70" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-success";
      case "down":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const getTrendIcon = (trend: string) => {
    return <TrendingUp className={`w-3 h-3 ${trend === "down" ? "rotate-180" : ""} ${getTrendColor(trend)}`} />;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-warning to-primary rounded-lg flex items-center justify-center">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground">See how you rank among eco-conscious developers</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Participants</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Credits Generated</p>
                <p className="text-2xl font-bold">45,892</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Rank</p>
                <p className="text-2xl font-bold">#12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard Table */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Top Eco-Developers</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="space-y-2 p-6">
              {leaderboardData.map((user) => (
                <div 
                  key={user.rank}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all hover:bg-muted/50 ${
                    user.isCurrentUser ? 'bg-primary/10 border-2 border-primary/30' : 'bg-muted/20'
                  }`}
                >
                  {/* Rank */}
                  <div className="flex items-center justify-center w-8">
                    {getRankIcon(user.rank)}
                  </div>

                  {/* Avatar */}
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                      {user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold truncate">
                        {user.username}
                        {user.isCurrentUser && (
                          <span className="ml-2 text-primary text-sm">(You)</span>
                        )}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {user.badge}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>{user.activitiesCount} activities</span>
                      <span>{user.codingHours}h coded</span>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(user.trend)}
                        <span className="capitalize">{user.trend}</span>
                      </div>
                    </div>
                  </div>

                  {/* Credits */}
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-primary font-bold text-lg">
                      <Leaf className="w-4 h-4" />
                      {user.ecoCredits.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;