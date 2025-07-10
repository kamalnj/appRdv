<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class adminController extends Controller
{
       public function admin()
    {
        return Inertia::render('Admin/user');
    }
}
