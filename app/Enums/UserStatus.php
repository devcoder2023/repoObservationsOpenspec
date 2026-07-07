<?php

namespace App\Enums;

enum UserStatus: int
{
    case Active = 1;
    case Inactive = 2;
    case Suspended = 3;
}
