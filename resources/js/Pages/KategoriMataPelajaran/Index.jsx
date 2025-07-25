import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';

export default function Index({ auth, kategoris }) {
    const { flash = {} } = usePage().props;

    const handleDelete = (id) => {
        if (confirm('Menghapus kategori akan menghapus semua mata pelajaran di dalamnya. Lanjutkan?')) {
            router.delete(route('kategori-matapelajaran.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout header="Manajemen Kategori Mata Pelajaran">
            <Head title="Kategori Mata Pelajaran" />
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12">
                {flash.message && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p>{flash.message}</p></div>}
                <div className="bg-white overflow-hidden shadow-md sm:rounded-lg">
                    <div className="p-6 text-gray-900">
                        <Link href={route('kategori-matapelajaran.create')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">
                            Tambah Kategori
                        </Link>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Kategori</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {kategoris.map((kategori) => (
                                        <tr key={kategori.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{kategori.nama_kategori}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <Link href={route('kategori-matapelajaran.edit', kategori.id)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                                                <button onClick={() => handleDelete(kategori.id)} className="text-red-600 hover:text-red-900">Hapus</button>
                                            </td>
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
