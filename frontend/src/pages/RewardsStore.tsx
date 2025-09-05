import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Gift, 
  Leaf, 
  Trees,
  Sprout,
  Award,
  Coffee,
  ShoppingBag,
  Heart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RewardsStore = () => {
  const { toast } = useToast();

  const handleRedeem = (rewardName: string, cost: number) => {
    toast({
      title: "Reward redeemed!",
      description: `You've redeemed ${rewardName} for ${cost} eco-credits`,
    });
  };

  const rewards = [
    {
      id: 1,
      name: "Plant a Tree",
      description: "We'll plant a real tree in your name in a reforestation project",
      cost: 50,
      category: "Environmental",
      icon: <Trees className="w-6 h-6" />,
      available: true,
      popular: true
    },
    {
      id: 2,
      name: "Eco Coffee Mug",
      description: "Sustainable bamboo coffee mug with Code-to-Nature branding",
      cost: 30,
      category: "Merchandise",
      icon: <Coffee className="w-6 h-6" />,
      available: true,
      popular: false
    },
    {
      id: 3,
      name: "Seed Packet Kit",
      description: "Native wildflower seed packet to plant in your local area",
      cost: 15,
      category: "Environmental",
      icon: <Sprout className="w-6 h-6" />,
      available: true,
      popular: false
    },
    {
      id: 4,
      name: "Carbon Offset 10kg",
      description: "Offset 10kg of CO2 through verified carbon reduction projects",
      cost: 25,
      category: "Environmental",
      icon: <Leaf className="w-6 h-6" />,
      available: true,
      popular: true
    },
    {
      id: 5,
      name: "Eco Tote Bag",
      description: "Organic cotton tote bag perfect for grocery shopping",
      cost: 20,
      category: "Merchandise",
      icon: <ShoppingBag className="w-6 h-6" />,
      available: true,
      popular: false
    },
    {
      id: 6,
      name: "Wildlife Protection",
      description: "Donate to wildlife conservation efforts in your region",
      cost: 40,
      category: "Environmental",
      icon: <Heart className="w-6 h-6" />,
      available: false,
      popular: false
    },
    {
      id: 7,
      name: "Eco Achievement Badge",
      description: "Special digital badge for your developer profile",
      cost: 10,
      category: "Digital",
      icon: <Award className="w-6 h-6" />,
      available: true,
      popular: false
    },
    {
      id: 8,
      name: "Premium Tree",
      description: "Plant a premium native tree species with GPS tracking",
      cost: 100,
      category: "Environmental",
      icon: <Trees className="w-6 h-6" />,
      available: true,
      popular: false
    }
  ];

  const userCredits = 247; // This would come from user state

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Environmental":
        return "bg-success/20 text-success";
      case "Merchandise":
        return "bg-primary/20 text-primary";
      case "Digital":
        return "bg-accent/20 text-accent";
      default:
        return "bg-muted/20 text-muted-foreground";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-warning to-accent rounded-lg flex items-center justify-center">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Rewards Store</h1>
            <p className="text-muted-foreground">Redeem your eco-credits for sustainable rewards</p>
          </div>
        </div>
        
        <Card className="bg-gradient-to-r from-primary to-success text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5" />
              <div>
                <p className="text-sm opacity-90">Your Credits</p>
                <p className="text-2xl font-bold">{userCredits}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <Card 
            key={reward.id} 
            className={`relative overflow-hidden border-2 transition-all duration-300 hover:shadow-lg ${
              !reward.available ? 'opacity-60' : 'hover:-translate-y-1'
            }`}
          >
            {reward.popular && (
              <div className="absolute top-2 right-2 z-10">
                <Badge className="bg-warning text-warning-foreground">
                  Popular
                </Badge>
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-transparent" />
            
            <CardHeader className="relative">
              <div className="flex items-start justify-between">
                <div className="text-primary">
                  {reward.icon}
                </div>
                <Badge className={getCategoryColor(reward.category)}>
                  {reward.category}
                </Badge>
              </div>
              <CardTitle className="text-lg">{reward.name}</CardTitle>
              <CardDescription className="text-sm">
                {reward.description}
              </CardDescription>
            </CardHeader>
            
            <CardFooter className="relative pt-0">
              <div className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-primary" />
                    <span className="text-xl font-bold text-primary">
                      {reward.cost}
                    </span>
                    <span className="text-sm text-muted-foreground">credits</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleRedeem(reward.name, reward.cost)}
                  disabled={!reward.available || userCredits < reward.cost}
                  className="w-full"
                  variant={userCredits >= reward.cost && reward.available ? "default" : "secondary"}
                >
                  {!reward.available ? "Coming Soon" : 
                   userCredits < reward.cost ? "Insufficient Credits" : 
                   "Redeem"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Redemption History */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Redemptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { item: "Plant a Tree", date: "Jan 10, 2024", credits: -50 },
              { item: "Eco Coffee Mug", date: "Jan 5, 2024", credits: -30 },
              { item: "Seed Packet Kit", date: "Dec 28, 2023", credits: -15 },
            ].map((redemption, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">{redemption.item}</p>
                  <p className="text-sm text-muted-foreground">{redemption.date}</p>
                </div>
                <div className="text-destructive font-semibold">
                  {redemption.credits} credits
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardsStore;