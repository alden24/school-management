import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ auth, orangtuas }) {
    // Beri nilai default objek kosong {} jika flash tidak ada
    const { flash = {} } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Data Orang Tua / Wali</h2>}
        >
            <Head title="Data Orang Tua" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Blok untuk menampilkan pesan sukses */}
                    {flash.message && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                            <p>{flash.message}</p>
                        </div>
                    )}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <Link href={route('orangtua.create')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">
                                Tambah Orang Tua
                            </Link>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kontak</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pekerjaan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {orangtuas.map((orangtua) => (
                                        <tr key={orangtua.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{orangtua.nama_lengkap}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{orangtua.kontak}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{orangtua.pekerjaan}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {/* Tombol Edit & Hapus akan ditambahkan di sini nanti */}
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
