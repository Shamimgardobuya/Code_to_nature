import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Gift,
  Coins,
  TreePine,
  Package,
  Calendar,
  Leaf,
  Trees,
  Sprout,
  Award,
  Coffee,
  ShoppingBag,
  Heart,
  Loader2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";
import { rewardService } from "../services/rewards";
import type { Reward, Redemption } from "../services/rewards";
// import { getProfile } from "../services/api";

// Icon mapping
const iconMap: { [key: string]: React.JSX.Element } = {
  tree: <Trees className="w-6 h-6" />,
  coffee: <Coffee className="w-6 h-6" />,
  sprout: <Sprout className="w-6 h-6" />,
  leaf: <Leaf className="w-6 h-6" />,
  shoppingbag: <ShoppingBag className="w-6 h-6" />,
  heart: <Heart className="w-6 h-6" />,
  award: <Award className="w-6 h-6" />,
  gift: <Gift className="w-6 h-6" />,
  package: <Package className="w-6 h-6" />,
  default: <Gift className="w-6 h-6" />,
};

export default function RewardsStore() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [isRedeeming, setIsRedeeming] = useState<string | null>(null);
  const [loading, setLoading] = useState({
    rewards: true,
    redemptions: true,
    profile: true,
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) rewardService.updateToken(token);

    fetchRewards();
    fetchRedemptions();
  }, []);



  // const fetchProfile = async () => {
  //   try {
  //     const profileData = await getProfile();
  //     // setUser(mapToProfile(profileData));
  //     setUser(profileData.data)
  //   } catch (error: any) {
  //     console.error("Error fetching profile:", error);
  //     toast({
  //       title: "Error",
  //       description: error.message || "Failed to load profile details.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setLoading((prev) => ({ ...prev, profile: false }));
  //   }
  // };

  const fetchRewards = async () => {
    try {
      const data = await rewardService.getAllRewards();
      setRewards(data);
    } catch (error: any) {
      console.error("Error fetching rewards:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load rewards.",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, rewards: false }));
    }
  };

  const fetchRedemptions = async () => {
    try {
      const data = await rewardService.getRedemptions();
      setRedemptions(data);
    } catch (error: any) {
      console.error("Error fetching redemptions:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load redemption history.",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, redemptions: false }));
    }
  };

  const handleRedeem = async (reward: Reward) => {
    if (!user || user.eco_credits < reward.cost || !reward.available) return;

    setIsRedeeming(reward.id);

    try {
      const data = await rewardService.redeemReward(parseInt(reward.id));
      const newRedemption: Redemption = data.redemption;
      setRedemptions([newRedemption, ...redemptions]);

      window.location.href = "/rewards";

      toast({
        title: "Reward redeemed!",
        description:
          data.message ||
          `You've successfully redeemed ${reward.name} for ${reward.cost} eco-credits.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to redeem reward. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRedeeming(null);
    }
  };

  if (!user) return <div>Loading user data...</div>;

  // Filter rewards by category
  const environmentalRewards = rewards.filter((r) => r.category_display === "Environmental");
  const merchandiseRewards = rewards.filter((r) => r.category_display === "Merchandise");
  const digitalRewards = rewards.filter((r) => r.category_display === "Digital");

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Environmental":
        return "bg-green-100 text-green-800";
      case "Merchandise":
        return "bg-blue-100 text-blue-800";
      case "Digital":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const RewardCard = ({ reward }: { reward: Reward }) => {
    const canAfford = user && user.eco_credits >= reward.cost && reward.available;
    const isCurrentlyRedeeming = isRedeeming === reward.id;
    const IconComponent = iconMap[reward.icon] || iconMap.default;

    return (
      <Card className={`border-2 transition-all ${canAfford ? "border-green-200 hover:border-green-300" : "border-gray-200 opacity-80"}`}>
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 rounded-full bg-green-50 text-green-700">{IconComponent}</div>
            <div className="flex flex-col items-end gap-1">
              <Badge className={`${getCategoryColor(reward.category_display)} text-xs px-2 py-1`}>
                {reward.category_display}
              </Badge>
              {reward.popular && <Badge className="bg-amber-100 text-amber-800 text-xs px-2 py-1">Popular</Badge>}
            </div>
          </div>
          <CardTitle className="text-lg text-green-800 leading-tight">{reward.name}</CardTitle>
          <CardDescription className="mt-2 text-sm leading-relaxed">{reward.description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <Badge variant={canAfford ? "default" : "secondary"} className={`${canAfford ? "bg-green-100 text-green-800" : ""} text-sm px-3 py-1 w-fit`}>
              {reward.cost} credits
            </Badge>
            <Button onClick={() => handleRedeem(reward)} disabled={!canAfford || isCurrentlyRedeeming} className={`${canAfford ? "bg-green-600 hover:bg-green-700" : ""} w-full sm:w-auto text-sm px-4 py-2`} variant={canAfford ? "default" : "secondary"} size="sm">
              {isCurrentlyRedeeming ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</> : !reward.available ? "Out of Stock" : canAfford ? "Redeem Now" : "Insufficient Credits"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-2 flex items-center">
          <Gift className="h-8 w-8 mr-3" />
          Rewards Store
        </h1>
        <p className="text-green-600 text-sm sm:text-base">
          Use your eco-credits to make a positive impact or get eco-friendly
          products.
        </p>
      </div>

      {/* Credits Display */}
      <Card className="mb-8 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-green-800 flex items-center">
                <Coins className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                {user.eco_credits} Eco-Credits Available
              </h2>
              <p className="text-green-600 text-sm sm:text-base">
                Ready to spend on meaningful rewards
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-700">Locked Credits</p>
              <p className="text-lg sm:text-xl font-semibold text-orange-600">
                {user.locked_credits || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="environmental" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger
            value="environmental"
            className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 p-2 sm:p-3 text-xs sm:text-sm"
          >
            <TreePine className="h-4 w-4" />
            <span>Environmental</span>
          </TabsTrigger>
          <TabsTrigger
            value="merchandise"
            className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 p-2 sm:p-3 text-xs sm:text-sm"
          >
            <Package className="h-4 w-4" />
            <span>Merchandise</span>
          </TabsTrigger>
          <TabsTrigger
            value="digital"
            className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 p-2 sm:p-3 text-xs sm:text-sm"
          >
            <Award className="h-4 w-4" />
            <span>Digital</span>
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 p-2 sm:p-3 text-xs sm:text-sm"
          >
            <Calendar className="h-4 w-4" />
            <span>History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="environmental" className="space-y-4 sm:space-y-6">
          {loading.rewards ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {environmentalRewards.map((reward) => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="merchandise" className="space-y-4 sm:space-y-6">
          {loading.rewards ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {merchandiseRewards.map((reward) => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="digital" className="space-y-4 sm:space-y-6">
          {loading.rewards ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {digitalRewards.map((reward) => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="border-green-200">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-green-800 text-lg sm:text-xl">
                Redemption History
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Your past reward redemptions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {loading.redemptions ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                </div>
              ) : redemptions &&
                (Array.isArray(redemptions)
                  ? redemptions.length > 0
                  : !!redemptions) ? (
                <div className="space-y-3 sm:space-y-4">
                  {(Array.isArray(redemptions)
                    ? redemptions
                    : [redemptions]
                  ).map((redemption) => {
                    if (!redemption) return null; // skip undefined

                    const IconComponent =
                      redemption.reward_icon && iconMap[redemption.reward_icon]
                        ? iconMap[redemption.reward_icon]
                        : iconMap.default;

                    return (
                      <div
                        key={redemption.id}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-3 sm:p-4 bg-green-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          {IconComponent}
                          <div>
                            <h3 className="font-medium text-green-800 text-sm sm:text-base">
                              {redemption.reward_name || "Unknown Reward"}
                            </h3>
                            <p className="text-xs sm:text-sm text-green-600">
                              Redeemed on{" "}
                              {redemption.date
                                ? new Date(redemption.date).toLocaleDateString()
                                : "Unknown Date"}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 w-fit text-xs sm:text-sm">
                          -{redemption.cost ?? 0} credits
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <Gift className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <p className="text-gray-600 text-sm sm:text-base">
                    No redemptions yet
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Start redeeming rewards to see your history here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}