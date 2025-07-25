import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Index({ auth, pengaturan }) {
    const { flash = {} } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        nama_sekolah: pengaturan.nama_sekolah || '',
        latitude_sekolah: pengaturan.latitude_sekolah || '',
        longitude_sekolah: pengaturan.longitude_sekolah || '',
        radius_lokasi: pengaturan.radius_lokasi || 100,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('pengaturan.sekolah.update'));
    };

    return (
        <AuthenticatedLayout header="Pengaturan Sekolah">
            <Head title="Pengaturan Sekolah" />
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    {flash.message && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p>{flash.message}</p></div>}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-6">
                            <header>
                                <h2 className="text-lg font-medium text-gray-900">Informasi Umum & Lokasi</h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Atur lokasi pusat sekolah dan radius yang diizinkan untuk presensi berbasis GPS.
                                </p>
                            </header>

                            <div>
                                <InputLabel htmlFor="nama_sekolah" value="Nama Sekolah" />
                                <TextInput id="nama_sekolah" value={data.nama_sekolah} onChange={(e) => setData('nama_sekolah', e.target.value)} className="mt-1 block w-full" required />
                                <InputError message={errors.nama_sekolah} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="latitude_sekolah" value="Latitude Sekolah" />
                                    <TextInput id="latitude_sekolah" value={data.latitude_sekolah} onChange={(e) => setData('latitude_sekolah', e.target.value)} className="mt-1 block w-full" required />
                                    <InputError message={errors.latitude_sekolah} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="longitude_sekolah" value="Longitude Sekolah" />
                                    <TextInput id="longitude_sekolah" value={data.longitude_sekolah} onChange={(e) => setData('longitude_sekolah', e.target.value)} className="mt-1 block w-full" required />
                                    <InputError message={errors.longitude_sekolah} className="mt-2" />
                                </div>
                            </div>
                            
                            <div>
                                <InputLabel htmlFor="radius_lokasi" value="Radius Presensi (dalam meter)" />
                                <TextInput id="radius_lokasi" type="number" value={data.radius_lokasi} onChange={(e) => setData('radius_lokasi', e.target.value)} className="mt-1 block w-full" required />
                                <p className="text-xs text-gray-500 mt-1">Jarak maksimal dari titik pusat sekolah di mana presensi dianggap valid.</p>
                                <InputError message={errors.radius_lokasi} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end">
                                <PrimaryButton disabled={processing}>Simpan Pengaturan</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
