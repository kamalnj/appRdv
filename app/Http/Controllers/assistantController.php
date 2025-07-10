<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class assistantController extends Controller
{
       public function assistantDashboard()
    {
        return Inertia::render('Assistante/dashboardA');
    }
}
