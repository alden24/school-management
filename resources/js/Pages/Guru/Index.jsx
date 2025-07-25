import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';

const DetailItem = ({ label, value }) => (
    <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value || '-'}</dd>
    </div>
);

export default function Index({ auth, gurus }) {
    const { flash = {} } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGuru, setSelectedGuru] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // State untuk pencarian

    const openDetailModal = (guru) => {
        setSelectedGuru(guru);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedGuru(null);
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data guru ini?')) {
            router.delete(route('guru.destroy', id));
        }
    };

    const handleResetPassword = (id) => {
        if (confirm('Apakah Anda yakin ingin mereset password guru ini?')) {
            router.post(route('guru.reset-password', id), {}, {
                onSuccess: () => closeModal(),
            });
        }
    };

    const filteredGurus = gurus.filter(guru => {
      const term = searchTerm.toLowerCase();
      return (
          guru.nama_lengkap.toLowerCase().includes(term) ||
          (guru.nip && guru.nip.toLowerCase().includes(term)) ||
          (guru.nuptk && guru.nuptk.toLowerCase().includes(term))
      );
  });


    return (
        <AuthenticatedLayout header="Manajemen Guru">
            <Head title="Data Guru" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* 2. Tambahkan semua blok notifikasi di sini */}
                    {flash.newUser && (
                        <div className="bg-blue-100 border-t-4 border-blue-500 rounded-b text-blue-900 px-4 py-3 shadow-md mb-6" role="alert">
                            <div className="flex">
                                <div className="py-1"><svg className="fill-current h-6 w-6 text-blue-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                                <div>
                                    <p className="font-bold">Akun Guru Baru Berhasil Dibuat!</p>
                                    <ul className="list-disc list-inside mt-2 text-sm">
                                        <li><strong>Nama:</strong> {flash.newUser.name}</li>
                                        <li><strong>Email:</strong> {flash.newUser.email}</li>
                                        <li><strong>Password:</strong> <span className="font-mono bg-blue-200 px-2 py-1 rounded">{flash.newUser.password}</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                    {flash.newPasswordInfo && (
                        <div className="bg-yellow-100 border-t-4 border-yellow-500 rounded-b text-yellow-900 px-4 py-3 shadow-md mb-6" role="alert">
                            <div className="flex">
                                <div className="py-1"><svg className="fill-current h-6 w-6 text-yellow-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                                <div>
                                    <p className="font-bold">Password Berhasil Direset!</p>
                                    <p className="text-sm">Password baru untuk guru <strong>{flash.newPasswordInfo.name}</strong> adalah: <span className="font-mono bg-yellow-200 px-2 py-1 rounded">{flash.newPasswordInfo.password}</span></p>
                                </div>
                            </div>
                        </div>
                    )}
                    {flash.message && !flash.newUser && !flash.newPasswordInfo && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p>{flash.message}</p></div>
                    )}

                      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                        <Link href={route('guru.create')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded inline-block w-full sm:w-auto text-center">
                            Tambah Guru
                        </Link>
                        <div className="w-full sm:w-1/3">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari Nama, NIP, atau NUPTK..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow-md rounded-lg">
                        <table className="min-w-full">
                            <thead className="hidden md:table-header-group">
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Guru</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIP / NUPTK</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spesialisasi</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {/* PERBAIKAN: Gunakan 'filteredGurus' bukan 'gurus' */}
                                {filteredGurus.map((guru) => (
                                    <tr key={guru.id} className="block md:table-row border-b md:border-none mb-4 md:mb-0">
                                        <td className="p-4 md:px-6 md:py-4 whitespace-nowrap block md:table-cell">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img className="h-10 w-10 rounded-full object-cover" src={guru.foto_url} alt={guru.nama_lengkap} />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{guru.nama_lengkap}</div>
                                                    <div className="text-sm text-gray-500">{guru.user?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap block md:table-cell">
                                            <span className="md:hidden font-bold text-gray-500">NIP/NUPTK: </span>{guru.nip || guru.nuptk || '-'}
                                        </td>
                                        <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap block md:table-cell">
                                            <span className="md:hidden font-bold text-gray-500">Spesialisasi: </span>{guru.spesialisasi_mapel}
                                        </td>
                                        <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm font-medium block md:table-cell">
                                            <span className="md:hidden font-bold text-gray-500">Aksi: </span>
                                            <button onClick={() => openDetailModal(guru)} className="text-gray-600 hover:text-gray-900 mr-4">Detail</button>
                                            <Link href={route('guru.edit', guru.id)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                                            <button onClick={() => handleDelete(guru.id)} className="text-red-600 hover:text-red-900">Hapus</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Komponen Modal untuk Menampilkan Detail */}
            <Modal show={isModalOpen} onClose={closeModal}>
                <div className="p-6">
                    {selectedGuru && (
                        <>
                            <div className="flex flex-col items-center">
                                <img className="w-32 h-32 rounded-full object-cover mb-4" src={selectedGuru.foto_url} alt={selectedGuru.nama_lengkap} />
                                <h2 className="text-2xl font-bold text-gray-900">{selectedGuru.nama_lengkap}</h2>
                                <p className="text-sm text-gray-500">{selectedGuru.user?.email}</p>
                            </div>
                            <dl className="mt-5 divide-y divide-gray-200">
                                <div className="py-3">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Data Kepegawaian</h3>
                                    <DetailItem label="NIP" value={selectedGuru.nip} />
                                    <DetailItem label="NUPTK" value={selectedGuru.nuptk} />
                                    <DetailItem label="NIK" value={selectedGuru.nik} />
                                    <DetailItem label="NPWP" value={selectedGuru.npwp} />
                                    <DetailItem label="Spesialisasi" value={selectedGuru.spesialisasi_mapel} />
                                    <DetailItem label="Kontak" value={selectedGuru.kontak} />
                                </div>
                                <div className="py-3">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Data Pribadi</h3>
                                    <DetailItem label="Nama Ibu Kandung" value={selectedGuru.nama_ibu_kandung} />
                                    <DetailItem label="Tempat, Tanggal Lahir" value={`${selectedGuru.tempat_lahir}, ${selectedGuru.tanggal_lahir}`} />
                                    <DetailItem label="Jenis Kelamin" value={selectedGuru.jenis_kelamin} />
                                    <DetailItem label="Agama" value={selectedGuru.agama} />
                                    <DetailItem label="Status Perkawinan" value={selectedGuru.status_perkawinan} />
                                    <DetailItem label="Alamat" value={selectedGuru.alamat} />
                                </div>
                            </dl>
                        </>
                    )}

                    <div className="mt-6 flex justify-between items-center">
                        <button
                            onClick={() => handleResetPassword(selectedGuru.id)}
                            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 font-semibold"
                        >
                            Reset Password
                        </button>
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
