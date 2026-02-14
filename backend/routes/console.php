<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Carbon;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// You can add your custom console commands here
// Artisan::command('custom:command', function () {
//     $this->info('Custom command executed!');
// })->purpose('Execute a custom command');