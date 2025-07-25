import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputError from '@/Components/InputError';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// Komponen untuk satu entri jurnal
const JurnalEntry = ({ jurnal }) => {
    const [showRevisi, setShowRevisi] = useState(false);
    const { data, setData, put, processing, errors, reset } = useForm({
        status_validasi: '',
        catatan_pembimbing: '',
    });

    const handleValidation = (status) => {
        if (status === 'Revisi') {
            setShowRevisi(true);
        } else {
            setData('status_validasi', status);
            put(route('validasi.jurnal.update', jurnal.id), {
                preserveScroll: true,
                onSuccess: () => reset(),
            });
        }
    };

    const submitRevisi = (e) => {
        e.preventDefault();
        setData('status_validasi', 'Revisi');
        put(route('validasi.jurnal.update', jurnal.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowRevisi(false);
                reset();
            },
        });
    };

    const getStatusClass = (status) => {
        if (status === 'Disetujui') return 'bg-green-100 text-green-800';
        if (status === 'Revisi') return 'bg-yellow-100 text-yellow-800';
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-semibold text-gray-800">{format(new Date(jurnal.tanggal), "EEEE, dd MMMM yyyy", { locale: id })}</p>
                    <p className="mt-1 text-gray-600 whitespace-pre-wrap">{jurnal.kegiatan}</p>
                </div>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(jurnal.status_validasi)}`}>
                    {jurnal.status_validasi}
                </span>
            </div>
            
            {showRevisi ? (
                <form onSubmit={submitRevisi} className="mt-2 space-y-2">
                    <textarea 
                        value={data.catatan_pembimbing}
                        onChange={(e) => setData('catatan_pembimbing', e.target.value)}
                        placeholder="Tulis catatan revisi di sini..."
                        className="w-full border-gray-300 rounded-md shadow-sm"
                    ></textarea>
                    <InputError message={errors.catatan_pembimbing} />
                    <div className="flex justify-end gap-2">
                        <SecondaryButton type="button" onClick={() => setShowRevisi(false)}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processing}>Kirim Revisi</PrimaryButton>
                    </div>
                </form>
            ) : (
                <div className="flex justify-end gap-2">
                    <button onClick={() => handleValidation('Disetujui')} className="text-sm font-medium text-green-600 hover:text-green-800" disabled={processing}>Setujui</button>
                    <button onClick={() => handleValidation('Revisi')} className="text-sm font-medium text-yellow-600 hover:text-yellow-800" disabled={processing}>Minta Revisi</button>
                </div>
            )}
        </div>
    );
};

export default function Index({ auth, jurnalsBySiswa }) {
    const { flash = {} } = usePage().props;

    return (
        <AuthenticatedLayout header="Validasi Jurnal Harian">
            <Head title="Validasi Jurnal" />
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {flash.message && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert"><p>{flash.message}</p></div>}
                    
                    {Object.keys(jurnalsBySiswa).length > 0 ? (
                        Object.entries(jurnalsBySiswa).map(([namaSiswa, jurnals]) => (
                            <div key={namaSiswa} className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Jurnal dari: {namaSiswa}</h2>
                                <div className="space-y-4">
                                    {jurnals.map(jurnal => <JurnalEntry key={jurnal.id} jurnal={jurnal} />)}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                            <p className="text-gray-500">Tidak ada jurnal yang perlu divalidasi saat ini.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
