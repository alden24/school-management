import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

// --- Helper Components ---

// Komponen Ikon SVG
const Icon = ({ path, className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

// Kartu Statistik
const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className={`p-4 rounded-full ${color}`}>
            <Icon path={icon} className="w-7 h-7 text-white" />
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

// Komponen Daftar Aktivitas (Siswa Baru)
// PERBAIKAN: Berikan nilai default '[]' untuk prop 'items'
const ActivityList = ({ title, items = [], link }) => (
    <div className="bg-white p-6 rounded-xl shadow-md h-full">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <Link href={link} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">Lihat Semua</Link>
        </div>
        <div className="space-y-4">
            {items.length > 0 ? items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                    <img className="w-10 h-10 rounded-full object-cover" src={item.foto_url} alt={item.nama_lengkap} />
                    <div>
                        <p className="font-semibold text-gray-700">{item.nama_lengkap}</p>
                        <p className="text-xs text-gray-500">{item.kelas?.nama_kelas || 'Belum ada kelas'}</p>
                    </div>
                </div>
            )) : (
                <p className="text-sm text-gray-500">Tidak ada siswa baru yang ditambahkan.</p>
            )}
        </div>
    </div>
);

// --- Komponen Utama Dashboard ---
export default function Dashboard({ auth, totalSiswa, totalGuru, totalKelas, activeSemester, recentStudents }) {

    return (
        <AuthenticatedLayout
            header={`Dashboard`}
        >
            <Head title="Dashboard" />

            <div className="space-y-8">
                {/* Header Sambutan */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Selamat Datang Kembali, {auth.user.name}!</h1>
                    <p className="text-gray-500 mt-1">Ringkasan aktivitas sekolah Anda hari ini.</p>
                </div>

                {/* Grid Kartu Statistik */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total Siswa" value={totalSiswa} icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" color="bg-blue-500" />
                    <StatCard title="Total Guru" value={totalGuru} icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" color="bg-green-500" />
                    <StatCard title="Total Kelas" value={totalKelas} icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" color="bg-yellow-500" />
                    <StatCard title="Semester Aktif" value={activeSemester} icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" color="bg-purple-500" />
                </div>

                {/* Grid Konten Utama */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {/* Menggunakan data dinamis dari props */}
                        <ActivityList title="Siswa Baru" items={recentStudents} link={route('siswa.index')} />
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Pengumuman</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg">
                                <h4 className="font-bold text-indigo-800">Rapat Wali Murid</h4>
                                <p className="text-sm text-indigo-700 mt-1">Diadakan pada hari Sabtu, 12 Juli 2025.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
