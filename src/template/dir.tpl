<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>{{ title }}</title>
        <style>
            *{
                margin: 0;
                padding: 0;
            }
            div{
                display: flex;
                align-items: flex-end;
            }
            a{
                color: green;
            }
            img{
                width: 30px;
                height: 30px;
            }
        </style>
    </head>
    <body>
        {{#each files}}
        <div>
            <!-- handlebar模板认为dir和splitter是和files同级，所以需要../ -->
            <img src="{{icon}}" />
            <a href="{{../dir}}{{../splitter}}{{file}}">{{file}}</a>
        </div>
        {{/each}}
    </body>
</html>
