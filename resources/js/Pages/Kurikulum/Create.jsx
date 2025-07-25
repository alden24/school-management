import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import Checkbox from '@/Components/Checkbox';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        nama_kurikulum: '',
        is_active: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('kurikulum.store'));
    };

    return (
        <AuthenticatedLayout header="Tambah Kurikulum Baru">
            <Head title="Tambah Kurikulum" />
            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <form onSubmit={submit} className="p-6 space-y-6">
                        <div>
                            <InputLabel htmlFor="nama_kurikulum" value="Nama Kurikulum (Contoh: Kurikulum Merdeka)" />
                            <TextInput id="nama_kurikulum" value={data.nama_kurikulum} onChange={(e) => setData('nama_kurikulum', e.target.value)} className="mt-1 block w-full" required />
                            <InputError message={errors.nama_kurikulum} className="mt-2" />
                        </div>
                        <div className="block">
                            <label className="flex items-center">
                                <Checkbox name="is_active" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                                <span className="ml-2 text-sm text-gray-600">Jadikan Kurikulum Aktif</span>
                            </label>
                            <p className="text-xs text-gray-500 mt-1">Jika ini dicentang, kurikulum lain yang aktif akan otomatis dinonaktifkan.</p>
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
