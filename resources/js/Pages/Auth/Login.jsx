import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'))
    };

    return (
        <>
            <Head title="Log in" />
            <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
                <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
                    {/* Kolom Kanan dengan Form Login */}
                    <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
                        <div className="mt-12 flex flex-col items-center">
                            <div className="w-full flex-1 mt-8">
                                <div className="flex flex-col items-center">
                                    <h1 className="text-2xl xl:text-3xl font-extrabold">
                                        Masuk ke Akun Anda
                                    </h1>
                                    <p className="text-sm text-gray-600 mt-2">
                                        Selamat datang kembali! Silakan masuk.
                                    </p>
                                </div>

                                <form onSubmit={submit} className="mx-auto max-w-xs mt-8">
                                    {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

                                    <div>
                                        <InputLabel htmlFor="email" value="Email" />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="w-full px-4 py-3 rounded-lg mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                            autoComplete="username"
                                            isFocused={true}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="nama@email.com"
                                        />
                                        <InputError message={errors.email} className="mt-2" />
                                    </div>

                                    <div className="mt-4">
                                        <InputLabel htmlFor="password" value="Password" />
                                        <TextInput
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="w-full px-4 py-3 rounded-lg mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                            autoComplete="current-password"
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Masukkan password"
                                        />
                                        <InputError message={errors.password} className="mt-2" />
                                    </div>
                                    
                                    <div className="flex justify-between items-center mt-4">
                                        <label className="flex items-center">
                                            <Checkbox name="remember" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} />
                                            <span className="ml-2 text-sm text-gray-600">Ingat saya</span>
                                        </label>
                                        {canResetPassword && (
                                            <Link href={route('password.request')} className="underline text-sm text-gray-600 hover:text-gray-900">
                                                Lupa password?
                                            </Link>
                                        )}
                                    </div>

                                    <PrimaryButton className="mt-5 w-full justify-center py-4" disabled={processing}>
                                        Masuk
                                    </PrimaryButton>
                                    <p className="mt-6 text-xs text-gray-600 text-center">
                                        Kembali ke{' '}
                                        <Link href="/" className="border-b border-gray-500 border-dotted">
                                            Halaman Utama
                                        </Link>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                    {/* Kolom Kiri dengan Gambar Branding */}
                    <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
                        <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
                            style={{ backgroundImage: "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')" }}>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
