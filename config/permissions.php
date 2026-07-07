<?php

return [
    'resources' => [
        'users' => ['view', 'create', 'update', 'delete'],
        'projects' => ['view', 'create', 'update', 'delete'],
        'locations' => ['view', 'create', 'update', 'delete'],
        'categories' => ['view', 'create', 'update', 'delete'],
        'observations' => ['view', 'create', 'update', 'delete'],
    ],

    'master_data' => [
        'users',
        'projects',
        'locations',
        'categories',
    ],
];
