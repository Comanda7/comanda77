document.addEventListener('DOMContentLoaded', function() {
    const accordionContainer = document.getElementById('accordionContainer');
    const searchInput = document.getElementById('searchInput');
    const visibleCount = document.getElementById('visibleCount');
    const totalCount = document.getElementById('totalCount');
    const currentDate = document.getElementById('currentDate');
    
    let commands = [];
    let filteredCommands = [];
    
    // Устанавливаем текущую дату
    currentDate.textContent = new Date().toLocaleDateString('ru-RU');
    
    // Данные NestJS
    const nestData = [
        {
            "id": 1,
            "command": "nest new project-name",
            "category": "CLI",
            "description": "Создает новое NestJS приложение с базовой структурой проекта.",
            "usage": "nest new <project-name>",
            "parameters": [
                {"name": "--package-manager", "description": "Выбор менеджера пакетов (npm, yarn, pnpm)"},
                {"name": "--skip-git", "description": "Пропустить инициализацию git репозитория"},
                {"name": "--skip-install", "description": "Пропустить установку зависимостей"}
            ],
            "examples": [
                "nest new my-nest-app",
                "nest new api --package-manager yarn",
                "nest new project --skip-git"
            ]
        },
        {
            "id": 2,
            "command": "nest generate module users",
            "category": "CLI",
            "description": "Генерирует новый модуль с указанным именем. Модули организуют код в логические группы.",
            "usage": "nest generate module <name>",
            "parameters": [
                {"name": "--flat", "description": "Не создавать папку для модуля"},
                {"name": "--no-spec", "description": "Не создавать тестовый файл"}
            ],
            "examples": [
                "nest g module users",
                "nest generate module auth --no-spec",
                "nest g mo products"
            ]
        },
        {
            "id": 3,
            "command": "nest generate controller",
            "category": "CLI",
            "description": "Создает новый контроллер для обработки HTTP запросов.",
            "usage": "nest generate controller <name>",
            "parameters": [
                {"name": "--flat", "description": "Не создавать папку"},
                {"name": "--no-spec", "description": "Не создавать тестовый файл"}
            ],
            "examples": [
                "nest g controller users",
                "nest generate controller posts --no-spec",
                "nest g co auth"
            ]
        },
        {
            "id": 4,
            "command": "nest generate service",
            "category": "CLI",
            "description": "Создает новый сервис для бизнес-логики приложения.",
            "usage": "nest generate service <name>",
            "parameters": [
                {"name": "--flat", "description": "Не создавать папку"},
                {"name": "--no-spec", "description": "Не создавать тестовый файл"}
            ],
            "examples": [
                "nest g service users",
                "nest generate service auth --no-spec",
                "nest g s products"
            ]
        },
        {
            "id": 5,
            "command": "@Controller()",
            "category": "Декораторы",
            "description": "Декоратор класса, который определяет контроллер для обработки HTTP запросов.",
            "usage": "@Controller('path')",
            "parameters": [
                {"name": "path", "description": "Префикс пути для всех роутов контроллера (опционально)"}
            ],
            "examples": [
                "@Controller('users')",
                "@Controller() // без префикса",
                "@Controller('api/v1/auth')"
            ],
            "notes": "Все методы внутри класса становятся обработчиками HTTP запросов."
        },
        {
            "id": 6,
            "command": "@Get()",
            "category": "Декораторы",
            "description": "Декоратор метода для обработки HTTP GET запросов.",
            "usage": "@Get('path')",
            "parameters": [
                {"name": "path", "description": "Путь относительно контроллера (опционально)"}
            ],
            "examples": [
                "@Get() // корневой путь",
                "@Get(':id') // с параметром",
                "@Get('profile/:userId')"
            ]
        },
        {
            "id": 7,
            "command": "@Post()",
            "category": "Декораторы",
            "description": "Декоратор метода для обработки HTTP POST запросов.",
            "usage": "@Post('path')",
            "parameters": [
                {"name": "path", "description": "Путь относительно контроллера (опционально)"}
            ],
            "examples": [
                "@Post()",
                "@Post('create')",
                "@Post(':id/update')"
            ]
        },
        {
            "id": 8,
            "command": "@Put()",
            "category": "Декораторы",
            "description": "Декоратор метода для обработки HTTP PUT запросов.",
            "usage": "@Put('path')",
            "parameters": [
                {"name": "path", "description": "Путь относительно контроллера (опционально)"}
            ],
            "examples": [
                "@Put(':id')",
                "@Put('update/:id')"
            ]
        },
        {
            "id": 9,
            "command": "@Delete()",
            "category": "Декораторы",
            "description": "Декоратор метода для обработки HTTP DELETE запросов.",
            "usage": "@Delete('path')",
            "parameters": [
                {"name": "path", "description": "Путь относительно контроллера (опционально)"}
            ],
            "examples": [
                "@Delete(':id')",
                "@Delete('remove/:id')"
            ]
        },
        {
            "id": 10,
            "command": "@Module()",
            "category": "Декораторы",
            "description": "Декоратор класса, который определяет модуль NestJS. Модули являются основными строительными блоками.",
            "usage": "@Module({})",
            "parameters": [
                {"name": "imports", "description": "Другие модули, которые экспортируют необходимые провайдеры"},
                {"name": "controllers", "description": "Набор контроллеров, определенных в этом модуле"},
                {"name": "providers", "description": "Провайдеры, которые будут инстанцированы Nest инжектором"},
                {"name": "exports", "description": "Подмножество providers, которое доступно другим модулям"}
            ],
            "examples": [
                `@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})`
            ]
        },
        {
            "id": 11,
            "command": "@Injectable()",
            "category": "Декораторы",
            "description": "Декоратор класса, который помечает класс как провайдер, который может быть внедрен через конструктор.",
            "usage": "@Injectable()",
            "examples": [
                "@Injectable()\nexport class UsersService {}"
            ],
            "notes": "Все сервисы, репозитории, фабрики и другие провайдеры должны быть помечены этим декоратором."
        },
        {
            "id": 12,
            "command": "@Param()",
            "category": "Декораторы",
            "description": "Декоратор параметра для извлечения параметров маршрута.",
            "usage": "@Param() или @Param('id')",
            "parameters": [
                {"name": "property", "description": "Имя параметра маршрута (опционально)"}
            ],
            "examples": [
                "getUser(@Param('id') id: string)",
                "getUser(@Param() params: any)"
            ]
        },
        {
            "id": 13,
            "command": "@Query()",
            "category": "Декораторы",
            "description": "Декоратор параметра для извлечения query параметров из URL.",
            "usage": "@Query() или @Query('name')",
            "parameters": [
                {"name": "property", "description": "Имя query параметра (опционально)"}
            ],
            "examples": [
                "search(@Query('q') query: string)",
                "filter(@Query() filters: FilterDto)"
            ]
        },
        {
            "id": 14,
            "command": "@Body()",
            "category": "Декораторы",
            "description": "Декоратор параметра для извлечения тела HTTP запроса.",
            "usage": "@Body()",
            "examples": [
                "create(@Body() createUserDto: CreateUserDto)",
                "update(@Body('email') email: string)"
            ]
        },
        {
            "id": 15,
            "command": "@Headers()",
            "category": "Декораторы",
            "description": "Декоратор параметра для извлечения HTTP заголовков.",
            "usage": "@Headers() или @Headers('authorization')",
            "parameters": [
                {"name": "property", "description": "Имя заголовка (опционально)"}
            ],
            "examples": [
                "auth(@Headers('authorization') authHeader: string)",
                "getAllHeaders(@Headers() headers: any)"
            ]
        },
        {
            "id": 16,
            "command": "ValidationPipe",
            "category": "Pipes",
            "description": "Встроенный пайп для валидации данных на основе class-validator.",
            "usage": "app.useGlobalPipes(new ValidationPipe())",
            "parameters": [
                {"name": "whitelist", "description": "Удаляет свойства без декораторов"},
                {"name": "forbidNonWhitelisted", "description": "Выбрасывает ошибку при наличии лишних полей"},
                {"name": "transform", "description": "Автоматически преобразует типы"}
            ],
            "examples": [
                "app.useGlobalPipes(new ValidationPipe({ whitelist: true }))",
                "app.useGlobalPipes(new ValidationPipe({ transform: true }))"
            ]
        },
        {
            "id": 17,
            "command": "@UsePipes()",
            "category": "Pipes",
            "description": "Декоратор для применения pipes к контроллеру или методу.",
            "usage": "@UsePipes(pipe)",
            "examples": [
                "@UsePipes(ValidationPipe)",
                "@UsePipes(new JoiValidationPipe(schema))"
            ]
        },
        {
            "id": 18,
            "command": "@UseGuards()",
            "category": "Guards",
            "description": "Декоратор для применения guards к контроллеру или методу.",
            "usage": "@UseGuards(guard)",
            "examples": [
                "@UseGuards(JwtAuthGuard)",
                "@UseGuards(RolesGuard)"
            ]
        },
        {
            "id": 19,
            "command": "JwtModule",
            "category": "Модули",
            "description": "Модуль для работы с JWT (JSON Web Tokens) аутентификацией.",
            "usage": "JwtModule.register({})",
            "parameters": [
                {"name": "secret", "description": "Секретный ключ для подписи токенов"},
                {"name": "signOptions", "description": "Опции для подписи токенов"}
            ],
            "examples": [
                `JwtModule.register({
  secret: 'secretKey',
  signOptions: { expiresIn: '60s' }
})`
            ]
        },
        {
            "id": 20,
            "command": "TypeORM Module",
            "category": "Модули",
            "description": "Модуль для интеграции с TypeORM - ORM для работы с базами данных.",
            "usage": "TypeOrmModule.forRoot({})",
            "parameters": [
                {"name": "type", "description": "Тип базы данных (postgres, mysql, sqlite и т.д.)"},
                {"name": "host", "description": "Хост базы данных"},
                {"name": "port", "description": "Порт базы данных"},
                {"name": "database", "description": "Имя базы данных"},
                {"name": "entities", "description": "Сущности TypeORM"}
            ],
            "examples": [
                `TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'user',
  password: 'password',
  database: 'nestdb',
  entities: [User, Product],
  synchronize: true
})`
            ]
        }
    ];

    // Генерируем дополнительные элементы до 200
    const generateAdditionalItems = () => {
        const categories = ['Миделвары', 'Интерсепторы', 'Кастомные декораторы', 'Конфигурация', 'Тестирование', 'WebSockets', 'ГрафQL', 'Микросервисы'];
        const additionalItems = [];
        
        for (let i = 21; i <= 200; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const types = {
                'Миделвары': ['LoggerMiddleware', 'AuthMiddleware', 'CorsMiddleware'],
                'Интерсепторы': ['LoggingInterceptor', 'TransformInterceptor', 'TimeoutInterceptor'],
                'Кастомные декораторы': ['@Roles()', '@Public()', '@CurrentUser()'],
                'Конфигурация': ['ConfigModule', 'ConfigurationService', 'Environment variables'],
                'Тестирование': ['Test.createTestingModule()', 'jest', 'e2e тесты'],
                'WebSockets': ['@WebSocketGateway()', '@SubscribeMessage()', '@WebSocketServer()'],
                'ГрафQL': ['@Resolver()', '@Query()', '@Mutation()'],
                'Микросервисы': ['@MessagePattern()', '@EventPattern()', 'ClientProxy']
            };
            
            const type = types[category][Math.floor(Math.random() * types[category].length)];
            
            additionalItems.push({
                id: i,
                command: `${type} ${Math.random() > 0.5 ? 'пример' : ''}`.trim(),
                category: category,
                description: `Пример использования ${type.toLowerCase()} в контексте ${category.toLowerCase()}. Этот элемент демонстрирует основные концепции и применение.`,
                usage: `// Пример использования\n${type}.use(config)`,
                parameters: [
                    { name: 'param1', description: 'Первый параметр для настройки' },
                    { name: 'param2', description: 'Второй параметр с дополнительными опциями' }
                ],
                examples: [
                    `// Базовый пример\nconst instance = new ${type}();`,
                    `// Расширенное использование\n${type}.configure({ options: true });`
                ]
            });
        }
        
        return [...nestData, ...additionalItems];
    };

    // Инициализация данных
    commands = generateAdditionalItems();
    filteredCommands = [...commands];
    totalCount.textContent = commands.length;
    renderAccordion();
    
    // Функция для создания HTML аккордеона
    function renderAccordion() {
        if (filteredCommands.length === 0) {
            accordionContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>Элементы не найдены. Попробуйте изменить поисковый запрос.</p>
                </div>
            `;
            visibleCount.textContent = '0';
            return;
        }
        
        accordionContainer.innerHTML = '';
        visibleCount.textContent = filteredCommands.length;
        
        filteredCommands.forEach((command, index) => {
            const item = document.createElement('div');
            item.className = 'accordion-item';
            
            const hasNotes = command.notes ? `<div class="notes">
                <h4><i class="fas fa-sticky-note"></i> Примечания:</h4>
                <div class="important-note">${command.notes}</div>
            </div>` : '';
            
            item.innerHTML = `
                <div class="accordion-header" onclick="toggleAccordion(${index})">
                    <div class="command-title">
                        <i class="fas fa-code command-icon"></i>
                        <span class="command-name">${command.command}</span>
                        <span class="command-category">${command.category}</span>
                        ${command.id <= 20 ? '<span class="nest-badge">основной</span>' : ''}
                    </div>
                    <i class="fas fa-chevron-down accordion-toggle" id="toggle-${index}"></i>
                </div>
                <div class="accordion-content" id="content-${index}">
                    <div class="accordion-content-inner">
                        <div class="description">
                            ${command.description}
                        </div>
                        ${command.usage ? `
                        <div class="usage">
                            <h4><i class="fas fa-terminal"></i> Использование:</h4>
                            <pre>${command.usage}</pre>
                        </div>` : ''}
                        ${command.parameters && command.parameters.length > 0 ? `
                        <div class="parameters">
                            <h4><i class="fas fa-cogs"></i> Параметры:</h4>
                            <ul class="param-list">
                                ${command.parameters.map(param => `
                                    <li><span class="param-name">${param.name}</span>: ${param.description}</li>
                                `).join('')}
                            </ul>
                        </div>` : ''}
                        ${command.examples && command.examples.length > 0 ? `
                        <div class="examples">
                            <h4><i class="fas fa-lightbulb"></i> Примеры:</h4>
                            ${command.examples.map(example => `
                                <div class="example-block">
                                    <pre>${example}</pre>
                                </div>
                            `).join('')}
                        </div>` : ''}
                        ${hasNotes}
                    </div>
                </div>
            `;
            accordionContainer.appendChild(item);
        });
    }
    
    // Функция для переключения аккордеона
    window.toggleAccordion = function(index) {
        const content = document.getElementById(`content-${index}`);
        const toggle = document.getElementById(`toggle-${index}`);
        
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
            toggle.classList.remove('rotated');
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
            toggle.classList.add('rotated');
        }
    };
    
    // Функция для поиска
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            filteredCommands = [...commands];
        } else {
            filteredCommands = commands.filter(command => 
                command.command.toLowerCase().includes(searchTerm) ||
                command.description.toLowerCase().includes(searchTerm) ||
                command.category.toLowerCase().includes(searchTerm) ||
                (command.parameters && command.parameters.some(p => 
                    p.name.toLowerCase().includes(searchTerm) ||
                    p.description.toLowerCase().includes(searchTerm)
                ))
            );
        }
        
        renderAccordion();
        
        // Закрываем все открытые аккордеоны после поиска
        document.querySelectorAll('.accordion-content').forEach(content => {
            content.style.maxHeight = null;
        });
        document.querySelectorAll('.accordion-toggle').forEach(toggle => {
            toggle.classList.remove('rotated');
        });
    });
    
    // Добавляем поддержку горячих клавиш
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            searchInput.focus();
        }
    });
});