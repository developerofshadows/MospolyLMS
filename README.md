
# Гайдлайн по разработке микросервисов
## Автор: _MistDev_


Этот гайд создан для упрощения процесса внедрения новых разработчиков, 
в backend команду разработки. Но он носит рекомендательный характер.

Что вы получите после прочтения этого гайда:

- Вы научитесь настраивать рабочую среду
- Поймёте суть микросервесной архетиктуры
- Научитесь сами разрабатовать и интегрировать микросервисы
- И т.д.

## Загрузка инструментов разработки

На данный момент мы используем технологический стак MERN(Mongo,Express,React,NodeJS)
И для разработки были выбранны следующие компоненты:
- [Visual Studio Code][vscode]
- [MongoDB-Compass][compass]
- [Postman]
- [Git]
- [NodeJS]

Вам нужно будет пройти по каждой ссылке и установить компоненты.


## Настройка рабочего окружения _(опционально)_

Рекомендуется установить следующие плагины на VS-Code:
- _Material Icon Theme_
- _One Dark Pro_
- _Remote - SSH_
- _Tabnine AI_



## Начало разработки

Перед тем как начать разбратоку нового микросервиса желательно получить актуальную версию
проекта с его github репозитория. Сделать это можно следующим образом:

- Открыть VS-Code
- Нажать CTRL+K CTRL+O (последовательно)
- В диалоговом окне создать в удобном месте папку для хранения исходников проекта _и назвать её Github (необязательно)_
- Нажать в правом нижнем углу выбрать папку
- Нажать CTRL+SHIFT+` для открытия консоли
- Далее все комнады вводить в консоль

```sh
git clone https://github.com/MospolyLMS/lms-micro
cd lms-micro
npm install
```


## 1. Разработка микросервиса (initial step)

Разработка начинается с создания папки вашего микросервиса. `Название папки сторого должно`
`состоять только из имени вашего микросервиса на английском языке без дефисов,сокращений в одно слово.`
---
> Пример: Сервис расписания
 Расписание = timetable
 Название папки - timetable
 ---
>Пример: Сервис Д.З.
 Д.З. = homework
 Название папки - homework
 ---
 
 После создания папки сервиса, стоит создать в ней следующую структуру папок
 `Здесь и далее вместо [service_name] вам нужно вставить имя своего сервиса`

```
lms-micro
│   frontend
│   gateway
│   ...
└───[service_name]
│   │   .env
│   └───src
│       │   index.ts
│       └───config
│           │  config.ts
```

Затем нужно выполнить следующие команды в консоли:

```sh
cd [service_name]
tsc --init
npm init --y
npm i axios cors dotenv express
```

Затем нужно зайти в файл tsconfig.json и заменить:

   **"outDir": ""**    на   **"outDir": "./build"**, 
 
Затем нужно зайти в файл package.json и заменить:

---
```js
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```
---

 **На это**

---

```js
"scripts": {
    "prod": "NODE_ENV=prod node build/index.js",
    "dev": "NODE_ENV=dev node build/index.js"
  },
```

## 2. Разработка микросервиса (создание сервера)

Для создания сервера нам нужно открыть файл index.ts и вставить туда этот код:

```js
import express,{Express,Request,Response,NextFunction} from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import { config } from './config/config'

const app:Express = express()

app.use(express.json())
app.use(cookieParser())

app.get('/',(req:Request, res:Response, next:NextFunction) => {
    return res.status(200).json({"msg":"Hello from [service_name]"})
})

app.use('*',(req:Request, res:Response, next:NextFunction)=>{
    return res.status(404).json('Requested API method is not registered. Please check url and method of request')
})

app.listen(config.SERVICE_PORT,()=>{
    if(config.DB_URL !== undefined)mongoose.connect(config.DB_URL)
    console.log(`[service_name] tarted on port ${config.SERVICE_PORT}`)
})
```

Затем в файл config.ts вставить этот код:

```js
import * as dotenv from "dotenv"

console.clear()

function check_variables(config: object){

    type ObjectKey = keyof typeof config;

    for(let i=0;i<Object.keys(config).length;i++){
        let object_key_name = Object.keys(config)[i] as ObjectKey;
        if(config[object_key_name]===undefined){
            throw new Error(`Broken config! Bad place is: ${Object.keys(config)[i]}`)
        }
    }

    console.log(`${Object.keys(config).length} params passed test. Config is OK!`)
}

if(process.env.NODE_ENV!=="prod"){
    const config_path = `./.env.${process.env.NODE_ENV}`
    dotenv.config({path: config_path})
}

else{
    dotenv.config()
}

console.log(`Loading "${process.env.NODE_ENV?.toLocaleUpperCase()}" config...`)

const config = {
    SERVICE_PORT:process.env.SERVICE_PORT,
    DB_URL:process.env.DB_URL,
    CHECK_CONFIG:process.env.CHECK_CONFIG,
}


if(config.CHECK_CONFIG!==undefined){
    if(process.env.CHECK_CONFIG) check_variables(config)
}

else throw new Error(`There is no ${process.env.NODE_ENV?.toLocaleUpperCase()} config found!`)

export {config};
```

## 3. Разработка микросервиса (получение запроса)

Это основная часть написания микросервиса, на этом этапе добавляется основная логика получения запроса.

В файл index.ts стоит добавить код принимающий запрос по опредлённому маршруту.
```js
app.{request_method}('/{request_path}', async(req:Request, res:Response, next:NextFunction) => {

try {

	// {some_code} 
	
} catch(e:unknown){

next(e)

}

})
````

| Переменная | Объяснение|
| ------ | ------ |
| request_method | Http метод по которому обращаются к этому пути (для нашей работы нужны только GET и POST) ((см. справку)) |
| request_path| Путь по которому обращаются к данному части кода (совпадает с названием функции которая орабатывает логику) ((см. справку)) |
| some_code | Часть кода вызывающая функцию обработчик и возвращающая результат |

## 4. Разработка микросервиса (создание логики)

Это вторая основная часть написания микросервиса, на этом этапе добавляется логика для обработки запроса.

В папке **src** нужно создать папку **service** и в ней файл *[Service_Name]Service.ts*
В файл *[Service_Name]Service.ts* добавить код отвечающий за класс сервиса.
```js
class UserService {
	...
	async {function_name}({request_params}): Promise<{response_data_type}>{
		// {function_code}	
	}
	...
}
export default new UserService();
````

| Переменная | Объяснение|
| ------ | ------ |
| function_name | Название функции (см. справку)|
| request_params| Параметры передоваемые в функцию и их тип |
| response_data_type| Данные передоваемые из функции и их тип |
| function_code| Часть кода отвечающая за логику функции,которая обрабатывает данные |

## P.S. - Справка 

*request_method* - POST для важных данных (пароли,ключи и тд.), GET для публичных данных (номер группы, предмет, курс и т.д.)
*function_name,request_path* -  логичное название функции и пути для неё,всё пишется в одно слово на английском. Если она предназначена для получения данных, то стоит в начало добавить get.  Стоит каждое новое слово начинать с новой буквы (Пример: ~~getlastupdate~~ getLastUpdate)

   [vscode]: <https://code.visualstudio.com/>
   [compass]:<https://www.mongodb.com/products/compass>
   [postman]:<https://www.postman.com/>
   [git]: <https://git-scm.com/>
   [nodejs]: <https://nodejs.org/>
