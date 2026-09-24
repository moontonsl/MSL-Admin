<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    //
    protected $table = 'msl_news_data';

    protected $fillable = [
        'news_canonical',
        'news_state',
        'news_title',
        'news_subtitle',
        'news_published',
        'news_writer',
        'news_img1',
        'news_img2',
        'news_img3',
        'news_content',
    ];
}
