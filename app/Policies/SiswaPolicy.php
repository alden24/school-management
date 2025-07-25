<?php

namespace App\Policies;

use App\Models\Siswa;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SiswaPolicy
{
    /**
     * Izinkan admin melakukan semua aksi.
     */
    public function before(User $user, string $ability): bool|null
    {
        if ($user->role === 'admin') {
            return true;
        }
        return null;
    }

    /**
     * Siapa yang boleh melihat daftar siswa?
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Siapa yang boleh melihat detail siswa?
     */
    public function view(User $user, Siswa $siswa): bool
    {
        return true;
    }

    /**
     * Siapa yang boleh membuat siswa baru?
     */
    public function create(User $user): bool
    {
        // Karena ada before(), hanya non-admin yang akan sampai sini.
        // Secara default, non-admin tidak boleh.
        return false;
    }

    /**
     * Siapa yang boleh mengedit siswa?
     * PERBAIKAN: Tambahkan '= null' untuk membuat $siswa opsional.
     */
    public function update(User $user, Siswa $siswa = null): bool
    {
        return false;
    }

    /**
     * Siapa yang boleh menghapus siswa?
     * PERBAIKAN: Tambahkan '= null' untuk membuat $siswa opsional.
     */
    public function destroy(User $user, Siswa $siswa = null): bool
    {
        return false;
    }
}
