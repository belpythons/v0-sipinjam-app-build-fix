import { HeroSection } from "@/components/user/hero-section"
import { RulesSection } from "@/components/user/rules-section"
import { RoomCarousel } from "@/components/user/room-carousel"
import { EquipmentCarousel } from "@/components/user/equipment-carousel"

export default function UserDashboard() {
  return (
    <div className="space-y-8 pb-8">
      <HeroSection />

      <div className="container space-y-8">
        <RoomCarousel />
        <EquipmentCarousel />
        <RulesSection />
      </div>
    </div>
  )
}
