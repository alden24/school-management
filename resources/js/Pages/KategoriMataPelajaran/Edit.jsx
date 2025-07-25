// File: resources/js/Pages/KategoriMataPelajaran/Edit.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Edit({ auth, kategori }) {
    const { data, setData, put, processing, errors } = useForm({
        nama_kategori: kategori.nama_kategori || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('kategori-matapelajaran.update', kategori.id));
    };

    return (
        <AuthenticatedLayout header="Edit Kategori">
            <Head title="Edit Kategori" />
            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <form onSubmit={submit} className="p-6 space-y-6">
                        <div>
                            <InputLabel htmlFor="nama_kategori" value="Nama Kategori" />
                            <TextInput id="nama_kategori" value={data.nama_kategori} onChange={(e) => setData('nama_kategori', e.target.value)} className="mt-1 block w-full" required />
                            <InputError message={errors.nama_kategori} className="mt-2" />
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