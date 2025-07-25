<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $photoUrl = null;

        if ($user) {
            // Muat relasi yang relevan
            $user->load(['guru', 'siswa']);

            if ($user->role === 'guru' && $user->guru) {
                $photoUrl = $user->guru->foto_url;
            } elseif ($user->role === 'siswa' && $user->siswa) {
                $photoUrl = $user->siswa->foto_url;
            }
        }

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'foto_url' => $photoUrl, // Kirim URL foto ke frontend
                ] : null,
                // Tambahkan blok 'can' ini
                'can' => $request->user() ? [
                    'create_siswa' => $request->user()->can('create', \App\Models\Siswa::class),
                    'delete_siswa' => $request->user()->can('delete', \App\Models\Siswa::class),
                    'update_siswa' => $request->user()->can('update', \App\Models\Siswa::class),
                ] : null,
            ],

            'flash' => [
            'message' => fn () => $request->session()->get('message'),
            'newUser' => fn () => $request->session()->get('newUser'),
            'newPasswordInfo' => fn () => $request->session()->get('newPasswordInfo'), // <-- Tambahkan ini
            ],
        ]);
    }
}
