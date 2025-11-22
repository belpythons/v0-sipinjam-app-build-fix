"use client"

import { format, isValid } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { Calendar, Clock, User, Package, DoorOpen, FileText, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Booking } from "@/lib/types"

interface BookingDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  booking: Booking | null
}

function safeFormatDate(date: Date | string | undefined, formatStr: string): string {
  if (!date) return "Invalid Date"
  const dateObj = typeof date === "string" ? new Date(date) : date
  if (!isValid(dateObj)) return "Invalid Date"
  return format(dateObj, formatStr, { locale: localeId })
}

export function BookingDetailModal({ open, onOpenChange, booking }: BookingDetailModalProps) {
  if (!booking) return null

  const getStatusIcon = () => {
    switch (booking.status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "pending":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      default:
        return <FileText className="h-5 w-5 text-blue-600" />
    }
  }

  const getStatusBadge = (status: Booking["status"]) => {
    const variants: Record<
      Booking["status"],
      { variant: "default" | "secondary" | "destructive" | "outline"; label: string }
    > = {
      pending: { variant: "secondary", label: "Menunggu Persetujuan" },
      approved: { variant: "default", label: "Disetujui" },
      rejected: { variant: "destructive", label: "Ditolak" },
      active: { variant: "default", label: "Sedang Berlangsung" },
      completed: { variant: "outline", label: "Selesai" },
      cancelled: { variant: "outline", label: "Dibatalkan" },
    }
    return variants[status]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Detail Peminjaman
          </DialogTitle>
          <DialogDescription>ID Peminjaman: {booking.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between rounded-lg bg-muted p-4">
            <span className="text-sm font-medium">Status Peminjaman</span>
            <Badge variant={getStatusBadge(booking.status).variant}>{getStatusBadge(booking.status).label}</Badge>
          </div>

          <Separator />

          {/* Item Info */}
          <div className="space-y-3">
            <h3 className="font-semibold">Informasi Item</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                {booking.type === "room" ? (
                  <DoorOpen className="mt-1 h-5 w-5 text-primary" />
                ) : (
                  <Package className="mt-1 h-5 w-5 text-primary" />
                )}
                <div>
                  <p className="text-sm font-medium">{booking.type === "room" ? "Ruangan" : "Barang"}</p>
                  <p className="text-sm text-muted-foreground">{booking.itemName}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Time Info */}
          <div className="space-y-3">
            <h3 className="font-semibold">Waktu Peminjaman</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <Calendar className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Tanggal Mulai</p>
                  <p className="text-sm text-muted-foreground">{safeFormatDate(booking.startDate, "dd MMMM yyyy")}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Waktu Mulai</p>
                  <p className="text-sm text-muted-foreground">{safeFormatDate(booking.startDate, "HH:mm")} WIB</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Tanggal Selesai</p>
                  <p className="text-sm text-muted-foreground">{safeFormatDate(booking.endDate, "dd MMMM yyyy")}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Waktu Selesai</p>
                  <p className="text-sm text-muted-foreground">{safeFormatDate(booking.endDate, "HH:mm")} WIB</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Purpose */}
          <div className="space-y-3">
            <h3 className="font-semibold">Tujuan Peminjaman</h3>
            <p className="text-sm text-muted-foreground">{booking.purpose}</p>
          </div>

          {booking.notes && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold">Catatan</h3>
                <p className="text-sm text-muted-foreground">{booking.notes}</p>
              </div>
            </>
          )}

          <Separator />

          {/* Submitter Info */}
          <div className="space-y-3">
            <h3 className="font-semibold">Informasi Peminjam</h3>
            <div className="flex items-start gap-3">
              <User className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">{booking.userName}</p>
                <p className="text-sm text-muted-foreground">
                  Diajukan pada {safeFormatDate(booking.createdAt, "dd MMMM yyyy, HH:mm")} WIB
                </p>
              </div>
            </div>
          </div>

          {/* Approval/Rejection Info */}
          {booking.status === "approved" && booking.approvedAt && (
            <>
              <Separator />
              <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950">
                <h3 className="font-semibold text-green-900 dark:text-green-100">Informasi Persetujuan</h3>
                <p className="mt-2 text-sm text-green-800 dark:text-green-200">
                  Disetujui oleh Admin pada {safeFormatDate(booking.approvedAt, "dd MMMM yyyy, HH:mm")} WIB
                </p>
              </div>
            </>
          )}

          {booking.status === "rejected" && booking.rejectionReason && (
            <>
              <Separator />
              <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950">
                <h3 className="font-semibold text-red-900 dark:text-red-100">Alasan Penolakan</h3>
                <p className="mt-2 text-sm text-red-800 dark:text-red-200">{booking.rejectionReason}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
