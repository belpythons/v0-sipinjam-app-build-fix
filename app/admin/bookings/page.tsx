"use client"

import { useState, useEffect } from "react"
import { Calendar, FileText, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { BookingTabs } from "@/components/admin/booking-tabs"
import { BookingDetailModal } from "@/components/user/booking-detail-modal"
import { ApprovalModal } from "@/components/admin/approval-modal"
import { getBookings, saveBookings } from "@/lib/data-manager"
import type { Booking } from "@/lib/types"

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [approvalModalOpen, setApprovalModalOpen] = useState(false)

  useEffect(() => {
    const loadedBookings = getBookings()
    setBookings(loadedBookings)
  }, [])

  const handleSaveBookings = (updatedBookings: Booking[]) => {
    setBookings(updatedBookings)
    saveBookings(updatedBookings)
  }

  const handleApprove = (bookingId: string, notes?: string) => {
    const updatedBookings = bookings.map((booking) => {
      if (booking.id === bookingId) {
        return {
          ...booking,
          status: "approved" as const,
          approvedBy: "admin-1",
          approvedAt: new Date(),
          notes: notes || booking.notes,
        }
      }
      return booking
    })

    handleSaveBookings(updatedBookings)
    toast.success("Peminjaman disetujui", {
      description: "Notifikasi email telah dikirim ke peminjam",
    })
  }

  const handleReject = (bookingId: string, reason: string) => {
    const updatedBookings = bookings.map((booking) => {
      if (booking.id === bookingId) {
        return {
          ...booking,
          status: "rejected" as const,
          rejectionReason: reason,
        }
      }
      return booking
    })

    handleSaveBookings(updatedBookings)
    toast.error("Peminjaman ditolak", {
      description: "Notifikasi email telah dikirim ke peminjam",
    })
  }

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setDetailModalOpen(true)
  }

  const handleQuickReview = (booking: Booking) => {
    setSelectedBooking(booking)
    setApprovalModalOpen(true)
  }

  const pendingCount = bookings.filter((b) => b.status === "pending").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Kelola Peminjaman</h1>
        <p className="mt-2 text-muted-foreground">Kelola persetujuan dan pantau status peminjaman ruangan dan barang</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 hover:bg-accent/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-yellow-100 p-3 dark:bg-yellow-900">
              <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Menunggu Persetujuan</p>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 hover:bg-accent/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
              <Calendar className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Aktif</p>
              <p className="text-2xl font-bold">
                {bookings.filter((b) => b.status === "approved" || b.status === "active").length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 hover:bg-accent/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
              <FileText className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Peminjaman</p>
              <p className="text-2xl font-bold">{bookings.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <BookingTabs
        bookings={bookings}
        onApprove={handleApprove}
        onReject={handleReject}
        onViewDetails={handleViewDetails}
      />

      {/* Modals */}
      <BookingDetailModal open={detailModalOpen} onOpenChange={setDetailModalOpen} booking={selectedBooking} />

      <ApprovalModal
        open={approvalModalOpen}
        onOpenChange={setApprovalModalOpen}
        booking={selectedBooking}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  )
}
