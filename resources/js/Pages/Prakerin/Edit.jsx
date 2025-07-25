import { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';

// Komponen SearchableSelect
const SearchableSelect = ({ options, value, onChange, placeholder = "Pilih..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef(null);
    const selectedOption = options.find(option => option.value === value);
    const filteredOptions = options.filter(option => option.label.toLowerCase().includes(searchTerm.toLowerCase()));

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleSelectOption = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <div onClick={() => setIsOpen(!isOpen)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white cursor-pointer">
                <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>{selectedOption ? selectedOption.label : placeholder}</span>
            </div>
            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                    <input type="text" placeholder="Cari..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-2 border-b" />
                    <ul className="max-h-60 overflow-y-auto">
                        {filteredOptions.map(option => (
                            <li key={option.value} onClick={() => handleSelectOption(option.value)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">{option.label}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default function Edit({ auth, penempatan, siswas, dudis, gurus }) {
    const { data, setData, put, processing, errors } = useForm({
        siswa_id: penempatan.siswa_id || '',
        dudi_id: penempatan.dudi_id || '',
        guru_pembimbing_id: penempatan.guru_pembimbing_id || '',
        tanggal_mulai: penempatan.tanggal_mulai || '',
        tanggal_selesai: penempatan.tanggal_selesai || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('penempatan-prakerin.update', penempatan.id));
    };

    const siswaOptions = siswas.map(s => ({ value: s.id, label: `${s.nama_lengkap} (${s.nisn})` }));
    const dudiOptions = dudis.map(d => ({ value: d.id, label: d.nama_perusahaan }));
    const guruOptions = gurus.map(g => ({ value: g.id, label: g.nama_lengkap }));

    return (
        <AuthenticatedLayout header="Edit Penempatan Prakerin">
            <Head title="Edit Penempatan" />
            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                    <form onSubmit={submit} className="p-4 sm:p-6 space-y-6">
                        <div>
                            <InputLabel htmlFor="siswa_id" value="Siswa" />
                            <SearchableSelect options={siswaOptions} value={data.siswa_id} onChange={(value) => setData('siswa_id', value)} placeholder="Cari atau pilih siswa..." />
                            <InputError message={errors.siswa_id} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="dudi_id" value="Perusahaan (DUDI)" />
                            <SearchableSelect options={dudiOptions} value={data.dudi_id} onChange={(value) => setData('dudi_id', value)} placeholder="Cari atau pilih perusahaan..." />
                            <InputError message={errors.dudi_id} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="guru_pembimbing_id" value="Guru Pembimbing" />
                            <SearchableSelect options={guruOptions} value={data.guru_pembimbing_id} onChange={(value) => setData('guru_pembimbing_id', value)} placeholder="Cari atau pilih guru..." />
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
                            <PrimaryButton disabled={processing}>Update Penempatan</PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
