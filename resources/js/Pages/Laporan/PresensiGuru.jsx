import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// Komponen untuk badge status di modal
const StatusBadge = ({ status }) => {
    const statusMap = {
        'Hadir': 'bg-green-100 text-green-800',
        'Izin': 'bg-blue-100 text-blue-800',
        'Sakit': 'bg-yellow-100 text-yellow-800',
    };
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusMap[status]}`}>{status}</span>;
};

export default function PresensiGuru({ auth, laporanData, filters }) {
    const [filterData, setFilterData] = useState({
        start_date: filters.start_date,
        end_date: filters.end_date,
        search: filters.search || '',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGuru, setSelectedGuru] = useState(null);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterData(prev => ({ ...prev, [name]: value }));
    };

    const applyFilter = () => {
        router.get(route('laporan.presensi.guru.index'), filterData, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const openDetailModal = (guru) => {
        setSelectedGuru(guru);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedGuru(null);
    };

    // --- FUNGSI UNTUK MEMBUAT URL EKSPOR ---
    const exportUrl = (type) => {
        const url = new URL(route(`laporan.presensi.guru.export.${type}`));
        url.searchParams.append('start_date', filterData.start_date);
        url.searchParams.append('end_date', filterData.end_date);
        if (filterData.search) {
            url.searchParams.append('search', filterData.search);
        }
        return url.toString();
    };

    return (
        <AuthenticatedLayout header="Laporan Presensi Guru & Tendik">
            <Head title="Laporan Presensi" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 space-y-4">
                            {/* Filter Section */}
                            <div className="flex flex-wrap items-end gap-4 p-4 border rounded-lg">
                                <div className="flex-1 min-w-[200px]">
                                    <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Tanggal Mulai</label>
                                    <input type="date" name="start_date" id="start_date" value={filterData.start_date} onChange={handleFilterChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                                </div>
                                <div className="flex-1 min-w-[200px]">
                                    <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">Tanggal Selesai</label>
                                    <input type="date" name="end_date" id="end_date" value={filterData.end_date} onChange={handleFilterChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                                </div>
                                <div className="flex-1 min-w-[200px]">
                                    <label htmlFor="search" className="block text-sm font-medium text-gray-700">Cari Nama</label>
                                    <input type="text" name="search" id="search" value={filterData.search} onChange={handleFilterChange} placeholder="Ketik nama..." className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                                </div>
                                <button onClick={applyFilter} className="bg-indigo-600 text-white px-4 py-2 rounded-md">Terapkan Filter</button>
                            </div>

                            {/* Export Buttons */}
                            <div className="flex space-x-2">
                                <a href={exportUrl('pdf')} target="_blank" className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                                    Export PDF
                                </a>
                                <a href={exportUrl('excel')} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                                    Export Excel
                                </a>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Hadir</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Izin</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Sakit</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {laporanData.map(laporan => (
                                            <tr key={laporan.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button onClick={() => openDetailModal(laporan)} className="text-indigo-600 hover:text-indigo-800 font-medium">{laporan.nama_lengkap}</button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">{laporan.summary.Hadir}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">{laporan.summary.Izin}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">{laporan.summary.Sakit}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="3xl">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Detail Presensi: {selectedGuru?.nama_lengkap}</h2>
                    <div className="mt-4 max-h-[70vh] overflow-y-auto space-y-4">
                        {selectedGuru?.presensi_details.length > 0 ? (
                            selectedGuru.presensi_details.map(presensi => (
                                <div key={presensi.id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <p className="font-semibold text-gray-800">{format(new Date(presensi.tanggal), "EEEE, dd MMMM yyyy", { locale: id })}</p>
                                        <StatusBadge status={presensi.status} />
                                    </div>
                                    {presensi.status === 'Hadir' ? (
                                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                            <div>
                                                <p className="text-sm text-gray-500"><strong>Masuk:</strong> {presensi.waktu_masuk} ({presensi.status_lokasi_masuk})</p>
                                                <p className="text-sm text-gray-500"><strong>Pulang:</strong> {presensi.waktu_pulang || '-'} ({presensi.status_lokasi_pulang || '-'})</p>
                                                <a href={`https://www.google.com/maps/search/?api=1&query=${presensi.latitude_masuk},${presensi.longitude_masuk}`} target="_blank" className="text-xs text-blue-500 hover:underline">Lihat Lokasi Masuk</a>
                                            </div>
                                            <div>
                                                {presensi.foto_masuk_url && (
                                                    <img src={presensi.foto_masuk_url} alt="Foto Masuk" className="w-24 h-24 rounded-lg object-cover" />
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-3">
                                            <p className="text-sm text-gray-700"><strong>Keterangan:</strong> {presensi.keterangan}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-8">Tidak ada data presensi untuk guru ini pada periode yang dipilih.</p>
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
