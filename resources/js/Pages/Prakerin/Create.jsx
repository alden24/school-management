import { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';

// --- Komponen Baru: SearchableSelect ---
// Komponen dropdown yang bisa dicari
const SearchableSelect = ({ options, value, onChange, placeholder = "Pilih..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef(null);

    const selectedOption = options.find(option => option.value === value);

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Menutup dropdown saat klik di luar komponen
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const handleSelectOption = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm p-2 bg-white cursor-pointer flex justify-between items-center"
            >
                <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <svg className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    <div className="p-2">
                        <input
                            type="text"
                            placeholder="Cari..."
                            className="w-full px-3 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <ul className="max-h-60 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <li
                                    key={option.value}
                                    onClick={() => handleSelectOption(option.value)}
                                    className="px-4 py-2 hover:bg-indigo-50 cursor-pointer"
                                >
                                    {option.label}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-gray-500">Tidak ada hasil</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};


export default function Create({ auth, siswas, dudis, gurus }) {
    const { data, setData, post, processing, errors } = useForm({
        siswa_id: '',
        dudi_id: '',
        guru_pembimbing_id: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('penempatan-prakerin.store'));
    };

    // Ubah data menjadi format yang dibutuhkan oleh SearchableSelect
    const siswaOptions = siswas.map(siswa => ({
        value: siswa.id,
        label: `${siswa.nama_lengkap} (${siswa.nisn})`
    }));

    const guruOptions = gurus.map(guru => ({
        value: guru.id,
        label: guru.nama_lengkap
    }));

    const dudiOptions = dudis.map(dudi => ({
        value: dudi.id,
        label: dudi.nama_perusahaan
    }));

    return (
        <AuthenticatedLayout header="Form Penempatan Prakerin">
            <Head title="Tempatkan Siswa" />
            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                    <form onSubmit={submit} className="p-4 sm:p-6 space-y-6">
                        <div>
                            <InputLabel htmlFor="siswa_id" value="Pilih Siswa" />
                            <SearchableSelect
                                options={siswaOptions}
                                value={data.siswa_id}
                                onChange={(value) => setData('siswa_id', value)}
                                placeholder="Cari atau pilih siswa..."
                            />
                            <InputError message={errors.siswa_id} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="dudi_id" value="Pilih Perusahaan (DUDI)" />
                            <SearchableSelect
                                options={dudiOptions}
                                value={data.dudi_id}
                                onChange={(value) => setData('dudi_id', value)}
                                placeholder="Cari atau pilih perusahaan..."
                            />
                            <InputError message={errors.dudi_id} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="guru_pembimbing_id" value="Pilih Guru Pembimbing" />
                            <SearchableSelect
                                options={guruOptions}
                                value={data.guru_pembimbing_id}
                                onChange={(value) => setData('guru_pembimbing_id', value)}
                                placeholder="Cari atau pilih guru..."
                            />
                            <InputError message={errors.guru_pembimbing_id} className="mt-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="tanggal_mulai" value="Tanggal Mulai" />
                                <input type="date" id="tanggal_mulai" value={data.tanggal_mulai} onChange={(e) => setData('tanggal_mulai', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                                <InputError message={errors.tanggal_mulai} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="tanggal_selesai" value="Tanggal Selesai" />
                                <input type="date" id="tanggal_selesai" value={data.tanggal_selesai} onChange={(e) => setData('tanggal_selesai', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                                <InputError message={errors.tanggal_selesai} className="mt-2" />
                            </div>
                        </div>
                        <div className="flex items-center justify-end">
                            <PrimaryButton disabled={processing}>Simpan Penempatan</PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
