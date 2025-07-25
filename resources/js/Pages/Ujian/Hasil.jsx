import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Hasil({ auth, ujian, hasilUjian, jumlahSoal }) {
    return (
        <AuthenticatedLayout
            header={`Hasil Ujian: ${ujian.judul}`}
        >
            <Head title="Hasil Ujian" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-md sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-4">
                                <p><strong>Mata Pelajaran:</strong> {ujian.jadwal_pelajaran.mata_pelajaran.nama_mapel}</p>
                                <p><strong>Kelas:</strong> {ujian.jadwal_pelajaran.kelas.nama_kelas}</p>
                                <p><strong>Jumlah Soal:</strong> {jumlahSoal}</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Siswa</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Benar</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nilai Akhir</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {hasilUjian.map(hasil => (
                                            <tr key={hasil.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{hasil.nama_lengkap}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">{hasil.jumlah_benar} / {jumlahSoal}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center font-bold text-lg">{hasil.nilai_akhir}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
