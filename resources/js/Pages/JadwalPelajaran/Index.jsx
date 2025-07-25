import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';

export default function Index({ auth, jadwals }) {
    const { flash = {}, errors = {} } = usePage().props;

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
            router.delete(route('jadwal-pelajaran.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header="Manajemen Jadwal Pelajaran"
        >
            <Head title="Jadwal Pelajaran" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash.message && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p>{flash.message}</p></div>}
                    {errors.error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert"><p>{errors.error}</p></div>}
                    
                    <div className="bg-white overflow-hidden shadow-md sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <Link href={route('jadwal-pelajaran.create')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">
                                Tambah Jadwal
                            </Link>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hari & Jam</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durasi</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mata Pelajaran</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guru</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {jadwals.map((jadwal) => (
                                            <tr key={jadwal.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-semibold">{jadwal.hari}</div>
                                                    <div className="text-sm text-gray-500">{jadwal.jam_mulai.substring(0, 5)} - {jadwal.jam_selesai.substring(0, 5)}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-semibold">{jadwal.jumlah_jp}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{jadwal.kelas?.nama_kelas || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{jadwal.mata_pelajaran?.nama_mapel || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{jadwal.guru?.nama_lengkap || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Link href={route('jadwal-pelajaran.edit', jadwal.id)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                                                    <button onClick={() => handleDelete(jadwal.id)} className="text-red-600 hover:text-red-900">Hapus</button>
                                                </td>
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
