<?php

namespace App\Models;

use App\Enums\ObservationShift;
use App\Enums\ObservationStatus;
use App\Enums\RiskDegree;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $image_before
 * @property string|null $comment_before
 * @property string|null $image_after
 * @property string|null $comment_after
 * @property int $project_id
 * @property int|null $site_id
 * @property string|null $custom_site
 * @property ObservationShift $shift
 * @property int|null $observation_category_id
 * @property RiskDegree $risk_degree
 * @property ObservationStatus $status
 * @property int $creator_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Project|null $project
 * @property-read Site|null $site
 * @property-read ObservationCategory|null $category
 * @property-read User|null $creator
 */
#[Fillable([
    'image_before', 'comment_before', 'image_after', 'comment_after',
    'project_id', 'site_id', 'custom_site', 'shift',
    'observation_category_id', 'risk_degree', 'status', 'creator_id',
])]
class Observation extends Model
{
    /** @return BelongsTo<Project, $this> */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /** @return BelongsTo<Site, $this> */
    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    /** @return BelongsTo<ObservationCategory, $this> */
    public function category(): BelongsTo
    {
        return $this->belongsTo(ObservationCategory::class, 'observation_category_id');
    }

    /** @return BelongsTo<User, $this> */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    protected function casts(): array
    {
        return [
            'shift' => ObservationShift::class,
            'risk_degree' => RiskDegree::class,
            'status' => ObservationStatus::class,
        ];
    }
}
