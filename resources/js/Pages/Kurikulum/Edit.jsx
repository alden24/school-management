import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import Checkbox from '@/Components/Checkbox';

export default function Edit({ auth, kurikulum }) {
    const { data, setData, put, processing, errors } = useForm({
        nama_kurikulum: kurikulum.nama_kurikulum || '',
        is_active: kurikulum.is_active || false,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('kurikulum.update', kurikulum.id));
    };

    return (
        <AuthenticatedLayout header="Edit Kurikulum">
            <Head title="Edit Kurikulum" />
            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Perubahan: sm:rounded-lg menjadi rounded-lg agar sudutnya membulat di semua ukuran layar */}
                <div className="bg-white overflow-hidden shadow-md rounded-lg">
                    {/* Perubahan: p-6 menjadi p-4 sm:p-6 agar padding lebih sesuai di mobile */}
                    <form onSubmit={submit} className="p-4 sm:p-6 space-y-6">
                        <div>
                            <InputLabel htmlFor="nama_kurikulum" value="Nama Kurikulum" />
                            <TextInput id="nama_kurikulum" value={data.nama_kurikulum} onChange={(e) => setData('nama_kurikulum', e.target.value)} className="mt-1 block w-full" required />
                            <InputError message={errors.nama_kurikulum} className="mt-2" />
                        </div>
                        <div className="block">
                            <label className="flex items-center">
                                <Checkbox name="is_active" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                                <span className="ml-2 text-sm text-gray-600">Jadikan Kurikulum Aktif</span>
                            </label>
                            <InputError message={errors.is_active} className="mt-2" />
                        </div>
                        <div className="flex items-center justify-end">
                            <PrimaryButton disabled={processing}>Update</PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
