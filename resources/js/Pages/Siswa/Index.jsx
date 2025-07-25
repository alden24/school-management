import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';

// Komponen Ikon SVG
const Icon = ({ path, className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

const DetailItem = ({ label, value }) => (
    <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value || '-'}</dd>
    </div>
);

export default function Index({ auth, siswas }) {
    const { flash = {} } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSiswa, setSelectedSiswa] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const openDetailModal = (siswa) => {
        setSelectedSiswa(siswa);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedSiswa(null);
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data siswa ini?')) {
            router.delete(route('siswa.destroy', id));
        }
    };

    const handleResetPassword = (id) => {
        if (confirm('Apakah Anda yakin ingin mereset password siswa ini?')) {
            router.post(route('siswa.reset-password', id), {}, {
                onSuccess: () => closeModal(),
            });
        }
    };

    const filteredSiswa = siswas.filter(siswa =>
        siswa.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (siswa.nisn && siswa.nisn.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <AuthenticatedLayout header="Manajemen Siswa">
            <Head title="Data Siswa" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Notifikasi */}
                    {flash.newUser && (
                        <div className="bg-blue-100 border-t-4 border-blue-500 rounded-b text-blue-900 px-4 py-3 shadow-md mb-6" role="alert">
                            <div className="flex">
                                <div className="py-1"><svg className="fill-current h-6 w-6 text-blue-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                                <div>
                                    <p className="font-bold">Akun Baru Berhasil Dibuat!</p>
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
                                    <p className="text-sm">Password baru untuk siswa <strong>{flash.newPasswordInfo.name}</strong> adalah: <span className="font-mono bg-yellow-200 px-2 py-1 rounded">{flash.newPasswordInfo.password}</span></p>
                                </div>
                            </div>
                        </div>
                    )}
                    {flash.message && !flash.newUser && !flash.newPasswordInfo && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p>{flash.message}</p></div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                        <Link href={route('siswa.create')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded inline-block w-full sm:w-auto text-center">
                            Tambah Siswa
                        </Link>
                        <div className="w-full sm:w-1/3">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari Nama atau NISN..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Tampilan Kartu untuk Mobile */}
                    <div className="md:hidden space-y-4">
                        {filteredSiswa.map(siswa => (
                            <div key={siswa.id} className="bg-white p-4 rounded-lg shadow-md">
                                <div className="flex items-center space-x-4">
                                    <img className="h-12 w-12 rounded-full object-cover" src={siswa.foto_url} alt={siswa.nama_lengkap} />
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{siswa.nama_lengkap}</p>
                                        <p className="text-xs text-gray-500">NISN: {siswa.nisn}</p>
                                        <p className="text-xs text-gray-500">Kelas: {siswa.kelas?.nama_kelas || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t flex justify-end space-x-2">
                                    <button onClick={() => openDetailModal(siswa)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                                        <Icon path="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </button>
                                    <Link href={route('siswa.edit', siswa.id)} className="p-2 rounded-full hover:bg-indigo-100 text-indigo-600">
                                        <Icon path="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </Link>
                                    <button onClick={() => handleDelete(siswa.id)} className="p-2 rounded-full hover:bg-red-100 text-red-600">
                                        <Icon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tampilan Tabel untuk Desktop */}
                    <div className="hidden md:block bg-white overflow-hidden shadow-md rounded-lg">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Siswa</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NISN</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredSiswa.map((siswa) => (
                                    <tr key={siswa.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img className="h-10 w-10 rounded-full object-cover" src={siswa.foto_url} alt={siswa.nama_lengkap} />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{siswa.nama_lengkap}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{siswa.nisn}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{siswa.kelas?.nama_kelas || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button onClick={() => openDetailModal(siswa)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500" title="Detail">
                                                <Icon path="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </button>
                                            <Link href={route('siswa.edit', siswa.id)} className="p-2 rounded-full hover:bg-indigo-100 text-indigo-600" title="Edit">
                                                <Icon path="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </Link>
                                            <button onClick={() => handleDelete(siswa.id)} className="p-2 rounded-full hover:bg-red-100 text-red-600" title="Hapus">
                                                <Icon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            {/* Modal Detail */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <div className="p-6">
                    {selectedSiswa && (
                        <>
                            <div className="flex flex-col items-center">
                                <img className="w-32 h-32 rounded-full object-cover mb-4" src={selectedSiswa.foto_url} alt={selectedSiswa.nama_lengkap} />
                                <h2 className="text-2xl font-bold text-gray-900">{selectedSiswa.nama_lengkap}</h2>
                                <p className="text-sm text-gray-500">{selectedSiswa.user?.email}</p>
                            </div>
                            
                            <div className="mt-5 max-h-[60vh] overflow-y-auto pr-4">
                                <dl className="divide-y divide-gray-200">
                                    <div className="py-3">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Data Pribadi</h3>
                                        <DetailItem label="Nama Lengkap" value={selectedSiswa.nama_lengkap} />
                                        <DetailItem label="NISN" value={selectedSiswa.nisn} />
                                        <DetailItem label="NIS" value={selectedSiswa.nis} />
                                        <DetailItem label="Tempat Lahir" value={selectedSiswa.tempat_lahir} />
                                        <DetailItem label="Tanggal Lahir" value={selectedSiswa.tanggal_lahir} />
                                        <DetailItem label="Jenis Kelamin" value={selectedSiswa.jenis_kelamin} />
                                        <DetailItem label="Alamat" value={selectedSiswa.alamat} />
                                        <DetailItem label="Asal Sekolah" value={selectedSiswa.asal_sekolah} />
                                        <DetailItem label="Kelas" value={selectedSiswa.kelas?.nama_kelas} />
                                    </div>

                                    <div className="py-3">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Data Orang Tua</h3>
                                        <DetailItem label="Nama Ayah" value={selectedSiswa.orang_tua?.nama_ayah} />
                                        <DetailItem label="Pekerjaan Ayah" value={selectedSiswa.orang_tua?.pekerjaan_ayah} />
                                        <DetailItem label="Nama Ibu" value={selectedSiswa.orang_tua?.nama_ibu} />
                                        <DetailItem label="Pekerjaan Ibu" value={selectedSiswa.orang_tua?.pekerjaan_ibu} />
                                        <DetailItem label="Kontak Orang Tua" value={selectedSiswa.orang_tua?.kontak} />
                                    </div>
                                </dl>
                            </div>
                        </>
                    )}

                    <div className="mt-6 flex justify-between items-center">
                        <button
                            onClick={() => handleResetPassword(selectedSiswa.id)}
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
