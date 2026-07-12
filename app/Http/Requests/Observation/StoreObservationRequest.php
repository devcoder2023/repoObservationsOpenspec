<?php

namespace App\Http\Requests\Observation;

use App\Enums\ObservationShift;
use App\Enums\RiskDegree;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreObservationRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([
            'shift' => (int) $this->shift,
            'risk_degree' => (int) $this->risk_degree,
        ]);
    }

    public function rules(): array
    {
        return [
            'image_before' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:10240'],
            'comment_before' => ['nullable', 'string', 'max:5000'],
            'image_after' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:10240'],
            'comment_after' => ['nullable', 'string', 'max:5000'],
            'project_id' => ['required', 'integer', 'exists:projects,id'],
            'site_id' => ['nullable', 'integer', 'exists:sites,id'],
            'custom_site' => ['nullable', 'string', 'max:255'],
            'shift' => ['required', new Enum(ObservationShift::class)],
            'observation_category_id' => ['required', 'integer', 'exists:observation_categories,id'],
            'risk_degree' => ['required', new Enum(RiskDegree::class)],
        ];
    }
}
