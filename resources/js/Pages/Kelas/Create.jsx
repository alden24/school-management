import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({ auth, gurus, kejuruans }) {
    const { data, setData, post, processing, errors } = useForm({
        nama_kelas: '',
        tingkat: '',
        wali_kelas_id: '',
        kejuruan_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('kelas.store'));
    };

    return (
        <AuthenticatedLayout header="Tambah Kelas Baru">
            <Head title="Tambah Kelas" />
            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                    <form onSubmit={submit} className="p-4 sm:p-6 space-y-6">
                        <div>
                            <InputLabel htmlFor="kejuruan_id" value="Kejuruan" />
                            <select id="kejuruan_id" value={data.kejuruan_id} onChange={(e) => setData('kejuruan_id', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
                                <option value="">Pilih Kejuruan</option>
                                {kejuruans.map((kejuruan) => (
                                    <option key={kejuruan.id} value={kejuruan.id}>{kejuruan.nama_kejuruan}</option>
                                ))}
                            </select>
                            <InputError message={errors.kejuruan_id} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="nama_kelas" value="Nama Kelas" />
                            <TextInput id="nama_kelas" value={data.nama_kelas} onChange={(e) => setData('nama_kelas', e.target.value)} className="mt-1 block w-full" required />
                            <InputError message={errors.nama_kelas} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="tingkat" value="Tingkat" />
                            <TextInput id="tingkat" type="number" value={data.tingkat} onChange={(e) => setData('tingkat', e.target.value)} className="mt-1 block w-full" required />
                            <InputError message={errors.tingkat} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="wali_kelas_id" value="Wali Kelas" />
                            <select id="wali_kelas_id" value={data.wali_kelas_id} onChange={(e) => setData('wali_kelas_id', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                <option value="">Pilih Wali Kelas</option>
                                {gurus.map((guru) => (
                                    <option key={guru.id} value={guru.id}>{guru.nama_lengkap}</option>
                                ))}
                            </select>
                            <InputError message={errors.wali_kelas_id} className="mt-2" />
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
