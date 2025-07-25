<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    protected $policies = [
        \App\Models\Siswa::class => \App\Policies\SiswaPolicy::class,
        \App\Models\JurnalHarian::class => \App\Policies\JurnalHarianPolicy::class,
    ];
    
    public function register(): void
    {
        
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
