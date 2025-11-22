"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockAcademicCalendar } from "@/lib/mock-data"
import { CalendarDays, GraduationCap, PartyPopper } from "lucide-react"
import { format, isSameDay } from "date-fns"
import { id } from "date-fns/locale"

export function AcademicCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const eventsOnSelectedDate = selectedDate
    ? mockAcademicCalendar.filter((event) => isSameDay(event.date, selectedDate))
    : []

  const eventDates = mockAcademicCalendar.map((event) => event.date)

  const modifiers = {
    holiday: mockAcademicCalendar.filter((e) => e.type === "holiday").map((e) => e.date),
    exam: mockAcademicCalendar.filter((e) => e.type === "exam").map((e) => e.date),
    event: mockAcademicCalendar.filter((e) => e.type === "event").map((e) => e.date),
  }

  const modifiersClassNames = {
    holiday: "bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-100 font-semibold",
    exam: "bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-100 font-semibold",
    event: "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 font-semibold",
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "holiday":
        return <PartyPopper className="h-4 w-4" />
      case "exam":
        return <GraduationCap className="h-4 w-4" />
      case "event":
        return <CalendarDays className="h-4 w-4" />
      default:
        return <CalendarDays className="h-4 w-4" />
    }
  }

  const getEventBadgeVariant = (type: string) => {
    switch (type) {
      case "holiday":
        return "destructive"
      case "exam":
        return "default"
      case "event":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Kalender Akademik</h3>
          <p className="text-sm text-muted-foreground">Pilih tanggal untuk melihat detail acara</p>
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          locale={id}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          className="rounded-md border"
        />
      </Card>

      <div className="space-y-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {selectedDate ? format(selectedDate, "dd MMMM yyyy", { locale: id }) : "Pilih Tanggal"}
          </h3>

          {eventsOnSelectedDate.length > 0 ? (
            <div className="space-y-3">
              {eventsOnSelectedDate.map((event, index) => (
                <div key={index} className="flex items-start gap-3 rounded-lg border p-3">
                  <div className="mt-0.5">{getEventIcon(event.type)}</div>
                  <div className="flex-1">
                    <p className="font-medium">{event.title}</p>
                    <Badge variant={getEventBadgeVariant(event.type)} className="mt-1">
                      {event.type === "holiday" && "Libur"}
                      {event.type === "exam" && "Ujian"}
                      {event.type === "event" && "Acara"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Tidak ada acara pada tanggal ini</p>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Keterangan</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-red-100 dark:bg-red-900/30" />
              <span className="text-sm">Libur/Hari Besar</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-orange-100 dark:bg-orange-900/30" />
              <span className="text-sm">Periode Ujian</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-blue-100 dark:bg-blue-900/30" />
              <span className="text-sm">Acara Kampus</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
