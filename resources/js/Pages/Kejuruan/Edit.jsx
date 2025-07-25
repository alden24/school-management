import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Edit({ auth, kejuruan }) {
    const { data, setData, put, processing, errors } = useForm({
        nama_kejuruan: kejuruan.nama_kejuruan || '',
        singkatan: kejuruan.singkatan || '',
        deskripsi: kejuruan.deskripsi || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('kejuruan.update', kejuruan.id));
    };

    return (
        <AuthenticatedLayout header="Edit Kejuruan">
            <Head title="Edit Kejuruan" />
            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                    <form onSubmit={submit} className="p-4 sm:p-6 space-y-6">
                        <div>
                            <InputLabel htmlFor="nama_kejuruan" value="Nama Kejuruan" />
                            <TextInput id="nama_kejuruan" value={data.nama_kejuruan} onChange={(e) => setData('nama_kejuruan', e.target.value)} className="mt-1 block w-full" required />
                            <InputError message={errors.nama_kejuruan} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="singkatan" value="Singkatan (Contoh: TKJ, RPL)" />
                            <TextInput id="singkatan" value={data.singkatan} onChange={(e) => setData('singkatan', e.target.value)} className="mt-1 block w-full" />
                            <InputError message={errors.singkatan} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="deskripsi" value="Deskripsi (Opsional)" />
                            <textarea id="deskripsi" value={data.deskripsi} onChange={(e) => setData('deskripsi', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
                            <InputError message={errors.deskripsi} className="mt-2" />
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
