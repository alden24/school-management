<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Prakerin;
use Carbon\Carbon;

class UpdatePrakerinStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'prakerin:update-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Memperbarui status prakerin menjadi Berlangsung atau Selesai berdasarkan tanggal';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = Carbon::today()->toDateString();

        // 1. Ubah status menjadi "Berlangsung"
        $toStart = Prakerin::where('status', 'Diterima DUDI')
            ->where('tanggal_mulai', '<=', $today)
            ->get();

        foreach ($toStart as $prakerin) {
            $prakerin->update(['status' => 'Berlangsung']);
            $this->info("Status Prakerin untuk siswa ID: {$prakerin->siswa_id} diubah menjadi Berlangsung.");
        }

        // 2. Ubah status menjadi "Selesai"
        $toFinish = Prakerin::where('status', 'Berlangsung')
            ->where('tanggal_selesai', '<', $today)
            ->get();

        foreach ($toFinish as $prakerin) {
            $prakerin->update(['status' => 'Selesai']);
            $this->info("Status Prakerin untuk siswa ID: {$prakerin->siswa_id} diubah menjadi Selesai.");
        }

        $this->info('Pembaruan status Prakerin selesai.');
        return 0;
    }
}
