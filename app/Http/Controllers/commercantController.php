<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class commercantController extends Controller
{
       public function commercantDashboard()
    {
        return Inertia::render('Commercant/dashboardC');
    }
}
