<?php

namespace App\Http\Responses;

use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;
use Symfony\Component\HttpFoundation\Response;

class RegisterResponse implements RegisterResponseContract
{
    public function toResponse($request): Response
    {
        auth()->logout();

        if ($request instanceof Request) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return $request->wantsJson()
            ? response()->json(['two_factor' => false])
            : redirect()->route('login')->with('status', 'Account created. An administrator must activate your account before you can log in.');
    }
}
