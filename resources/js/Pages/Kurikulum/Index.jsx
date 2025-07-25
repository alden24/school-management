import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';

export default function Index({ auth, kurikulums }) {
    const { flash = {}, errors = {} } = usePage().props;

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data kurikulum ini?')) {
            router.delete(route('kurikulum.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout header="Manajemen Kurikulum">
            <Head title="Kurikulum" />
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12">
                {flash.message && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p>{flash.message}</p></div>}
                {errors.error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert"><p>{errors.error}</p></div>}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="mb-4">
                        <Link href={route('kurikulum.create')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">
                            Tambah Kurikulum
                        </Link>
                        </div>
                        <div className="bg-white overflow-hidden shadow-md rounded-lg p-4 md:p-0">
                                <table className="min-w-full">
                                {/* 1. Sembunyikan header tabel di mobile */}
                                <thead className="hidden md:table-header-group">
                                    <tr className="bg-gray-50">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <span className="md:hidden font-bold text-gray-500">Nama Kurikulum</span></th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <span className="md:hidden font-bold text-gray-500">Status</span></th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <span className="md:hidden font-bold text-gray-500">Aksi</span></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {kurikulums.map((kurikulum) => (
                                        <tr className="block md:table-cell border-b md:border-none mb-4 md:mb-0" key={kurikulum.id}>
                                            <td className="block md:table-cell px-6 py-4 whitespace-nowrap">
                                                {kurikulum.nama_kurikulum}
                                                </td>
                                            <td className="block md:table-cell px-6 py-4 whitespace-nowrap">
                                                {kurikulum.is_active ? (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Aktif</span>
                                                ) : (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Tidak Aktif</span>
                                                )}
                                            </td>
                                            <td className="block md:table-cell border-b md:border-none mb-4 md:mb-0">
                                                <Link href={route('kurikulum.edit', kurikulum.id)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                                                <button onClick={() => handleDelete(kurikulum.id)} className="text-red-600 hover:text-red-900">Hapus</button>
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
