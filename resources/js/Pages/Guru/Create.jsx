import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        nama_lengkap: '',
        email: '',
        nuptk: '',
        nip: '',
        nik: '',
        npwp: '',
        nama_ibu_kandung: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        jenis_kelamin: 'Laki-laki',
        status: 'Guru', 
        status_perkawinan: 'Belum Kawin',
        agama: '',
        alamat: '',
        spesialisasi_mapel: '',
        kontak: '',
        foto: null,
    });

    const [fotoPreview, setFotoPreview] = useState(null);

    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        setData('foto', file);
        if (file) {
            setFotoPreview(URL.createObjectURL(file));
        } else {
            setFotoPreview(null);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('guru.store'));
    };

    return (
        <AuthenticatedLayout header="Tambah Guru Baru">
            <Head title="Tambah Guru" />
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              
                                {/* Kolom Kiri */}
                                <div className="space-y-6">
                                    <div>
                                        <InputLabel htmlFor="nama_lengkap" value="Nama Lengkap & Gelar" />
                                        <TextInput id="nama_lengkap" value={data.nama_lengkap} onChange={(e) => setData('nama_lengkap', e.target.value)} className="mt-1 block w-full" required />
                                        <InputError message={errors.nama_lengkap} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="email" value="Email Login" />
                                        <TextInput id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="mt-1 block w-full" required />
                                        <InputError message={errors.email} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="nuptk" value="NUPTK" />
                                        <TextInput id="nuptk" value={data.nuptk} onChange={(e) => setData('nuptk', e.target.value)} className="mt-1 block w-full" />
                                        <InputError message={errors.nuptk} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="nip" value="NIP" />
                                        <TextInput id="nip" value={data.nip} onChange={(e) => setData('nip', e.target.value)} className="mt-1 block w-full" />
                                        <InputError message={errors.nip} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="nik" value="NIK" />
                                        <TextInput id="nik" value={data.nik} onChange={(e) => setData('nik', e.target.value)} className="mt-1 block w-full" />
                                        <InputError message={errors.nik} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="npwp" value="NPWP" />
                                        <TextInput id="npwp" value={data.npwp} onChange={(e) => setData('npwp', e.target.value)} className="mt-1 block w-full" />
                                        <InputError message={errors.npwp} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="nama_ibu_kandung" value="Nama Ibu Kandung" />
                                        <TextInput id="nama_ibu_kandung" value={data.nama_ibu_kandung} onChange={(e) => setData('nama_ibu_kandung', e.target.value)} className="mt-1 block w-full" />
                                        <InputError message={errors.nama_ibu_kandung} className="mt-2" />
                                    </div>
                                </div>
                                {/* Kolom Kanan */}
                                <div className="space-y-6">
                                    <div>
                                        <InputLabel htmlFor="tempat_lahir" value="Tempat Lahir" />
                                        <TextInput id="tempat_lahir" value={data.tempat_lahir} onChange={(e) => setData('tempat_lahir', e.target.value)} className="mt-1 block w-full" />
                                        <InputError message={errors.tempat_lahir} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="tanggal_lahir" value="Tanggal Lahir" />
                                        <TextInput id="tanggal_lahir" type="date" value={data.tanggal_lahir} onChange={(e) => setData('tanggal_lahir', e.target.value)} className="mt-1 block w-full" />
                                        <InputError message={errors.tanggal_lahir} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="jenis_kelamin" value="Jenis Kelamin" />
                                        <select id="jenis_kelamin" value={data.jenis_kelamin} onChange={(e) => setData('jenis_kelamin', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                            <option>Laki-laki</option>
                                            <option>Perempuan</option>
                                        </select>
                                        <InputError message={errors.jenis_kelamin} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="status" value="Status Kepegawaian" />
                                        <select id="status" value={data.status} onChange={(e) => setData('status', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                            <option>Guru</option>
                                            <option>Tendik</option>
                                        </select>
                                        <InputError message={errors.status} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="status_perkawinan" value="Status Perkawinan" />
                                        <select id="status_perkawinan" value={data.status_perkawinan} onChange={(e) => setData('status_perkawinan', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                            <option>Belum Kawin</option>
                                            <option>Kawin</option>
                                            <option>Cerai Hidup</option>
                                            <option>Cerai Mati</option>
                                        </select>
                                        <InputError message={errors.status_perkawinan} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="agama" value="Agama" />
                                        <select
                                            id="agama"
                                            value={data.agama}
                                            onChange={(e) => setData('agama', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        >
                                            <option value="">Pilih Agama</option>
                                            <option>Islam</option>
                                            <option>Kristen</option>
                                            <option>Katolik</option>
                                            <option>Hindu</option>
                                            <option>Buddha</option>
                                            <option>Konghucu</option>
                                        </select>
                                        <InputError message={errors.agama} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="alamat" value="Alamat" />
                                        <TextInput id="alamat" value={data.alamat} onChange={(e) => setData('alamat', e.target.value)} className="mt-1 block w-full" />
                                        <InputError message={errors.alamat} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="spesialisasi_mapel" value="Spesialisasi" />
                                        <TextInput id="spesialisasi_mapel" value={data.spesialisasi_mapel} onChange={(e) => setData('spesialisasi_mapel', e.target.value)} className="mt-1 block w-full" />
                                        <InputError message={errors.spesialisasi_mapel} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="kontak" value="Kontak" />
                                        <TextInput id="kontak" value={data.kontak} onChange={(e) => setData('kontak', e.target.value)} className="mt-1 block w-full" />
                                        <InputError message={errors.kontak} className="mt-2" />
                                    </div>
                                </div>
                            </div>
                            {/* Foto */}
                            <div className="mt-6">
                                <InputLabel htmlFor="foto" value="Foto" />
                                <div className="mt-2 flex items-center space-x-6">
                                    {fotoPreview ? (
                                        <img src={fotoPreview} alt="Pratinjau Foto" className="w-24 h-24 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                                            <span>Foto</span>
                                        </div>
                                    )}
                                    <input type="file" id="foto" onChange={handleFotoChange} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                                </div>
                                <InputError message={errors.foto} className="mt-2" />
                            </div>
                            <div className="flex items-center justify-end mt-6">
                                <PrimaryButton disabled={processing}>Simpan</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
