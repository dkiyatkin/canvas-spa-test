Создать 2 канваса 600x600 и 600x50, нарисовать в большем 5 закрашенных 5-и конечных звезд. Красного, синего, зеленого, желтого и черного цветов и по клику мышкой на цветной звезде - закрашивать маленький канвас - соответствующим цветом. При клике на белую (не закрашенную) область большого канваса - маленький канвас - закрашивать белым.

Single Page Application (SPA) приложение для редактирования списка пользователей:  
a. Одна страница, таблица с полями: имя, телефон. Кнопки: общая - добавить, для каждой строки данных - редактировать, стереть.  
b. Под таблицей поля для ввода имени и телефона.  
c. При нажатии кнопки добавить - в таблицу добавляется пользователь с данными из заполненных полей. Валидация: имя не пустое, телефон состоит только из цифр, тире (возможен "+" как первый символ). Если валидация не пройдена - где то рядом появляется сообщение об ошибке.  
d. Редактирование - поля в списке превращаются в текстовые и появляется кнопка для сохранения изменений (или же кнопка для начала редактирования превращается в кнопку сохранения). Валидация такая же, как и при добавлении.  
e. Удаление - удаляет строку.  
f. Начальные данные: 4-5 пользователей.  
g. Связи с сервером нет, но должны быть placeholders. Т.е. Там, где должна быть свзяль с сервером (AJAX) что-то должно быть (может, закомментированное).  
h. Требования: CoffeeScript, Backbone.js. Для проверки знаний - лучше частично использовать нативное взаимодействие с DOM, не jQuery. jQuery знают все, а вот getElementById - нет.  
i. Пакет: "исходник" на CoffeeScript и скомпилированный код на JavaScript, или сразу JavaScript, если на нем оригинал.
