import { useState, useEffect, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';

// Komponen Ikon
const Icon = ({ path, className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

// Komponen Timer
const Timer = ({ expiryTimestamp, onTimeUp }) => {
    const [remainingTime, setRemainingTime] = useState(0);

    useEffect(() => {
        const calculateRemaining = () => {
            const now = new Date().getTime();
            // Langsung gunakan expiryTimestamp karena formatnya sudah benar
            const expiry = new Date(expiryTimestamp).getTime();
            return Math.max(0, expiry - now);
        };

        setRemainingTime(calculateRemaining());

        const interval = setInterval(() => {
            const remaining = calculateRemaining();
            setRemainingTime(remaining);
            if (remaining <= 0) {
                clearInterval(interval);
                onTimeUp();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [expiryTimestamp, onTimeUp]);

    const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
    const seconds = Math.floor((remainingTime / 1000) % 60);

    return (
        <div className="font-mono text-2xl font-bold text-red-600">
            {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
    );
};


export default function Show({ auth, ujian }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [cheatAttempts, setCheatAttempts] = useState(0);
    const formRef = useRef();

    const { data, setData, post, processing } = useForm({
        answers: ujian.soals.map(soal => ({
            soal_id: soal.id,
            jawaban: '',
        })),
    });

    const handleAnswerChange = (soalIndex, jawabanId) => {
        const newAnswers = [...data.answers];
        newAnswers[soalIndex].jawaban = jawabanId;
        setData('answers', newAnswers);
    };

    const submit = (e) => {
        if (e) e.preventDefault();
        if (confirm('Apakah Anda yakin ingin mengirim jawaban? Anda tidak dapat mengubahnya lagi.')) {
            post(route('ujian.siswa.submit', ujian.id));
        }
    };

    // Proteksi Keluar Tab
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setCheatAttempts(prev => prev + 1);
                setShowWarningModal(true);
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, []);

    const currentSoal = ujian.soals[currentQuestionIndex];

    return (
        <>
            <Head title={ujian.judul} />
            <div className="min-h-screen bg-gray-100 flex flex-col">
                {/* Header Ujian */}
                <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-20">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">{ujian.judul}</h1>
                        <p className="text-sm text-gray-500">{ujian.jadwal_pelajaran.mata_pelajaran.nama_mapel}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Sisa Waktu</p>
                        {/* PERBAIKAN: Hapus penambahan '+ 'Z'' */}
                        <Timer expiryTimestamp={ujian.waktu_selesai} onTimeUp={() => formRef.current.requestSubmit()} />
                    </div>
                </header>

                <div className="flex-1 flex flex-col md:flex-row">
                    {/* Konten Soal (Kiri) */}
                    <main className="flex-1 p-6 md:p-8">
                        <div className="p-8 bg-white rounded-xl shadow-lg">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-xl">{currentQuestionIndex + 1}</div>
                                <div className="flex-grow">
                                    <div className="prose max-w-none text-lg" dangerouslySetInnerHTML={{ __html: currentSoal.pertanyaan }} />
                                    {currentSoal.gambar_soal && <img src={currentSoal.gambar_url} alt="Gambar Soal" className="mt-4 max-w-md rounded-lg" />}
                                </div>
                            </div>
                            {currentSoal.tipe_soal === 'pilihan_ganda' && (
                                <div className="mt-8 pl-14 space-y-4">
                                    {currentSoal.pilihan_jawabans.map(pilihan => (
                                        <label key={pilihan.id} className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${data.answers[currentQuestionIndex].jawaban === pilihan.id ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-gray-200 hover:border-indigo-400'}`}>
                                            <input
                                                type="radio"
                                                name={`soal_${currentSoal.id}`}
                                                value={pilihan.id}
                                                checked={data.answers[currentQuestionIndex].jawaban === pilihan.id}
                                                onChange={() => handleAnswerChange(currentQuestionIndex, pilihan.id)}
                                                className="h-5 w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                            />
                                            <span className="ml-4 text-gray-700">{pilihan.pilihan}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </main>

                    {/* Navigasi Soal (Kanan) */}
                    <aside className="w-full md:w-72 bg-white p-6 border-l border-gray-200">
                        <h3 className="font-bold text-gray-800 mb-4">Navigasi Soal</h3>
                        <div className="grid grid-cols-5 gap-2">
                            {ujian.soals.map((soal, index) => (
                                <button
                                    key={soal.id}
                                    onClick={() => setCurrentQuestionIndex(index)}
                                    className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold transition-all ${
                                        index === currentQuestionIndex 
                                        ? 'bg-indigo-600 text-white ring-2 ring-offset-2 ring-indigo-500' 
                                        : data.answers[index].jawaban 
                                        ? 'bg-green-500 text-white' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                        <form ref={formRef} onSubmit={submit}>
                            <PrimaryButton className="w-full mt-8" disabled={processing}>Kirim Semua Jawaban</PrimaryButton>
                        </form>
                    </aside>
                </div>
            </div>

            {/* Modal Peringatan */}
            <Modal show={showWarningModal} onClose={() => setShowWarningModal(false)}>
                <div className="p-6 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                        <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">Peringatan!</h3>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">
                            Anda terdeteksi meninggalkan halaman ujian. Tindakan ini tercatat oleh sistem.
                        </p>
                        <p className="text-sm font-bold text-red-500 mt-2">
                            Jumlah Pelanggaran: {cheatAttempts}
                        </p>
                    </div>
                    <div className="mt-4">
                        <PrimaryButton onClick={() => setShowWarningModal(false)}>Saya Mengerti</PrimaryButton>
                    </div>
                </div>
            </Modal>
        </>
    );
}
