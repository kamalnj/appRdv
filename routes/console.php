<?php

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schedule;


Schedule::call(function () {
    DB::table('activity_log')->delete();
})->weekly();

Schedule::call(function () {
    DB::table('rdvs')
        ->where('date_rdv', '<=', Carbon::now())
        ->where('status', 'scheduled')
        ->update(['status' => 'cancelled']);
})->daily();
