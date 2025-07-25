import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

const Pagination = ({ links }) => (
    <div className="mt-6 flex justify-center">
        {links.map((link, index) => (
            <Link
                key={index}
                href={link.url || '#'}
                className={`px-4 py-2 mx-1 border rounded-md text-sm ${
                    link.active ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'
                } ${!link.url ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                dangerouslySetInnerHTML={{ __html: link.label }}
            />
        ))}
    </div>
);

export default function AdminIndex({ auth, siswas, filters }) {
    const { flash = {} } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

    const bulkForm = useForm({
        periode_bulan: new Date().getMonth() + 1,
        periode_tahun: new Date().getFullYear(),
        jumlah_bayar: '',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('pembayaran.index'), { search: searchTerm }, { preserveState: true });
    };

    const openBulkModal = () => setIsBulkModalOpen(true);
    const closeBulkModal = () => {
        setIsBulkModalOpen(false);
        bulkForm.reset();
    };

    const submitBulkTagihan = (e) => {
        e.preventDefault();
        bulkForm.post(route('pembayaran.storeBulkTagihan'), {
            onSuccess: () => closeBulkModal(),
        });
    };

    return (
        <AuthenticatedLayout header="Manajemen Pembayaran SPP">
            <Head title="Pembayaran SPP" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash.message && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p>{flash.message}</p></div>}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 space-y-4">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <PrimaryButton onClick={openBulkModal}>Buat Tagihan Massal</PrimaryButton>
                                <form onSubmit={handleSearch} className="w-full sm:w-1/3">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Cari Nama atau NISN..."
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </form>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Siswa</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {siswas.data.map(siswa => (
                                            <tr key={siswa.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{siswa.nama_lengkap}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{siswa.kelas?.nama_kelas || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Link href={route('pembayaran.show', siswa.id)} className="text-indigo-600 hover:text-indigo-900">
                                                        Buat Tagihan / Lihat Riwayat
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination links={siswas.links} />
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isBulkModalOpen} onClose={closeBulkModal}>
                <form onSubmit={submitBulkTagihan} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">Buat Tagihan SPP Massal</h2>
                    <p className="mt-1 text-sm text-gray-600">Buat tagihan untuk semua siswa aktif pada periode tertentu.</p>
                    <div className="mt-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="periode_bulan" value="Bulan" />
                                <input type="number" id="periode_bulan" value={bulkForm.data.periode_bulan} onChange={(e) => bulkForm.setData('periode_bulan', e.target.value)} className="mt-1 block w-full" min="1" max="12" required />
                                <InputError message={bulkForm.errors.periode_bulan} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="periode_tahun" value="Tahun" />
                                <input type="number" id="periode_tahun" value={bulkForm.data.periode_tahun} onChange={(e) => bulkForm.setData('periode_tahun', e.target.value)} className="mt-1 block w-full" required />
                                <InputError message={bulkForm.errors.periode_tahun} className="mt-2" />
                            </div>
                        </div>
                        <div>
                            <InputLabel htmlFor="jumlah_bayar" value="Jumlah Tagihan (Rp)" />
                            <input type="number" id="jumlah_bayar" value={bulkForm.data.jumlah_bayar} onChange={(e) => bulkForm.setData('jumlah_bayar', e.target.value)} className="mt-1 block w-full" placeholder="Contoh: 300000" required />
                            <InputError message={bulkForm.errors.jumlah_bayar} className="mt-2" />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton type="button" onClick={closeBulkModal}>Batal</SecondaryButton>
                        <PrimaryButton className="ml-3" disabled={bulkForm.processing}>Generate Tagihan</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
