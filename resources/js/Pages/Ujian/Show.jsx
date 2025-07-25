import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react'; // Import router
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import ReactQuill from 'react-quill'; // 1. Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import CSS untuk editor

// Komponen untuk menampilkan satu soal
const SoalCard = ({ soal, onEdit, onDelete }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-start">
                {/* Menampilkan konten HTML dari editor */}
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: soal.pertanyaan }} />
                <div className="flex space-x-2 flex-shrink-0 ml-4">
                    <button onClick={() => onEdit(soal)} className="text-sm text-indigo-600 hover:text-indigo-900">Edit</button>
                    <button onClick={() => onDelete(soal.id)} className="text-sm text-red-600 hover:text-red-900">Hapus</button>
                </div>
            </div>
            {soal.gambar_soal && (
                <div className="mt-4">
                    <img src={soal.gambar_url} alt="Gambar Soal" className="max-w-xs rounded-lg" />
                </div>
            )}
            {soal.tipe_soal === 'pilihan_ganda' && (
                <div className="mt-4 space-y-2">
                    {soal.pilihan_jawabans.map(pilihan => (
                        <div key={pilihan.id} className={`p-2 rounded-md text-sm ${pilihan.is_benar ? 'bg-green-100 border border-green-300 text-green-800 font-semibold' : 'bg-gray-50'}`}>
                            {pilihan.pilihan}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Komponen utama
export default function Show({ auth, ujian }) {
    const { flash = {}, errors } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        id: null,
        ujian_id: ujian.id,
        pertanyaan: '',
        tipe_soal: 'pilihan_ganda',
        gambar_soal: null, // 2. Tambahkan field gambar_soal
        pilihan_jawabans: [
            { pilihan: '', is_benar: true },
            { pilihan: '', is_benar: false },
            { pilihan: '', is_benar: false },
            { pilihan: '', is_benar: false },
        ],
    });

    const [gambarPreview, setGambarPreview] = useState(null);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        setGambarPreview(null);
        reset();
    };

    const handleAddSoal = () => {
        setIsEditing(false);
        reset();
        setData('ujian_id', ujian.id);
        openModal();
    };

    const handleEditSoal = (soal) => {
        setIsEditing(true);
        setData({
            id: soal.id,
            ujian_id: ujian.id,
            pertanyaan: soal.pertanyaan,
            tipe_soal: soal.tipe_soal,
            gambar_soal: null, // Reset input file
            pilihan_jawabans: soal.pilihan_jawabans.length > 0 ? soal.pilihan_jawabans : [
                { pilihan: '', is_benar: true }, { pilihan: '', is_benar: false },
            ],
        });
        setGambarPreview(soal.gambar_url);
        openModal();
    };

    const handleDeleteSoal = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus soal ini?')) {
            router.delete(route('soal.destroy', id), { preserveScroll: true });
        }
    };

    const handlePilihanChange = (index, value) => {
        const newPilihan = [...data.pilihan_jawabans];
        newPilihan[index].pilihan = value;
        setData('pilihan_jawabans', newPilihan);
    };

    const handleJawabanBenarChange = (index) => {
        const newPilihan = data.pilihan_jawabans.map((p, i) => ({ ...p, is_benar: i === index }));
        setData('pilihan_jawabans', newPilihan);
    };

    const handleGambarChange = (e) => {
        const file = e.target.files[0];
        setData('gambar_soal', file);
        if (file) {
            setGambarPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        const url = isEditing ? route('soal.update', data.id) : route('soal.store');
        // Gunakan router.post untuk menangani file upload
        router.post(url, {
            ...data,
            _method: isEditing ? 'PUT' : 'POST', // Spoofing method untuk update
        }, {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AuthenticatedLayout header={`Kelola Soal: ${ujian.judul}`}>
            <Head title="Kelola Soal" />
            <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 py-12">
                {flash.message && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p>{flash.message}</p></div>}
                {Object.keys(errors).length > 0 && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert"><p>Terdapat kesalahan pada input Anda.</p></div>}

                <div className="flex justify-end mb-4">
                    <PrimaryButton onClick={handleAddSoal}>Tambah Soal</PrimaryButton>
                </div>
                
                <div className="space-y-4">
                    {ujian.soals.length > 0 ? (
                        ujian.soals.map((soal, index) => (
                            <div key={soal.id} className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">{index + 1}</div>
                                <div className="flex-grow">
                                    <SoalCard soal={soal} onEdit={handleEditSoal} onDelete={handleDeleteSoal} />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                            <p className="text-gray-500">Belum ada soal di ujian ini.</p>
                        </div>
                    )}
                </div>

                <Modal show={isModalOpen} onClose={closeModal}>
                    <form onSubmit={submit} className="p-6">
                        <h2 className="text-lg font-medium text-gray-900">{isEditing ? 'Edit Soal' : 'Tambah Soal Baru'}</h2>
                        <div className="mt-6">
                            <InputLabel htmlFor="pertanyaan" value="Pertanyaan" />
                            {/* 3. Ganti textarea dengan ReactQuill */}
                            <ReactQuill theme="snow" value={data.pertanyaan} onChange={(value) => setData('pertanyaan', value)} className="mt-1 bg-white" />
                            <InputError message={errors.pertanyaan} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="gambar_soal" value="Gambar Soal (Opsional)" />
                            <input type="file" id="gambar_soal" onChange={handleGambarChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                            {gambarPreview && <img src={gambarPreview} alt="Preview" className="mt-2 max-w-xs rounded-lg" />}
                            <InputError message={errors.gambar_soal} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel value="Tipe Soal" />
                            <div className="flex space-x-4 mt-2">
                                <label className="flex items-center"><input type="radio" name="tipe_soal" value="pilihan_ganda" checked={data.tipe_soal === 'pilihan_ganda'} onChange={e => setData('tipe_soal', e.target.value)} className="mr-2" /> Pilihan Ganda</label>
                                <label className="flex items-center"><input type="radio" name="tipe_soal" value="esai" checked={data.tipe_soal === 'esai'} onChange={e => setData('tipe_soal', e.target.value)} className="mr-2" /> Esai</label>
                            </div>
                        </div>

                        {data.tipe_soal === 'pilihan_ganda' && (
                            <div className="mt-4">
                                <InputLabel value="Opsi Jawaban (Pilih satu jawaban benar)" />
                                <div className="mt-2 space-y-2">
                                    {data.pilihan_jawabans.map((pilihan, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <input type="radio" name="jawaban_benar" checked={pilihan.is_benar} onChange={() => handleJawabanBenarChange(index)} />
                                            <TextInput value={pilihan.pilihan} onChange={e => handlePilihanChange(index, e.target.value)} className="block w-full" placeholder={`Pilihan ${index + 1}`} />
                                        </div>
                                    ))}
                                    <InputError message={errors.pilihan_jawabans} className="mt-2" />
                                </div>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end">
                            <SecondaryButton type="button" onClick={closeModal}>Batal</SecondaryButton>
                            <PrimaryButton className="ml-3" disabled={processing}>{isEditing ? 'Update Soal' : 'Simpan Soal'}</PrimaryButton>
                        </div>
                    </form>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
