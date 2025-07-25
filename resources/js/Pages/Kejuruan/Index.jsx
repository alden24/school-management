import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';

export default function Index({ auth, kejuruans }) {
    const { flash = {}, errors = {} } = usePage().props;

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data kejuruan ini?')) {
            router.delete(route('kejuruan.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout header="Manajemen Kejuruan">
            <Head title="Kejuruan" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash.message && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p>{flash.message}</p></div>}
                    {errors.error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert"><p>{errors.error}</p></div>}
                    <div className="mb-4">
                        <Link href={route('kejuruan.create')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded inline-block">
                            Tambah Kejuruan
                        </Link>
                    </div>
                    <div className="bg-white overflow-hidden shadow-md rounded-lg">
                        <table className="min-w-full">
                            <thead className="hidden md:table-header-group">
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Kejuruan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Singkatan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {kejuruans.map((kejuruan) => (
                                    <tr key={kejuruan.id} className="block md:table-row border-b md:border-none mb-4 md:mb-0 p-4 md:p-0">
                                        <td className="block md:table-cell md:px-6 md:py-4 whitespace-nowrap">
                                            <span className="md:hidden font-bold text-gray-500">Nama Kejuruan: </span>{kejuruan.nama_kejuruan}
                                        </td>
                                        <td className="block md:table-cell md:px-6 md:py-4 whitespace-nowrap">
                                            <span className="md:hidden font-bold text-gray-500">Singkatan: </span>{kejuruan.singkatan}
                                        </td>
                                        <td className="block md:table-cell md:px-6 md:py-4 whitespace-nowrap text-sm font-medium">
                                            <span className="md:hidden font-bold text-gray-500">Aksi: </span>
                                            <Link href={route('kejuruan.edit', kejuruan.id)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                                            <button onClick={() => handleDelete(kejuruan.id)} className="text-red-600 hover:text-red-900">Hapus</button>
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
