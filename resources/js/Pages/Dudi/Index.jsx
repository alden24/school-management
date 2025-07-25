import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';

export default function Index({ auth, dudis }) {
    const { flash = {} } = usePage().props;

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data DUDI ini?')) {
            router.delete(route('dudi.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout header="Manajemen DUDI">
            <Head title="Manajemen DUDI" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash.message && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p>{flash.message}</p></div>}
                    <div className="mb-4">
                        <Link href={route('dudi.create')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded inline-block">
                            Tambah DUDI
                        </Link>
                    </div>
                    <div className="bg-white overflow-hidden shadow-md rounded-lg">
                        <table className="min-w-full">
                            <thead className="hidden md:table-header-group">
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Perusahaan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kontak Personalia</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {dudis.map((dudi) => (
                                    <tr key={dudi.id} className="block md:table-row border-b md:border-none mb-4 md:mb-0 p-4 md:p-0">
                                        <td className="block md:table-cell md:px-6 md:py-4 whitespace-nowrap">
                                            <span className="md:hidden font-bold text-gray-500">Nama Perusahaan: </span>{dudi.nama_perusahaan}
                                        </td>
                                        <td className="block md:table-cell md:px-6 md:py-4 whitespace-nowrap">
                                            <span className="md:hidden font-bold text-gray-500">Kontak: </span>{dudi.nama_kontak_personalia || '-'}
                                        </td>
                                        <td className="block md:table-cell md:px-6 md:py-4 whitespace-nowrap">
                                            <span className="md:hidden font-bold text-gray-500">Email: </span>{dudi.email_perusahaan || '-'}
                                        </td>
                                        <td className="block md:table-cell md:px-6 md:py-4 whitespace-nowrap text-sm font-medium">
                                            <span className="md:hidden font-bold text-gray-500">Aksi: </span>
                                            <Link href={route('dudi.edit', dudi.id)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                                            <button onClick={() => handleDelete(dudi.id)} className="text-red-600 hover:text-red-900">Hapus</button>
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
