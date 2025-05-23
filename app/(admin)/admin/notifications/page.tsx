// "use client"

// import { motion } from "framer-motion"
// import { Bell, Calendar, ChevronRight, X, Check, AlertCircle, Info } from "lucide-react"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import useSWR from 'swr'

// interface Notification {
//   id: string
//   title: string
//   message: string
//   type: 'info' | 'success' | 'warning' | 'error'
//   date: string
//   isRead: boolean
// }

// const fetcher = async (url: string) => {
//   const res = await fetch(url)
//   const data = await res.json()
//   return data
// }

// export default function NotificationsPage() {
//   const [activeTab, setActiveTab] = useState("all")
//   const { data: notifications, error, mutate } = useSWR<Notification[]>('/api/admin/notifications', fetcher)

//   const markAsRead = async (id: string) => {
//     try {
//       await fetch(`/api/admin/notifications/${id}/read`, {
//         method: 'PUT'
//       })
//       mutate() // Refresh notifications
//     } catch (error) {
//       console.error('Error marking notification as read:', error)
//     }
//   }

//   const deleteNotification = async (id: string) => {
//     try {
//       await fetch(`/api/admin/notifications/${id}`, {
//         method: 'DELETE'
//       })
//       mutate() // Refresh notifications
//     } catch (error) {
//       console.error('Error deleting notification:', error)
//     }
//   }

//   const getNotificationIcon = (type: string) => {
//     switch (type) {
//       case 'success':
//         return <Check className="w-5 h-5 text-green-500" />
//       case 'warning':
//         return <AlertCircle className="w-5 h-5 text-yellow-500" />
//       case 'error':
//         return <X className="w-5 h-5 text-red-500" />
//       default:
//         return <Info className="w-5 h-5 text-blue-500" />
//     }
//   }

//   const getNotificationStyle = (type: string) => {
//     switch (type) {
//       case 'success':
//         return 'bg-green-50 border-green-200'
//       case 'warning':
//         return 'bg-yellow-50 border-yellow-200'
//       case 'error':
//         return 'bg-red-50 border-red-200'
//       default:
//         return 'bg-blue-50 border-blue-200'
//     }
//   }

//   if (error) return <div>Failed to load notifications</div>
//   if (!notifications) return <div>Loading...</div>

//   const unreadCount = notifications.filter(n => !n.isRead).length

//   return (
//     <div className="p-4 md:p-8 space-y-6">
//       {/* Header */}
//       <div className="flex flex-col gap-4 mb-6">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Notifications</h1>
//             {unreadCount > 0 && (
//               <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//                 {unreadCount} unread
//               </span>
//             )}
//           </div>
//         </div>
//         <div className="flex items-center gap-2 text-sm text-gray-500">
//           <span>Admin</span>
//           <ChevronRight className="h-4 w-4" />
//           <span>Notifications</span>
//         </div>
//       </div>

//       {/* Tabs */}
//       <Tabs defaultValue="all" className="w-full">
//         <TabsList className="mb-4">
//           <TabsTrigger value="all">All</TabsTrigger>
//           <TabsTrigger value="unread">Unread</TabsTrigger>
//         </TabsList>

//         <TabsContent value="all" className="space-y-4">
//           {notifications.map((notification) => (
//             <motion.div
//               key={notification.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className={`p-4 rounded-lg border ${getNotificationStyle(notification.type)} 
//                 ${!notification.isRead ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}
//             >
//               <div className="flex items-start justify-between gap-4">
//                 <div className="flex items-start gap-3">
//                   {getNotificationIcon(notification.type)}
//                   <div>
//                     <h3 className="font-semibold text-gray-900">{notification.title}</h3>
//                     <p className="text-gray-600 mt-1">{notification.message}</p>
//                     <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
//                       <Calendar className="w-4 h-4" />
//                       <span>{new Date(notification.date).toLocaleDateString()}</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   {!notification.isRead && (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => markAsRead(notification.id)}
//                       className="text-blue-600 hover:text-blue-700"
//                     >
//                       Mark as read
//                     </Button>
//                   )}
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => deleteNotification(notification.id)}
//                     className="text-gray-500 hover:text-gray-700"
//                   >
//                     <X className="w-4 h-4" />
//                   </Button>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </TabsContent>

//         <TabsContent value="unread" className="space-y-4">
//           {notifications.filter(n => !n.isRead).map((notification) => (
//             <motion.div
//               key={notification.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className={`p-4 rounded-lg border ${getNotificationStyle(notification.type)} ring-2 ring-blue-400 ring-opacity-50`}
//             >
//               <div className="flex items-start justify-between gap-4">
//                 <div className="flex items-start gap-3">
//                   {getNotificationIcon(notification.type)}
//                   <div>
//                     <h3 className="font-semibold text-gray-900">{notification.title}</h3>
//                     <p className="text-gray-600 mt-1">{notification.message}</p>
//                     <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
//                       <Calendar className="w-4 h-4" />
//                       <span>{new Date(notification.date).toLocaleDateString()}</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => markAsRead(notification.id)}
//                     className="text-blue-600 hover:text-blue-700"
//                   >
//                     Mark as read
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => deleteNotification(notification.id)}
//                     className="text-gray-500 hover:text-gray-700"
//                   >
//                     <X className="w-4 h-4" />
//                   </Button>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// } 