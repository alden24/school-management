import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

// Komponen dropdown yang bisa dicari
const SearchableSelect = ({ options, value, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const selectedOption = options.find(option => option.value === value);

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative">
            <div onClick={() => setIsOpen(!isOpen)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white cursor-pointer">
                {selectedOption ? selectedOption.label : placeholder}
            </div>
            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                    <input type="text" placeholder="Cari siswa..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-2 border-b" />
                    <ul className="max-h-60 overflow-y-auto">
                        {filteredOptions.map(option => (
                            <li key={option.value} onClick={() => { onChange(option.value); setIsOpen(false); }} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">{option.label}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default function Index({ auth, siswas, mutasiHistory }) {
    const { flash = {} } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        siswa_id: '',
        jenis_mutasi: 'Keluar',
        tanggal_mutasi: new Date().toISOString().slice(0, 10),
        keterangan: '',
    });

    const siswaOptions = siswas.map(s => ({ value: s.id, label: `${s.nama_lengkap} (${s.nisn})` }));

    const submit = (e) => {
        e.preventDefault();
        post(route('mutasi-siswa.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout header="Mutasi Siswa">
            <Head title="Mutasi Siswa" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {flash.message && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert"><p>{flash.message}</p></div>}
                    
                    {/* Form Mutasi */}
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <section>
                            <header>
                                <h2 className="text-lg font-medium text-gray-900">Proses Mutasi Siswa</h2>
                                <p className="mt-1 text-sm text-gray-600">Pilih siswa yang akan keluar, lulus, atau pindah.</p>
                            </header>
                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div>
                                    <InputLabel htmlFor="siswa_id" value="Pilih Siswa" />
                                    <SearchableSelect options={siswaOptions} value={data.siswa_id} onChange={(value) => setData('siswa_id', value)} placeholder="Cari nama atau NISN siswa..." />
                                    <InputError message={errors.siswa_id} className="mt-2" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="jenis_mutasi" value="Jenis Mutasi" />
                                        <select id="jenis_mutasi" value={data.jenis_mutasi} onChange={(e) => setData('jenis_mutasi', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                            <option>Keluar</option>
                                            <option>Lulus</option>
                                            <option>Pindah</option>
                                        </select>
                                        <InputError message={errors.jenis_mutasi} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="tanggal_mutasi" value="Tanggal Mutasi" />
                                        <TextInput id="tanggal_mutasi" type="date" value={data.tanggal_mutasi} onChange={(e) => setData('tanggal_mutasi', e.target.value)} className="mt-1 block w-full" />
                                        <InputError message={errors.tanggal_mutasi} className="mt-2" />
                                    </div>
                                </div>
                                <div>
                                    <InputLabel htmlFor="keterangan" value="Keterangan (Opsional)" />
                                    <TextInput id="keterangan" value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} className="mt-1 block w-full" />
                                    <InputError message={errors.keterangan} className="mt-2" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>Proses Mutasi</PrimaryButton>
                                </div>
                            </form>
                        </section>
                    </div>

                    {/* Riwayat Mutasi */}
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Riwayat Mutasi Siswa</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Siswa</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis Mutasi</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas Terakhir</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {mutasiHistory.map(mutasi => (
                                        <tr key={mutasi.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{mutasi.siswa.nama_lengkap}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{mutasi.jenis_mutasi}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{new Date(mutasi.tanggal_mutasi).toLocaleDateString('id-ID')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{mutasi.siswa.kelas?.nama_kelas || 'N/A'}</td>
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
