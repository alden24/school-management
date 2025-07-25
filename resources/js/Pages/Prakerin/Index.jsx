import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import Modal from '@/Components/Modal';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

const StatusBadge = ({ status }) => {
    const statusMap = {
        'Penempatan': 'bg-gray-100 text-gray-800',
        'Menunggu Jawaban DUDI': 'bg-yellow-100 text-yellow-800',
        'Diterima DUDI': 'bg-blue-100 text-blue-800',
        'Berlangsung': 'bg-green-100 text-green-800',
        'Selesai': 'bg-purple-100 text-purple-800',
        'Ditolak DUDI': 'bg-red-100 text-red-800',
        'Dibatalkan': 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusMap[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
};

export default function Index({ auth, penempatans }) {
    const { flash = {}, errors } = usePage().props;
    const [isJurnalModalOpen, setIsJurnalModalOpen] = useState(false);
    const [selectedJurnals, setSelectedJurnals] = useState([]);
    const [selectedSiswaName, setSelectedSiswaName] = useState('');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedDudi, setSelectedDudi] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // State untuk pencarian

    const { data, setData, post, processing, reset } = useForm({
        surat_balasan: null,
        status: 'Diterima DUDI',
    });

    const openJurnalModal = (penempatan) => {
        setSelectedSiswaName(penempatan.siswa?.nama_lengkap || 'Siswa');
        setSelectedJurnals(penempatan.jurnal_harians || []);
        setIsJurnalModalOpen(true);
    };

    const closeJurnalModal = () => {
        setIsJurnalModalOpen(false);
        setSelectedSiswaName('');
        setSelectedJurnals([]);
    };

    const openUploadModal = (dudi) => {
        setSelectedDudi(dudi);
        setIsUploadModalOpen(true);
    };

    const closeUploadModal = () => {
        setIsUploadModalOpen(false);
        setSelectedDudi(null);
        reset();
    };

    const handleUploadSubmit = (e) => {
        e.preventDefault();
        post(route('prakerin.updateStatusDudi', selectedDudi.id), {
            onSuccess: () => closeUploadModal(),
        });
    };

    const penempatanByDudi = useMemo(() => {
        const grouped = penempatans.reduce((acc, p) => {
            const dudiId = p.dudi?.id || 'tanpa-dudi';
            if (!acc[dudiId]) {
                acc[dudiId] = {
                    dudi: p.dudi,
                    penempatans: [],
                };
            }
            acc[dudiId].penempatans.push(p);
            return acc;
        }, {});

        if (!searchTerm) {
            return grouped;
        }

        const filtered = {};
        for (const dudiId in grouped) {
            if (grouped[dudiId].dudi?.nama_perusahaan.toLowerCase().includes(searchTerm.toLowerCase())) {
                filtered[dudiId] = grouped[dudiId];
            }
        }
        return filtered;

    }, [penempatans, searchTerm]);

    return (
        <AuthenticatedLayout header="Penempatan Prakerin">
            <Head title="Penempatan Prakerin" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash.message && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p>{flash.message}</p></div>}
                    
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                        <Link href={route('penempatan-prakerin.create')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded inline-block w-full sm:w-auto text-center">
                            Tempatkan Siswa
                        </Link>
                        <div className="w-full sm:w-1/3">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari Nama DUDI..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        {Object.values(penempatanByDudi).map(({ dudi, penempatans: group }) => {
                            const needsSurat = group.some(p => p.status === 'Penempatan');
                            const isWaitingForReply = group.some(p => p.status === 'Menunggu Jawaban DUDI');
                            const firstSuratPath = group.find(p => p.surat_pengantar_path)?.surat_pengantar_path;
                            const firstBalasanPath = group.find(p => p.surat_balasan_path)?.surat_balasan_path;

                            return (
                                <div key={dudi?.id || 'tanpa-dudi'} className="bg-white overflow-hidden shadow-md rounded-lg">
                                    <div className="p-6 border-b flex justify-between items-center">
                                        <h3 className="text-lg font-bold text-gray-900">{dudi?.nama_perusahaan || 'Tanpa Perusahaan'}</h3>
                                        <div className="flex items-center space-x-2">
                                            {needsSurat && (
                                                <Link href={route('prakerin.generateSuratKolektif', dudi.id)} className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">Generate Surat</Link>
                                            )}
                                            {isWaitingForReply && (
                                                <>
                                                    <a href={`/storage/${firstSuratPath}`} target="_blank" className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm">Lihat Surat</a>
                                                    <button onClick={() => openUploadModal(dudi)} className="bg-green-500 text-white px-3 py-1 rounded-md text-sm">Upload Balasan</button>
                                                </>
                                            )}
                                            {!needsSurat && !isWaitingForReply && (
                                                <>
                                                    {firstSuratPath && <a href={`/storage/${firstSuratPath}`} target="_blank" className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm">Lihat Surat Pengantar</a>}
                                                    {firstBalasanPath && <a href={`/storage/${firstBalasanPath}`} target="_blank" className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm ml-2">Lihat Surat Balasan</a>}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <ul className="space-y-3">
                                            {group.map(p => (
                                                <li key={p.id} className="flex justify-between items-center">
                                                    <div>
                                                        <span>{p.siswa?.nama_lengkap}</span>
                                                        <span className="text-xs text-gray-500 ml-2">({p.guru?.nama_lengkap})</span>
                                                    </div>
                                                    <div className="flex items-center space-x-4">
                                                        <StatusBadge status={p.status} />
                                                        {(p.status === 'Berlangsung' || p.status === 'Selesai') && (
                                                            <button onClick={() => openJurnalModal(p)} className="text-sm text-blue-600 hover:text-blue-800">Lihat Jurnal</button>
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Modal untuk Jurnal Harian */}
            <Modal show={isJurnalModalOpen} onClose={closeJurnalModal}>
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Jurnal Harian: {selectedSiswaName}</h2>
                    <div className="mt-4 max-h-96 overflow-y-auto space-y-4">
                        {selectedJurnals.length > 0 ? (
                            selectedJurnals.map(jurnal => (
                                <div key={jurnal.id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <p className="font-semibold text-gray-800">{format(new Date(jurnal.tanggal), "EEEE, dd MMMM yyyy", { locale: id })}</p>
                                        <StatusBadge status={jurnal.status_validasi} />
                                    </div>
                                    <p className="mt-2 text-gray-600 whitespace-pre-wrap">{jurnal.kegiatan}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-8">Belum ada jurnal yang diisi oleh siswa ini.</p>
                        )}
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button onClick={closeJurnalModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Tutup</button>
                    </div>
                </div>
            </Modal>
            
            {/* Modal untuk Upload Surat Balasan */}
            <Modal show={isUploadModalOpen} onClose={closeUploadModal}>
                <form onSubmit={handleUploadSubmit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">Upload Surat Balasan DUDI</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Upload surat balasan untuk DUDI: <strong>{selectedDudi?.nama_perusahaan}</strong>
                    </p>
                    <div className="mt-6">
                        <InputLabel htmlFor="surat_balasan" value="File Surat Balasan (PDF/JPG/PNG)" />
                        <input type="file" id="surat_balasan" onChange={(e) => setData('surat_balasan', e.target.files[0])} className="mt-1 block w-full" required />
                        <InputError message={errors.surat_balasan} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="status" value="Status Jawaban" />
                        <select id="status" value={data.status} onChange={(e) => setData('status', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                            <option>Diterima DUDI</option>
                            <option>Ditolak DUDI</option>
                        </select>
                        <InputError message={errors.status} className="mt-2" />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton type="button" onClick={closeUploadModal}>Batal</SecondaryButton>
                        <PrimaryButton className="ml-3" disabled={processing}>Simpan Status</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
