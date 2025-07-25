import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({ auth }) {
    // Inisialisasi form dengan useForm
    const { data, setData, post, processing, errors } = useForm({
        nama_lengkap: '',
        kontak: '',
        pekerjaan: '',
    });

    // Fungsi untuk menangani submit form
    const submit = (e) => {
        e.preventDefault();
        // Kirim data form ke rute 'orangtua.store'
        post(route('orangtua.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tambah Data Orang Tua Baru</h2>}
        >
            <Head title="Tambah Orang Tua" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            
                            <form onSubmit={submit}>
                                <div>
                                    <InputLabel htmlFor="nama_lengkap" value="Nama Lengkap Wali" />
                                    <TextInput
                                        id="nama_lengkap"
                                        name="nama_lengkap"
                                        value={data.nama_lengkap}
                                        className="mt-1 block w-full"
                                        autoComplete="off"
                                        isFocused={true}
                                        onChange={(e) => setData('nama_lengkap', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.nama_lengkap} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="kontak" value="Kontak (No. HP)" />
                                    <TextInput
                                        id="kontak"
                                        name="kontak"
                                        value={data.kontak}
                                        className="mt-1 block w-full"
                                        autoComplete="off"
                                        onChange={(e) => setData('kontak', e.target.value)}
                                    />
                                    <InputError message={errors.kontak} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="pekerjaan" value="Pekerjaan" />
                                    <TextInput
                                        id="pekerjaan"
                                        name="pekerjaan"
                                        value={data.pekerjaan}
                                        className="mt-1 block w-full"
                                        autoComplete="off"
                                        onChange={(e) => setData('pekerjaan', e.target.value)}
                                    />
                                    <InputError message={errors.pekerjaan} className="mt-2" />
                                </div>
                                
                                <div className="flex items-center justify-end mt-4">
                                    <PrimaryButton className="ms-4" disabled={processing}>
                                        Simpan
                                    </PrimaryButton>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
