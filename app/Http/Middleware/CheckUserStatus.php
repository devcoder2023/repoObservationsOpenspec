<?php

namespace App\Http\Middleware;

use App\Enums\UserStatus;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserStatus
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->status !== UserStatus::Active) {
            auth()->logout();

            $message = $user->status === UserStatus::Suspended
                ? 'Your account has been suspended. Please contact an administrator.'
                : 'Your account is inactive. Please contact an administrator.';

            return redirect()->route('login')->with('error', $message);
        }

        return $next($request);
    }
}
