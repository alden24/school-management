import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Modal from '@/Components/Modal';

// Komponen untuk badge status di modal
const StatusBadge = ({ status }) => {
    const statusMap = {
        'Hadir': 'bg-green-100 text-green-800',
        'Izin': 'bg-blue-100 text-blue-800',
        'Sakit': 'bg-yellow-100 text-yellow-800',
    };
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusMap[status]}`}>{status}</span>;
};

export default function PresensiPrakerin({ auth, prakerins }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPresensi, setSelectedPresensi] = useState([]);
    const [selectedSiswaName, setSelectedSiswaName] = useState('');

    const openDetailModal = (prakerin) => {
        setSelectedSiswaName(prakerin.siswa.nama_lengkap);
        setSelectedPresensi(prakerin.presensi_prakerins);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPresensi([]);
        setSelectedSiswaName('');
    };

    return (
        <AuthenticatedLayout header="Laporan Presensi Siswa Bimbingan">
            <Head title="Laporan Presensi Prakerin" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-md sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Siswa</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Perusahaan (DUDI)</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total Kehadiran</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {prakerins.map(prakerin => (
                                        <tr key={prakerin.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button onClick={() => openDetailModal(prakerin)} className="text-indigo-600 hover:text-indigo-800 font-medium">
                                                    {prakerin.siswa.nama_lengkap}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{prakerin.dudi.nama_perusahaan}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">{prakerin.presensi_prakerins.length} hari</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal untuk Detail Presensi */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Detail Presensi: {selectedSiswaName}</h2>
                    <div className="mt-4 max-h-[70vh] overflow-y-auto space-y-4">
                        {selectedPresensi.length > 0 ? (
                            selectedPresensi.map(presensi => (
                                <div key={presensi.id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <p className="font-semibold text-gray-800">{new Date(presensi.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        <StatusBadge status={presensi.status} />
                                    </div>
                                    {presensi.status === 'Hadir' && (
                                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                            <div>
                                                <p className="text-sm text-gray-500"><strong>Masuk:</strong> {presensi.waktu_masuk}</p>
                                                <p className="text-sm text-gray-500"><strong>Pulang:</strong> {presensi.waktu_pulang || '-'}</p>
                                                <a href={`https://www.google.com/maps/search/?api=1&query=${presensi.latitude_masuk},${presensi.longitude_masuk}`} target="_blank" className="text-xs text-blue-500 hover:underline">Lihat Lokasi Masuk</a>
                                            </div>
                                            <div>
                                                <img src={presensi.foto_masuk_url} alt="Foto Masuk" className="w-24 h-24 rounded-lg object-cover" />
                                            </div>
                                        </div>
                                    )}
                                    {(presensi.status === 'Izin' || presensi.status === 'Sakit') && (
                                        <div className="mt-3">
                                            <p className="text-sm text-gray-700"><strong>Keterangan:</strong> {presensi.keterangan}</p>
                                            {presensi.bukti_keterangan_url && (
                                                <a href={presensi.bukti_keterangan_url} target="_blank" className="text-sm text-blue-500 hover:underline">Lihat Bukti</a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-8">Tidak ada data presensi untuk siswa ini.</p>
                        )}
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button onClick={closeModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Tutup</button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
