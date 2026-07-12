<?php

return [
    'resources' => [
        'users' => ['view', 'create', 'update', 'delete'],
        'projects' => ['view', 'create', 'update', 'delete'],
        'sites' => ['view', 'create', 'update', 'delete'],
        'categories' => ['view', 'create', 'update', 'delete'],
        'observations' => ['view', 'view_all', 'create', 'update', 'delete'],
    ],

    'master_data' => [
        'users',
        'projects',
        'sites',
        'categories',
    ],
];
