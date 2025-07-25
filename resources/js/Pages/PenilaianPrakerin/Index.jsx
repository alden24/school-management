import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function Index({ auth, prakerins }) {
    const { flash = {} } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPrakerin, setSelectedPrakerin] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        prakerin_id: '',
        nilai_pembimbing_dudi: '',
        nilai_laporan: '',
        nilai_presentasi: '',
        catatan_akhir: '',
    });

    const openModal = (prakerin) => {
        setSelectedPrakerin(prakerin);
        setData({
            prakerin_id: prakerin.id,
            nilai_pembimbing_dudi: prakerin.penilaian?.nilai_pembimbing_dudi || '',
            nilai_laporan: prakerin.penilaian?.nilai_laporan || '',
            nilai_presentasi: prakerin.penilaian?.nilai_presentasi || '',
            catatan_akhir: prakerin.penilaian?.catatan_akhir || '',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPrakerin(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('penilaian.prakerin.store'), {
            onSuccess: () => closeModal(),
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout header="Penilaian Prakerin">
            <Head title="Penilaian Prakerin" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash.message && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p>{flash.message}</p></div>}
                    <div className="bg-white overflow-hidden shadow-md sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Siswa</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">DUDI</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guru Pembimbing</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Nilai Akhir</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {prakerins.map(p => (
                                        <tr key={p.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{p.siswa.nama_lengkap}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{p.dudi.nama_perusahaan}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{p.guru.nama_lengkap}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center font-bold text-lg">{p.penilaian?.nilai_akhir || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <button onClick={() => openModal(p)} className="text-indigo-600 hover:text-indigo-900 font-medium">
                                                    {p.penilaian ? 'Edit Nilai' : 'Beri Nilai'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal}>
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">Form Penilaian Prakerin</h2>
                    <p className="mt-1 text-sm text-gray-600">Siswa: {selectedPrakerin?.siswa.nama_lengkap}</p>
                    <div className="mt-6 grid grid-cols-1 gap-6">
                        <div>
                            <InputLabel htmlFor="nilai_pembimbing_dudi" value="Nilai dari Pembimbing DUDI" />
                            <TextInput id="nilai_pembimbing_dudi" type="number" value={data.nilai_pembimbing_dudi} onChange={(e) => setData('nilai_pembimbing_dudi', e.target.value)} className="mt-1 block w-full" required />
                            <InputError message={errors.nilai_pembimbing_dudi} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="nilai_laporan" value="Nilai Laporan" />
                            <TextInput id="nilai_laporan" type="number" value={data.nilai_laporan} onChange={(e) => setData('nilai_laporan', e.target.value)} className="mt-1 block w-full" required />
                            <InputError message={errors.nilai_laporan} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="nilai_presentasi" value="Nilai Presentasi / Ujian Akhir" />
                            <TextInput id="nilai_presentasi" type="number" value={data.nilai_presentasi} onChange={(e) => setData('nilai_presentasi', e.target.value)} className="mt-1 block w-full" required />
                            <InputError message={errors.nilai_presentasi} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="catatan_akhir" value="Catatan Akhir (Opsional)" />
                            <textarea id="catatan_akhir" value={data.catatan_akhir} onChange={(e) => setData('catatan_akhir', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
                            <InputError message={errors.catatan_akhir} className="mt-2" />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton type="button" onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton className="ml-3" disabled={processing}>Simpan Nilai</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
