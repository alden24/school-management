import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';

export default function Index({ auth, ujians }) {
    const { flash = {} } = usePage().props;
    const isAdmin = auth.user.role === 'admin';

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus ujian ini beserta semua soal di dalamnya?')) {
            router.delete(route('ujian.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout header="Bank Soal / Ujian">
            <Head title="Bank Soal" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash.message && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p>{flash.message}</p></div>}
                    
                    <div className="mb-4">
                        <Link href={route('ujian.create')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded inline-block">
                            Buat Ujian Baru
                        </Link>
                    </div>

                    <div className="bg-white overflow-hidden shadow-md rounded-lg">
                        <table className="min-w-full">
                            <thead className="hidden md:table-header-group">
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul Ujian</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas & Mapel</th>
                                    {isAdmin && (
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guru Pembuat</th>
                                    )}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah Soal</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {ujians.map((ujian) => (
                                    <tr key={ujian.id} className="block md:table-row border-b md:border-none mb-4 md:mb-0 p-4 md:p-0">
                                        <td className="block md:table-cell md:px-6 md:py-4 whitespace-nowrap font-medium">
                                            <span className="md:hidden font-bold text-gray-500">Judul: </span>
                                            {ujian.judul}
                                            <div className="text-xs text-gray-500 mt-1">{ujian.tipe}</div>
                                        </td>
                                        <td className="block md:table-cell md:px-6 md:py-4 whitespace-nowrap">
                                            <span className="md:hidden font-bold text-gray-500">Kelas & Mapel: </span>
                                            {ujian.jadwal_pelajaran?.kelas?.nama_kelas} - {ujian.jadwal_pelajaran?.mata_pelajaran?.nama_mapel}
                                        </td>
                                        {isAdmin && (
                                            <td className="block md:table-cell md:px-6 md:py-4 whitespace-nowrap">
                                                <span className="md:hidden font-bold text-gray-500">Guru: </span>
                                                {ujian.jadwal_pelajaran?.guru?.nama_lengkap}
                                            </td>
                                        )}
                                        <td className="block md:table-cell md:px-6 md:py-4 whitespace-nowrap">
                                            <span className="md:hidden font-bold text-gray-500">Jumlah Soal: </span>
                                            <div className="flex items-center">
                                                <span className="font-semibold">{ujian.soals_count} Soal</span>
                                                <div className="w-20 bg-gray-200 rounded-full h-2.5 ml-3">
                                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.min(100, (ujian.soals_count / 20) * 100)}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="block md:table-cell md:px-6 md:py-4 whitespace-nowrap text-sm font-medium">
                                            <span className="md:hidden font-bold text-gray-500">Aksi: </span>
                                            <div className="flex flex-wrap gap-2 md:gap-4">
                                                <Link href={route('ujian.show', ujian.id)} className="text-blue-600 hover:text-blue-900">Kelola Soal</Link>
                                                <Link href={route('ujian.edit', ujian.id)} className="text-indigo-600 hover:text-indigo-900">Edit</Link>
                                                <Link href={route('ujian.hasil', ujian.id)} className="text-green-600 hover:text-green-900">Lihat Hasil</Link>
                                                <button onClick={() => handleDelete(ujian.id)} className="text-red-600 hover:text-red-900">Hapus</button>
                                            </div>
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
