import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        nama_perusahaan: '',
        alamat: '',
        telepon: '',
        email_perusahaan: '',
        nama_kontak_personalia: '',
        latitude: '', // Field baru
        longitude: '', // Field baru
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('dudi.store'));
    };

    return (
        <AuthenticatedLayout header="Tambah DUDI Baru">
            <Head title="Tambah DUDI" />
            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                    <form onSubmit={submit} className="p-4 sm:p-6 space-y-6">
                        <div>
                            <InputLabel htmlFor="nama_perusahaan" value="Nama Perusahaan" />
                            <TextInput id="nama_perusahaan" value={data.nama_perusahaan} onChange={(e) => setData('nama_perusahaan', e.target.value)} className="mt-1 block w-full" required />
                            <InputError message={errors.nama_perusahaan} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="alamat" value="Alamat Lengkap Perusahaan" />
                            <textarea id="alamat" value={data.alamat} onChange={(e) => setData('alamat', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required></textarea>
                            <InputError message={errors.alamat} className="mt-2" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel htmlFor="latitude" value="Latitude" />
                                <TextInput id="latitude" value={data.latitude} onChange={(e) => setData('latitude', e.target.value)} className="mt-1 block w-full" placeholder="-6.2088" />
                                <InputError message={errors.latitude} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="longitude" value="Longitude" />
                                <TextInput id="longitude" value={data.longitude} onChange={(e) => setData('longitude', e.target.value)} className="mt-1 block w-full" placeholder="106.8456" />
                                <InputError message={errors.longitude} className="mt-2" />
                            </div>
                        </div>
                        <div>
                            <InputLabel htmlFor="telepon" value="Telepon Perusahaan" />
                            <TextInput id="telepon" value={data.telepon} onChange={(e) => setData('telepon', e.target.value)} className="mt-1 block w-full" />
                            <InputError message={errors.telepon} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="email_perusahaan" value="Email Perusahaan" />
                            <TextInput id="email_perusahaan" type="email" value={data.email_perusahaan} onChange={(e) => setData('email_perusahaan', e.target.value)} className="mt-1 block w-full" />
                            <InputError message={errors.email_perusahaan} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="nama_kontak_personalia" value="Nama Kontak Personalia (HRD)" />
                            <TextInput id="nama_kontak_personalia" value={data.nama_kontak_personalia} onChange={(e) => setData('nama_kontak_personalia', e.target.value)} className="mt-1 block w-full" />
                            <InputError message={errors.nama_kontak_personalia} className="mt-2" />
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
