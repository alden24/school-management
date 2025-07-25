import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

// Komponen untuk satu kartu mata pelajaran
const JadwalCard = ({ jadwal }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <p className="font-bold text-indigo-700">{jadwal.mata_pelajaran.nama_mapel}</p>
        <p className="text-sm text-gray-600">{jadwal.guru.nama_lengkap}</p>
        <p className="text-sm text-gray-500 mt-2 font-mono">{jadwal.jam_mulai.substring(0, 5)} - {jadwal.jam_selesai.substring(0, 5)}</p>
    </div>
);

export default function Index({ auth, jadwalPerHari }) {
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    return (
        <AuthenticatedLayout
            header="Jadwal Pelajaran Saya"
        >
            <Head title="Jadwal Saya" />

            <div className="space-y-8">
                {Object.keys(jadwalPerHari).length > 0 ? (
                    days.map(day => (
                        jadwalPerHari[day] && (
                            <div key={day}>
                                <h2 className="text-xl font-bold text-gray-800 mb-3">{day}</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {jadwalPerHari[day].map(jadwal => (
                                        <JadwalCard key={jadwal.id} jadwal={jadwal} />
                                    ))}
                                </div>
                            </div>
                        )
                    ))
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                        <h3 className="text-lg font-semibold text-gray-700">Tidak ada jadwal</h3>
                        <p className="text-gray-500 mt-1">Jadwal pelajaran untuk Anda belum diatur. Silakan hubungi administrator.</p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
