import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Edit({ auth, matapelajaran, kategoris, kurikulums }) {
    const { data, setData, put, processing, errors } = useForm({
        nama_mapel: matapelajaran.nama_mapel || '',
        deskripsi: matapelajaran.deskripsi || '',
        kategori_id: matapelajaran.kategori_id || '',
        kurikulum_id: matapelajaran.kurikulum_id || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('matapelajaran.update', matapelajaran.id));
    };

    return (
        <AuthenticatedLayout header="Edit Mata Pelajaran">
            <Head title="Edit Mata Pelajaran" />
            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                    <form onSubmit={submit} className="p-4 sm:p-6 space-y-6">
                        <div>
                            <InputLabel htmlFor="nama_mapel" value="Nama Mata Pelajaran" />
                            <TextInput id="nama_mapel" value={data.nama_mapel} onChange={(e) => setData('nama_mapel', e.target.value)} className="mt-1 block w-full" required />
                            <InputError message={errors.nama_mapel} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="kategori_id" value="Kategori" />
                            <select id="kategori_id" value={data.kategori_id} onChange={(e) => setData('kategori_id', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
                                <option value="">Pilih Kategori</option>
                                {kategoris.map((kategori) => (
                                    <option key={kategori.id} value={kategori.id}>{kategori.nama_kategori}</option>
                                ))}
                            </select>
                            <InputError message={errors.kategori_id} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="kurikulum_id" value="Kurikulum" />
                            <select id="kurikulum_id" value={data.kurikulum_id} onChange={(e) => setData('kurikulum_id', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
                                <option value="">Pilih Kurikulum</option>
                                {kurikulums.map((kurikulum) => (
                                    <option key={kurikulum.id} value={kurikulum.id}>{kurikulum.nama_kurikulum}</option>
                                ))}
                            </select>
                            <InputError message={errors.kurikulum_id} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="deskripsi" value="Deskripsi" />
                            <TextInput id="deskripsi" value={data.deskripsi} onChange={(e) => setData('deskripsi', e.target.value)} className="mt-1 block w-full" />
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
