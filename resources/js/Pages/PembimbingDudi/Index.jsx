import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';

export default function Index({ auth, pembimbings }) {
    const { flash = {} } = usePage().props;

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data pembimbing ini?')) {
            router.delete(route('pembimbing-dudi.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout header="Manajemen Pembimbing DUDI">
            <Head title="Pembimbing DUDI" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash.message && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p>{flash.message}</p></div>}
                    <div className="mb-4">
                        <Link href={route('pembimbing-dudi.create')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded inline-block">
                            Tambah Pembimbing
                        </Link>
                    </div>
                    <div className="bg-white overflow-hidden shadow-md rounded-lg">
                        <table className="min-w-full">
                            <thead className="hidden md:table-header-group">
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Pembimbing</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Perusahaan (DUDI)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jabatan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {pembimbings.map((pembimbing) => (
                                    <tr key={pembimbing.id} className="block md:table-row border-b md:border-none mb-4 md:mb-0 p-4 md:p-0">
                                        <td className="block md:table-cell md:px-6 md:py-4 whitespace-nowrap">
                                            <span className="md:hidden font-bold text-gray-500">Nama: </span>{pembimbing.nama_pembimbing}
                                        </td>
                                        <td className="block md:table-cell md:px-6 md:py-4 whitespace-nowrap">
                                            <span className="md:hidden font-bold text-gray-500">Perusahaan: </span>{pembimbing.dudi?.nama_perusahaan || 'N/A'}
                                        </td>
                                        <td className="block md:table-cell md:px-6 md:py-4 whitespace-nowrap">
                                            <span className="md:hidden font-bold text-gray-500">Jabatan: </span>{pembimbing.jabatan || '-'}
                                        </td>
                                        <td className="block md:table-cell md:px-6 md:py-4 whitespace-nowrap text-sm font-medium">
                                            <span className="md:hidden font-bold text-gray-500">Aksi: </span>
                                            <Link href={route('pembimbing-dudi.edit', pembimbing.id)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                                            <button onClick={() => handleDelete(pembimbing.id)} className="text-red-600 hover:text-red-900">Hapus</button>
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
