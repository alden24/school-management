import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function Index({ auth, prakerin, jurnals }) {
    const { flash = {} } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        prakerin_id: prakerin?.id || '',
        tanggal: new Date().toISOString().slice(0, 10),
        kegiatan: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('jurnal-harian.store'), {
            onSuccess: () => reset('kegiatan'),
        });
    };

    const getStatusClass = (status) => {
        if (status === 'Disetujui') return 'bg-green-100 text-green-800';
        if (status === 'Revisi') return 'bg-yellow-100 text-yellow-800';
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <AuthenticatedLayout header="Jurnal Harian Prakerin">
            <Head title="Jurnal Harian" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {flash.message && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert"><p>{flash.message}</p></div>}
                    
                    {prakerin ? (
                        <>
                            {/* Form Input Jurnal */}
                            <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                                <section>
                                    <header>
                                        <h2 className="text-lg font-medium text-gray-900">Tambah Catatan Kegiatan Hari Ini</h2>
                                        <p className="mt-1 text-sm text-gray-600">Isi dengan deskripsi kegiatan yang Anda lakukan selama Prakerin hari ini.</p>
                                    </header>
                                    <form onSubmit={submit} className="mt-6 space-y-6">
                                        <div>
                                            <InputLabel htmlFor="tanggal" value="Tanggal Kegiatan" />
                                            <input type="date" id="tanggal" value={data.tanggal} onChange={(e) => setData('tanggal', e.target.value)} className="mt-1 block w-full md:w-1/3 border-gray-300 rounded-md shadow-sm" required />
                                            <InputError message={errors.tanggal} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="kegiatan" value="Uraian Kegiatan" />
                                            <textarea id="kegiatan" value={data.kegiatan} onChange={(e) => setData('kegiatan', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" rows="5" required></textarea>
                                            <InputError message={errors.kegiatan} className="mt-2" />
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <PrimaryButton disabled={processing}>Simpan Jurnal</PrimaryButton>
                                        </div>
                                    </form>
                                </section>
                            </div>

                            {/* Riwayat Jurnal */}
                            <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Riwayat Jurnal Harian</h2>
                                <div className="space-y-4">
                                    {jurnals.map(jurnal => (
                                        <div key={jurnal.id} className="border rounded-lg p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-bold text-gray-800">{format(new Date(jurnal.tanggal), "EEEE, dd MMMM yyyy", { locale: id })}</p>
                                                    <p className="mt-2 text-gray-600 whitespace-pre-wrap">{jurnal.kegiatan}</p>
                                                </div>
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(jurnal.status_validasi)}`}>
                                                    {jurnal.status_validasi}
                                                </span>
                                            </div>
                                            {jurnal.status_validasi === 'Revisi' && jurnal.catatan_pembimbing && (
                                                <div className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 text-sm">
                                                    <strong>Catatan Revisi:</strong> {jurnal.catatan_pembimbing}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                            <p className="text-gray-500">Anda saat ini tidak sedang dalam periode Prakerin aktif.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
