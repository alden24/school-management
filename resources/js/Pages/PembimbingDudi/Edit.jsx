import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Edit({ auth, pembimbing, dudis }) {
    const { data, setData, put, processing, errors } = useForm({
        dudi_id: pembimbing.dudi_id || '',
        nama_pembimbing: pembimbing.nama_pembimbing || '',
        jabatan: pembimbing.jabatan || '',
        kontak: pembimbing.kontak || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('pembimbing-dudi.update', pembimbing.id));
    };

    return (
        <AuthenticatedLayout header="Edit Data Pembimbing DUDI">
            <Head title="Edit Pembimbing DUDI" />
            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                    <form onSubmit={submit} className="p-4 sm:p-6 space-y-6">
                        <div>
                            <InputLabel htmlFor="dudi_id" value="Perusahaan (DUDI)" />
                            <select id="dudi_id" value={data.dudi_id} onChange={(e) => setData('dudi_id', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
                                <option value="">-- Pilih Perusahaan --</option>
                                {dudis.map(dudi => <option key={dudi.id} value={dudi.id}>{dudi.nama_perusahaan}</option>)}
                            </select>
                            <InputError message={errors.dudi_id} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="nama_pembimbing" value="Nama Lengkap Pembimbing" />
                            <TextInput id="nama_pembimbing" value={data.nama_pembimbing} onChange={(e) => setData('nama_pembimbing', e.target.value)} className="mt-1 block w-full" required />
                            <InputError message={errors.nama_pembimbing} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="jabatan" value="Jabatan" />
                            <TextInput id="jabatan" value={data.jabatan} onChange={(e) => setData('jabatan', e.target.value)} className="mt-1 block w-full" />
                            <InputError message={errors.jabatan} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="kontak" value="Kontak (No. HP/Email)" />
                            <TextInput id="kontak" value={data.kontak} onChange={(e) => setData('kontak', e.target.value)} className="mt-1 block w-full" />
                            <InputError message={errors.kontak} className="mt-2" />
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
