import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Edit({ auth, siswa, kelas }) {
    const { data, setData, post, processing, errors } = useForm({
        // Data Siswa
        nama_lengkap: siswa.nama_lengkap || '',
        nisn: siswa.nisn || '',
        nis: siswa.nis || '',
        tempat_lahir: siswa.tempat_lahir || '',
        tanggal_lahir: siswa.tanggal_lahir || '',
        jenis_kelamin: siswa.jenis_kelamin || 'Laki-laki',
        alamat: siswa.alamat || '',
        asal_sekolah: siswa.asal_sekolah || '',
        class_id: siswa.class_id || '',
        foto: null,

        // Data Akun Login
        email: siswa.user?.email || '',

        // Data Orang Tua
        nama_ayah: siswa.orang_tua?.nama_ayah || '',
        pekerjaan_ayah: siswa.orang_tua?.pekerjaan_ayah || '',
        nama_ibu: siswa.orang_tua?.nama_ibu || '',
        pekerjaan_ibu: siswa.orang_tua?.pekerjaan_ibu || '',
        kontak_ortu: siswa.orang_tua?.kontak || '',

        _method: 'PUT', // Penting untuk spoofing method saat ada file
    });

    const [fotoPreview, setFotoPreview] = useState(siswa.foto_url);

    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        setData('foto', file);
        if (file) {
            setFotoPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        // Gunakan router.post karena kita mengirim file
        router.post(route('siswa.update', siswa.id), data);
    };

    return (
        <AuthenticatedLayout
            header="Edit Data Siswa"
        >
            <Head title={`Edit Siswa - ${siswa.nama_lengkap}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6">
                            {/* Bagian Data Pribadi Siswa */}
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Data Pribadi Siswa</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="nama_lengkap" value="Nama Siswa" />
                                    <TextInput id="nama_lengkap" value={data.nama_lengkap} onChange={(e) => setData('nama_lengkap', e.target.value)} className="mt-1 block w-full" required />
                                    <InputError message={errors.nama_lengkap} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="nisn" value="NISN" />
                                    <TextInput id="nisn" value={data.nisn} onChange={(e) => setData('nisn', e.target.value)} className="mt-1 block w-full" required />
                                    <InputError message={errors.nisn} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="nis" value="NIS" />
                                    <TextInput id="nis" value={data.nis} onChange={(e) => setData('nis', e.target.value)} className="mt-1 block w-full" />
                                    <InputError message={errors.nis} className="mt-2" />
                                </div>
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
                                <div className="col-span-1 md:col-span-2">
                                    <InputLabel htmlFor="alamat" value="Alamat Siswa" />
                                    <TextInput id="alamat" value={data.alamat} onChange={(e) => setData('alamat', e.target.value)} className="mt-1 block w-full" />
                                    <InputError message={errors.alamat} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="asal_sekolah" value="Asal SMP/MTS" />
                                    <TextInput id="asal_sekolah" value={data.asal_sekolah} onChange={(e) => setData('asal_sekolah', e.target.value)} className="mt-1 block w-full" />
                                    <InputError message={errors.asal_sekolah} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="class_id" value="Kelas" />
                                    <select id="class_id" value={data.class_id} onChange={(e) => setData('class_id', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
                                        <option value="">Pilih Kelas</option>
                                        {kelas.map((k) => (<option key={k.id} value={k.id}>{k.nama_kelas}</option>))}
                                    </select>
                                    <InputError message={errors.class_id} className="mt-2" />
                                </div>
                            </div>
                            
                            {/* Bagian Akun Login */}
                            <hr className="my-8" />
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Akun Login Siswa</h3>
                            <div className="grid grid-cols-1">
                                <div>
                                    <InputLabel htmlFor="email" value="Email" />
                                    <TextInput id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="mt-1 block w-full" required />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Password hanya dapat diubah melalui fitur "Reset Password".</p>
                            </div>

                            {/* Bagian Data Orang Tua */}
                            <hr className="my-8" />
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Data Orang Tua</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="nama_ayah" value="Nama Ayah Kandung" />
                                    <TextInput id="nama_ayah" value={data.nama_ayah} onChange={(e) => setData('nama_ayah', e.target.value)} className="mt-1 block w-full" required />
                                    <InputError message={errors.nama_ayah} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="pekerjaan_ayah" value="Pekerjaan Ayah" />
                                    <TextInput id="pekerjaan_ayah" value={data.pekerjaan_ayah} onChange={(e) => setData('pekerjaan_ayah', e.target.value)} className="mt-1 block w-full" />
                                    <InputError message={errors.pekerjaan_ayah} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="nama_ibu" value="Nama Ibu Kandung" />
                                    <TextInput id="nama_ibu" value={data.nama_ibu} onChange={(e) => setData('nama_ibu', e.target.value)} className="mt-1 block w-full" required />
                                    <InputError message={errors.nama_ibu} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="pekerjaan_ibu" value="Pekerjaan Ibu" />
                                    <TextInput id="pekerjaan_ibu" value={data.pekerjaan_ibu} onChange={(e) => setData('pekerjaan_ibu', e.target.value)} className="mt-1 block w-full" />
                                    <InputError message={errors.pekerjaan_ibu} className="mt-2" />
                                </div>
                                <div className="md:col-span-2">
                                    <InputLabel htmlFor="kontak_ortu" value="Kontak Orang Tua (No. HP)" />
                                    <TextInput id="kontak_ortu" value={data.kontak_ortu} onChange={(e) => setData('kontak_ortu', e.target.value)} className="mt-1 block w-full" />
                                    <InputError message={errors.kontak_ortu} className="mt-2" />
                                </div>
                            </div>

                            {/* Bagian Foto Siswa */}
                            <hr className="my-8" />
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Foto Siswa</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                <div>
                                    <InputLabel htmlFor="foto" value="Ganti Foto (Opsional)" />
                                    <input type="file" id="foto" onChange={handleFotoChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                                    <InputError message={errors.foto} className="mt-2" />
                                </div>
                                {fotoPreview && (
                                    <div className="mt-4">
                                        <img src={fotoPreview} alt="Pratinjau Foto" className="w-32 h-32 rounded-full object-cover" />
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex items-center justify-end mt-8">
                                <PrimaryButton className="ms-4" disabled={processing}>
                                    Update Data Siswa
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
