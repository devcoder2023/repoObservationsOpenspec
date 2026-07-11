<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSiteRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('sites')->ignore($this->route('site'))],
            'project_id' => ['required', 'integer', 'exists:projects,id'],
        ];
    }
}
