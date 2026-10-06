import {
  Briefcase,
  Calendar,
  CalendarDays,
  GraduationCap,
  Landmark,
  Mail,
  MapPin,
  Rocket,
  Shield,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react'

/** Maps the `icon` select values used in block configs to lucide icons. */
export const ICONS: Record<string, LucideIcon> = {
  shield: Shield,
  landmark: Landmark,
  briefcase: Briefcase,
  graduationCap: GraduationCap,
  calendar: CalendarDays,
  calendarPlain: Calendar,
  sparkles: Sparkles,
  mapPin: MapPin,
  mail: Mail,
  users: Users,
  rocket: Rocket,
}

export const iconFor = (name?: string | null): LucideIcon => (name && ICONS[name]) || Shield
