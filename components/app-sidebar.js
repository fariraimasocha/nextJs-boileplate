"use client"

import { cn } from "@/lib/utils"
import { AreaChartIcon as ChartArea, Code, UsersRound } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: ChartArea,
  },
  {
    title: "Employees",
    url: "/dashboard/employees",
    icon: UsersRound,
  },
]

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/auth/signIn")
  }

  const handleProfile = () => {
    router.push("/dashboard/profile")
  }

  const getInitials = () => {
    if (!session?.user?.name) return "N"
    return session.user.name.charAt(0).toUpperCase()
  }

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-6 border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Code className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold tracking-tight text-sidebar-foreground">SlipSendr</h1>
            <p className="text-xs text-sidebar-foreground/70">Payslip App</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="py-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <a
                    href={item.url}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      pathname === item.url && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </a>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-auto w-full justify-start gap-3 px-3 py-2">
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary/10 text-primary">{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-sm font-medium">{session?.user?.name}</span>
                <span className="text-xs text-muted-foreground">View profile</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[--radix-popper-anchor-width]">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfile}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

