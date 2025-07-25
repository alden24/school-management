import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function Show({ auth, siswa }) {
    const { flash = {}, errors } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        siswa_id: siswa.id,
        periode_bulan: new Date().getMonth() + 1,
        periode_tahun: new Date().getFullYear(),
        jumlah_bayar: '',
    });

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const submitTagihan = (e) => {
        e.preventDefault();
        post(route('pembayaran.storeTagihan'), {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AuthenticatedLayout header={`Riwayat Pembayaran: ${siswa.nama_lengkap}`}>
            <Head title="Riwayat Pembayaran" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash.message && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p>{flash.message}</p></div>}
                    {errors.error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert"><p>{errors.error}</p></div>}
                    
                    <div className="mb-4">
                        <PrimaryButton onClick={openModal}>Buat Tagihan Baru</PrimaryButton>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-4">Riwayat Tagihan</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Periode</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Bayar</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {siswa.pembayaran_spps.map(p => (
                                            <tr key={p.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{p.periode_bulan} / {p.periode_tahun}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">Rp {new Intl.NumberFormat('id-ID').format(p.jumlah_bayar)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{p.status}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{p.tanggal_bayar || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal}>
                <form onSubmit={submitTagihan} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">Buat Tagihan SPP Baru</h2>
                    <p className="mt-1 text-sm text-gray-600">Buat tagihan baru untuk siswa: {siswa.nama_lengkap}</p>
                    <div className="mt-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="periode_bulan" value="Bulan" />
                                <input type="number" id="periode_bulan" value={data.periode_bulan} onChange={(e) => setData('periode_bulan', e.target.value)} className="mt-1 block w-full" min="1" max="12" required />
                                <InputError message={errors.periode_bulan} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="periode_tahun" value="Tahun" />
                                <input type="number" id="periode_tahun" value={data.periode_tahun} onChange={(e) => setData('periode_tahun', e.target.value)} className="mt-1 block w-full" required />
                                <InputError message={errors.periode_tahun} className="mt-2" />
                            </div>
                        </div>
                        <div>
                            <InputLabel htmlFor="jumlah_bayar" value="Jumlah Tagihan (Rp)" />
                            <input type="number" id="jumlah_bayar" value={data.jumlah_bayar} onChange={(e) => setData('jumlah_bayar', e.target.value)} className="mt-1 block w-full" required />
                            <InputError message={errors.jumlah_bayar} className="mt-2" />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton type="button" onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton className="ml-3" disabled={processing}>Buat Tagihan</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
