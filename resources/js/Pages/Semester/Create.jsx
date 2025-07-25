import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import Checkbox from '@/Components/Checkbox';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        nama: '',
        tahun_ajaran: '',
        semester: 'Ganjil',
        is_active: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('semester.store'));
    };

    return (
        <AuthenticatedLayout
            header="Tambah Semester Baru"
        >
            <Head title="Tambah Semester" />

            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <form onSubmit={submit} className="p-6 space-y-6">
                        <div>
                            <InputLabel htmlFor="nama" value="Nama Semester (Contoh: Ganjil 2024/2025)" />
                            <TextInput id="nama" value={data.nama} onChange={(e) => setData('nama', e.target.value)} className="mt-1 block w-full" required />
                            <InputError message={errors.nama} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="tahun_ajaran" value="Tahun Ajaran (Contoh: 2024/2025)" />
                            <TextInput id="tahun_ajaran" value={data.tahun_ajaran} onChange={(e) => setData('tahun_ajaran', e.target.value)} className="mt-1 block w-full" required />
                            <InputError message={errors.tahun_ajaran} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="semester" value="Semester" />
                            <select id="semester" value={data.semester} onChange={(e) => setData('semester', e.target.value)} className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm">
                                <option>Ganjil</option>
                                <option>Genap</option>
                            </select>
                            <InputError message={errors.semester} className="mt-2" />
                        </div>
                        <div className="block">
                            <label className="flex items-center">
                                <Checkbox name="is_active" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                                <span className="ml-2 text-sm text-gray-600">Jadikan Semester Aktif</span>
                            </label>
                            <p className="text-xs text-gray-500 mt-1">Jika ini dicentang, semester lain yang aktif akan otomatis dinonaktifkan.</p>
                            <InputError message={errors.is_active} className="mt-2" />
                        </div>
                        <div className="flex items-center justify-end">
                            <PrimaryButton disabled={processing}>Simpan</PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
