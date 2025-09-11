// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
// import { Badge } from "../components/ui/badge"
// import { Avatar, AvatarFallback } from "../components/ui/avatar"
// import { Trophy, Medal, Award, Crown, Coins } from "lucide-react"
// import { useAuth } from "../contexts/AuthContext"
// import { mockLeaderboard } from "../lib/mock-data"

// export default function LeaderboardPage() {
//   const { user } = useAuth()

//   const getRankIcon = (rank: number) => {
//     switch (rank) {
//       case 1:
//         return <Crown className="h-6 w-6 text-yellow-500" />
//       case 2:
//         return <Medal className="h-6 w-6 text-gray-400" />
//       case 3:
//         return <Award className="h-6 w-6 text-amber-600" />
//       default:
//         return <span className="text-lg font-bold text-gray-600">#{rank}</span>
//     }
//   }

//   const getRankColor = (rank: number) => {
//     switch (rank) {
//       case 1:
//         return "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200"
//       case 2:
//         return "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200"
//       case 3:
//         return "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200"
//       default:
//         return "bg-white border-green-200"
//     }
//   }

//   const currentUserRank = mockLeaderboard.findIndex((u) => u.id === user?.id) + 1

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-green-800 mb-2 flex items-center">
//           <Trophy className="h-8 w-8 mr-3" />
//           Leaderboard
//         </h1>
//         <p className="text-green-600">See how you rank among fellow eco-coders in the community!</p>
//       </div>

//       {/* Current User Highlight */}
//       {user && (
//         <Card className="mb-8 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-4">
//                 <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
//                   {getRankIcon(currentUserRank)}
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-bold text-green-800">{user.username}</h2>
//                   <p className="text-green-600">Your current ranking</p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <div className="flex items-center space-x-2">
//                   <Coins className="h-5 w-5 text-green-600" />
//                   <span className="text-2xl font-bold text-green-800">{user.ecoCredits}</span>
//                 </div>
//                 <p className="text-sm text-green-600">eco-credits</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Leaderboard */}
//       <Card className="border-green-200">
//         <CardHeader>
//           <CardTitle className="text-green-800">Top Eco-Coders</CardTitle>
//           <CardDescription>
//             Rankings based on total eco-credits earned through coding and outdoor activities
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {mockLeaderboard.map((leaderUser, index) => {
//               const rank = index + 1
//               const isCurrentUser = leaderUser.id === user?.id

//               return (
//                 <div
//                   key={leaderUser.id}
//                   className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${getRankColor(
//                     rank,
//                   )} ${isCurrentUser ? "ring-2 ring-green-300" : ""}`}
//                 >
//                   <div className="flex items-center space-x-4">
//                     <div className="flex items-center justify-center w-12 h-12">{getRankIcon(rank)}</div>

//                     <Avatar className="h-10 w-10">
//                       <AvatarFallback className="bg-green-100 text-green-800">
//                         {leaderUser.username.slice(0, 2).toUpperCase()}
//                       </AvatarFallback>
//                     </Avatar>

//                     <div>
//                       <h3 className={`font-semibold ${isCurrentUser ? "text-green-800" : "text-gray-800"}`}>
//                         {leaderUser.username}
//                         {isCurrentUser && <Badge className="ml-2 bg-green-100 text-green-800">You</Badge>}
//                       </h3>
//                       <p className="text-sm text-gray-600">Rank #{rank}</p>
//                     </div>
//                   </div>

//                   <div className="text-right">
//                     <div className="flex items-center space-x-2">
//                       <Coins className="h-5 w-5 text-green-600" />
//                       <span className="text-xl font-bold text-green-800">{leaderUser.ecoCredits}</span>
//                     </div>
//                     <p className="text-sm text-green-600">eco-credits</p>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Achievement Badges */}
//       <Card className="mt-8 border-green-200">
//         <CardHeader>
//           <CardTitle className="text-green-800">Achievement System</CardTitle>
//           <CardDescription>Earn badges for reaching milestones in your eco-coding journey</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid md:grid-cols-3 gap-4">
//             <div className="text-center p-4 bg-green-50 rounded-lg">
//               <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
//               <h4 className="font-medium text-green-800">First Steps</h4>
//               <p className="text-sm text-green-600">Complete your first outdoor activity</p>
//             </div>
//             <div className="text-center p-4 bg-blue-50 rounded-lg">
//               <Trophy className="h-8 w-8 text-blue-600 mx-auto mb-2" />
//               <h4 className="font-medium text-blue-800">Code Warrior</h4>
//               <p className="text-sm text-blue-600">Log 100+ coding hours</p>
//             </div>
//             <div className="text-center p-4 bg-emerald-50 rounded-lg">
//               <Medal className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
//               <h4 className="font-medium text-emerald-800">Nature Lover</h4>
//               <p className="text-sm text-emerald-600">Complete 10 outdoor activities</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }