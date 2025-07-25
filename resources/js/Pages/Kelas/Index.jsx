import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';

export default function Index({ auth, kelas }) {
    const { flash = {}, errors = {} } = usePage().props;

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data kelas ini?')) {
            router.delete(route('kelas.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Data Kelas</h2>}
        >
            <Head title="Data Kelas" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash.message && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p>{flash.message}</p></div>}
                    {errors.error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert"><p>{errors.error}</p></div>}
                    
                    <div className="mb-4">
                        <Link href={route('kelas.create')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded inline-block">
                            Tambah Kelas
                        </Link>
                    </div>

                    <div className="bg-white overflow-hidden shadow-md rounded-lg p-4 md:p-0">
                        <table className="min-w-full">
                            <thead className="hidden md:table-header-group">
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Kelas</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kejuruan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wali Kelas</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {kelas.map((item) => (
                                    <tr key={item.id} className="block md:table-row border-b md:border-none mb-4 md:mb-0">
                                        <td className="block md:table-cell px-6 py-4 whitespace-nowrap">
                                            <span className="md:hidden font-bold text-gray-500">Nama Kelas: </span>
                                            {item.nama_kelas} ({item.tingkat})
                                        </td>
                                        <td className="block md:table-cell px-6 py-4 whitespace-nowrap">
                                            <span className="md:hidden font-bold text-gray-500">Kejuruan: </span>
                                            {item.kejuruan?.nama_kejuruan || 'Umum'}
                                        </td>
                                        <td className="block md:table-cell px-6 py-4 whitespace-nowrap">
                                            <span className="md:hidden font-bold text-gray-500">Wali Kelas: </span>
                                            {item.wali_kelas ? item.wali_kelas.nama_lengkap : 'Belum Ditentukan'}
                                        </td>
                                        <td className="block md:table-cell px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <span className="md:hidden font-bold text-gray-500">Aksi: </span>
                                            <Link href={route('kelas.edit', item.id)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                                            <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">Hapus</button>
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
