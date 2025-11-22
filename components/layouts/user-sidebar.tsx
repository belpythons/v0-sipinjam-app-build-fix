"use client"

import { Home, Calendar, Package, DoorOpen, BookOpen, Menu, X, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getUserSession, clearUserSession } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/user/dashboard", icon: Home },
  { name: "Riwayat Peminjaman", href: "/user/bookings", icon: Calendar },
  { name: "Ruangan", href: "/user/rooms", icon: DoorOpen },
  { name: "Barang", href: "/user/equipment", icon: Package },
  { name: "Tata Tertib", href: "/user/rules", icon: BookOpen },
]

export function UserSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const user = getUserSession()
    if (user) {
      setUserName(user.name)
      setUserEmail(user.email)
    }
  }, [])

  const handleLogout = () => {
    clearUserSession()
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari sistem",
    })
    router.push("/login")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      {/* Mobile menu button - Increased padding for better touch targets on mobile */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-3 left-3 z-50 lg:hidden bg-[var(--user-primary)] text-white p-2.5 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar - Reduced width on mobile for better usability (w-56 on mobile, w-64 on desktop) */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-[var(--user-primary-dark)] to-[var(--user-primary)] text-white transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col",
          "w-56 sm:w-60 lg:w-64",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="User navigation sidebar"
      >
        {/* Header with Logo - Updated with SD logo and responsive spacing */}
        <div className="flex h-14 sm:h-16 items-center justify-center border-b border-white/10 flex-shrink-0 px-2 sm:px-4">
          <div className="flex items-center gap-2 min-w-0">
            <Image src="/logo-sd.png" alt="SIPINJAM Logo" width={32} height={32} className="rounded-lg flex-shrink-0" />
            <h1 className="text-lg sm:text-2xl font-bold truncate">SIPINJAM</h1>
          </div>
        </div>

        {/* User Profile Section - Reduced padding on mobile for better spacing */}
        <div className="border-b border-white/10 p-2 sm:p-4 flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 hover:bg-white/10 transition-colors">
                <Avatar className="h-9 sm:h-10 w-9 sm:w-10 border-2 border-white/20 flex-shrink-0">
                  <AvatarFallback className="bg-blue-600 text-white font-semibold text-xs sm:text-sm">
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs sm:text-sm font-semibold text-white truncate">{userName}</p>
                  <p className="text-xs text-white/70 truncate">{userEmail}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/user/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Pengaturan</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Navigation - Optimized text size and spacing for mobile */}
        <nav className="flex-1 space-y-1 px-2 sm:px-3 py-3 sm:py-4 overflow-y-auto" aria-label="Main navigation">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/20 text-white shadow-lg scale-105"
                    : "text-white/80 hover:bg-white/10 hover:text-white hover:scale-105",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon className="h-4 sm:h-5 w-4 sm:w-5 flex-shrink-0" aria-hidden="true" />
                <span className="truncate">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout Button - Reduced padding on mobile */}
        <div className="border-t border-white/10 p-2 sm:p-4 flex-shrink-0">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-xs sm:text-sm text-white hover:bg-white/10 hover:text-white px-2 sm:px-3"
          >
            <LogOut className="mr-2 h-4 sm:h-5 w-4 sm:w-5 flex-shrink-0" />
            <span className="truncate">Keluar</span>
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
