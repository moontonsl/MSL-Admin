<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'year_level' => ['nullable', 'string', 'max:255'],
            'squadName' => ['nullable', 'string', 'max:255'],
            'ml_ign' => ['nullable', 'string', 'max:255'],
            'ml_id' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique(User::class, 'ml_id')->ignore($this->user()->id),
            ],
            'ml_server' => ['nullable', 'string', 'max:255'],
            'contact_number' => ['nullable', 'string', 'max:20'],
            'facebook_link' => ['nullable', 'string', 'max:255'],
        ];
    }
}
