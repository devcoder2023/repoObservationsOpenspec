<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property-read Collection<int, Observation> $observations
 */
#[Fillable(['name'])]
class ObservationCategory extends Model
{
    use SoftDeletes;

    /** @return HasMany<Observation, $this> */
    public function observations(): HasMany
    {
        return $this->hasMany(Observation::class, 'observation_category_id');
    }
}
