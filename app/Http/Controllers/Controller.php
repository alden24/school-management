<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests; // 1. Pastikan baris ini ada
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    // 2. Pastikan Anda menggunakan trait ini
    use AuthorizesRequests, ValidatesRequests;
}
