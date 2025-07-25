import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

// Komponen untuk badge status
const StatusBadge = ({ status }) => {
    const baseClasses = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
    let colorClasses = "bg-gray-100 text-gray-800"; // Default untuk '-'
    if (status === 'Hadir') colorClasses = "bg-green-100 text-green-800";
    if (status === 'Sakit') colorClasses = "bg-yellow-100 text-yellow-800";
    if (status === 'Izin') colorClasses = "bg-blue-100 text-blue-800";
    if (status === 'Alfa') colorClasses = "bg-red-100 text-red-800";
    return <span className={`${baseClasses} ${colorClasses}`}>{status}</span>;
};

export default function Laporan({ auth, jadwal, tanggalAbsensi, laporanData }) {
    return (
        <AuthenticatedLayout
            header={`Laporan Absensi: ${jadwal.kelas.nama_kelas} - ${jadwal.mata_pelajaran.nama_mapel}`}
        >
            <Head title="Laporan Absensi" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12">
                <div className="bg-white overflow-hidden shadow-md sm:rounded-lg">
                    <div className="p-6 text-gray-900">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 border">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 border-r">Nama Siswa</th>
                                        {tanggalAbsensi.map(tanggal => (
                                            <th key={tanggal} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{new Date(tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {laporanData.map(siswa => (
                                        <tr key={siswa.id}>
                                            <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white z-10 border-r font-medium">{siswa.nama_lengkap}</td>
                                            {tanggalAbsensi.map(tanggal => (
                                                <td key={`${siswa.id}-${tanggal}`} className="px-6 py-4 whitespace-nowrap text-center">
                                                    <StatusBadge status={siswa.kehadiran[tanggal]} />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
