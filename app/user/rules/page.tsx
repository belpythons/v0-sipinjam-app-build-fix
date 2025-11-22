import { RulesList } from "@/components/user/rules-list"
import { AcademicCalendar } from "@/components/user/academic-calendar"
import { AlertTriangle, BookOpen } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function RulesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Tata Tertib & Kalender</h1>
        <p className="text-muted-foreground mt-2">Peraturan peminjaman dan kalender akademik kampus</p>
      </div>

      <Alert>
        <BookOpen className="h-4 w-4" />
        <AlertTitle>Informasi Penting</AlertTitle>
        <AlertDescription>
          Harap membaca dan memahami semua peraturan sebelum melakukan peminjaman. Pelanggaran akan dikenakan sanksi
          sesuai ketentuan yang berlaku.
        </AlertDescription>
      </Alert>

      <div>
        <h2 className="text-2xl font-bold mb-6">Peraturan Peminjaman</h2>
        <RulesList />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Kalender Akademik</h2>
        <AcademicCalendar />
      </div>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Sanksi Pelanggaran</AlertTitle>
        <AlertDescription>
          Pelanggaran berulang dapat mengakibatkan suspend atau blacklist permanen dari sistem peminjaman. Pastikan
          untuk mengembalikan barang tepat waktu dan dalam kondisi baik.
        </AlertDescription>
      </Alert>
    </div>
  )
}
