import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';

export default function Index({ auth, matapelajarans }) {
    const { flash = {} } = usePage().props;

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            router.delete(route('matapelajaran.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout header="Manajemen Mata Pelajaran">
            <Head title="Mata Pelajaran" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash.message && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p>{flash.message}</p></div>}
                    <div className="mb-4">
                        <Link href={route('matapelajaran.create')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded inline-block">
                            Tambah Mata Pelajaran
                        </Link>
                    </div>
                    <div className="bg-white overflow-hidden shadow-md rounded-lg">
                        <table className="min-w-full">
                            <thead className="hidden md:table-header-group">
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Mata Pelajaran</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kurikulum</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {matapelajarans.map((mapel) => (
                                    <tr key={mapel.id} className="block md:table-row border-b md:border-none mb-4 md:mb-0 p-4 md:p-0">
                                        <td className="block md:table-cell md:px-6 md:py-4 whitespace-nowrap">
                                            <span className="md:hidden font-bold text-gray-500">Mapel: </span>{mapel.nama_mapel}
                                        </td>
                                        <td className="block md:table-cell md:px-6 md:py-4 whitespace-nowrap">
                                            <span className="md:hidden font-bold text-gray-500">Kategori: </span>{mapel.kategori?.nama_kategori || 'N/A'}
                                        </td>
                                        <td className="block md:table-cell md:px-6 md:py-4 whitespace-nowrap">
                                            <span className="md:hidden font-bold text-gray-500">Kurikulum: </span>{mapel.kurikulum?.nama_kurikulum || 'N/A'}
                                        </td>
                                        <td className="block md:table-cell md:px-6 md:py-4 whitespace-nowrap text-sm font-medium">
                                            <span className="md:hidden font-bold text-gray-500">Aksi: </span>
                                            <Link href={route('matapelajaran.edit', mapel.id)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                                            <button onClick={() => handleDelete(mapel.id)} className="text-red-600 hover:text-red-900">Hapus</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
