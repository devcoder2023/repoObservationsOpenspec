<?php

return [
    'resources' => [
        'users' => ['view', 'create', 'update', 'delete'],
        'projects' => ['view', 'create', 'update', 'delete'],
        'sites' => ['view', 'create', 'update', 'delete'],
        'categories' => ['view', 'create', 'update', 'delete'],
        'observations' => ['view', 'create', 'update', 'delete'],
    ],

    'master_data' => [
        'users',
        'projects',
        'sites',
        'categories',
    ],
];
