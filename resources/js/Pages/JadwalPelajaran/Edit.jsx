import { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

// --- Komponen SearchableSelect ---
const SearchableSelect = ({ options, value, onChange, placeholder = "Pilih..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef(null);

    const selectedOption = options.find(option => option.value === value);

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>{selectedOption ? selectedOption.label : placeholder}</span>
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


export default function Edit({ auth, jadwal, semesters, kelases, mataPelajarans, gurus }) {
    const { data, setData, put, processing, errors } = useForm({
        semester_id: jadwal.semester_id || '',
        kelas_id: jadwal.kelas_id || '',
        mata_pelajaran_id: jadwal.mata_pelajaran_id || '',
        guru_id: jadwal.guru_id || '',
        hari: jadwal.hari || 'Senin',
        jam_mulai: jadwal.jam_mulai || '',
        jam_selesai: jadwal.jam_selesai || '',
    });

    const [startTimeError, setStartTimeError] = useState('');
    const [endTimeError, setEndTimeError] = useState(''); // State baru untuk error jam selesai

    const validStartTimes = ['07:00', '07:45', '08:30', '09:15', '10:20', '11:05', '12:20', '13:05', '13:50', '14:35'];
    const validEndTimes = ['07:45', '08:30', '09:15', '10:00', '11:05', '11:50', '13:05', '13:50', '14:35', '15:20'];

    const handleJamMulaiChange = (e) => {
        const newTime = e.target.value;
        setData('jam_mulai', newTime);
        if (newTime && !validStartTimes.includes(newTime)) {
            setStartTimeError('Jam mulai tidak sesuai dengan slot waktu yang tersedia.');
        } else {
            setStartTimeError('');
        }
    };

    const handleJamSelesaiChange = (e) => {
        const newTime = e.target.value;
        setData('jam_selesai', newTime);
        if (newTime && !validEndTimes.includes(newTime)) {
            setEndTimeError('Jam selesai tidak sesuai dengan slot waktu yang tersedia.');
        } else {
            setEndTimeError('');
        }
    };

    const submit = (e) => {
        e.preventDefault();
        if (timeError) {
            alert('Perbaiki jam mulai sebelum menyimpan.');
            return;
        }
        put(route('jadwal-pelajaran.update', jadwal.id));
    };

    const guruOptions = gurus.map(guru => ({
        value: guru.id,
        label: guru.nama_lengkap
    }));

    return (
        <AuthenticatedLayout header="Edit Jadwal Pelajaran">
            <Head title="Edit Jadwal" />
            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <form onSubmit={submit} className="p-6 space-y-6">
                         <div>
                            <InputLabel htmlFor="semester_id" value="Semester" />
                            <select id="semester_id" value={data.semester_id} onChange={(e) => setData('semester_id', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
                                {semesters.map((s) => (<option key={s.id} value={s.id}>{s.nama}</option>))}
                            </select>
                            <InputError message={errors.semester_id} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="kelas_id" value="Kelas" />
                            <select id="kelas_id" value={data.kelas_id} onChange={(e) => setData('kelas_id', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
                                {kelases.map((k) => (<option key={k.id} value={k.id}>{k.nama_kelas}</option>))}
                            </select>
                            <InputError message={errors.kelas_id} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="mata_pelajaran_id" value="Mata Pelajaran" />
                            <select id="mata_pelajaran_id" value={data.mata_pelajaran_id} onChange={(e) => setData('mata_pelajaran_id', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
                                {mataPelajarans.map((m) => (<option key={m.id} value={m.id}>{m.nama_mapel}</option>))}
                            </select>
                            <InputError message={errors.mata_pelajaran_id} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="guru_id" value="Guru Pengajar" />
                            <SearchableSelect
                                options={guruOptions}
                                value={data.guru_id}
                                onChange={(value) => setData('guru_id', value)}
                                placeholder="Cari atau pilih guru..."
                            />
                            <InputError message={errors.guru_id} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="hari" value="Hari" />
                            <select id="hari" value={data.hari} onChange={(e) => setData('hari', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
                                <option>Senin</option>
                                <option>Selasa</option>
                                <option>Rabu</option>
                                <option>Kamis</option>
                                <option>Jumat</option>
                                <option>Sabtu</option>
                            </select>
                            <InputError message={errors.hari} className="mt-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="jam_mulai" value="Jam Mulai" />
                                <input 
                                    type="time" 
                                    id="jam_mulai" 
                                    value={data.jam_mulai} 
                                    onChange={handleJamMulaiChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" 
                                    required 
                                />
                                {startTimeError && <p className="text-sm text-red-600 mt-1">{startTimeError}</p>}
                                <InputError message={errors.jam_mulai} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="jam_selesai" value="Jam Selesai" />
                                <input 
                                    type="time" 
                                    id="jam_selesai" 
                                    value={data.jam_selesai} 
                                    onChange={handleJamSelesaiChange} // Gunakan fungsi baru
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" 
                                    required 
                                />
                                {endTimeError && <p className="text-sm text-red-600 mt-1">{endTimeError}</p>}
                                <InputError message={errors.jam_selesai} className="mt-2" />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-4">
                            <Link href={route('jadwal-pelajaran.index')} className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150">
                                Batal
                            </Link>
                            <PrimaryButton disabled={processing}>Update</PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
