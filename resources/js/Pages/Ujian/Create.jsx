import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({ auth, jadwals }) {
    const { data, setData, post, processing, errors } = useForm({
        judul: '',
        deskripsi: '',
        jadwal_pelajaran_id: '',
        waktu_mulai: '',
        waktu_selesai: '',
        tipe: 'Ujian',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('ujian.store'));
    };

    return (
        <AuthenticatedLayout header="Buat Ujian Baru">
            <Head title="Buat Ujian" />
            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <form onSubmit={submit} className="p-6 space-y-6">
                        <div>
                            <InputLabel htmlFor="judul" value="Judul Ujian" />
                            <TextInput id="judul" value={data.judul} onChange={(e) => setData('judul', e.target.value)} className="mt-1 block w-full" required />
                            <InputError message={errors.judul} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="jadwal_pelajaran_id" value="Untuk Kelas & Mata Pelajaran" />
                            <select id="jadwal_pelajaran_id" value={data.jadwal_pelajaran_id} onChange={(e) => setData('jadwal_pelajaran_id', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
                                <option value="">Pilih Jadwal</option>
                                {jadwals.map((jadwal) => (
                                    <option key={jadwal.id} value={jadwal.id}>
                                        {jadwal.kelas.nama_kelas} - {jadwal.mata_pelajaran.nama_mapel} ({jadwal.hari})
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.jadwal_pelajaran_id} className="mt-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="waktu_mulai" value="Waktu Mulai" />
                                <input type="datetime-local" id="waktu_mulai" value={data.waktu_mulai} onChange={(e) => setData('waktu_mulai', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                                <InputError message={errors.waktu_mulai} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="waktu_selesai" value="Waktu Selesai" />
                                <input type="datetime-local" id="waktu_selesai" value={data.waktu_selesai} onChange={(e) => setData('waktu_selesai', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                                <InputError message={errors.waktu_selesai} className="mt-2" />
                            </div>
                        </div>
                        <div>
                            <InputLabel htmlFor="tipe" value="Tipe" />
                            <select id="tipe" value={data.tipe} onChange={(e) => setData('tipe', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                <option>Ujian</option>
                                <option>Kuis</option>
                                <option>Latihan</option>
                            </select>
                            <InputError message={errors.tipe} className="mt-2" />
                        </div>
                        <div className="flex items-center justify-end">
                            <PrimaryButton disabled={processing}>Buat Ujian & Tambah Soal</PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
