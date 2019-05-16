# BaselineGenerator
This is an automation tool for creating baseline data.

## Get Code
```sh
   $ git clone https://github.com/01org/web-test-suite
   $ cd web-test-suite/tool/BaselineGenerator
   $ npm install
```

## Set Configurations
   There are two fields in the config.json:

```
   {
     "Version": {
       "chromium": "313c1c2",
       "polyfill": "cfa0a2f"
     },
     "CPUType": "x64"
   }
```

## Run Tests

```sh
$ npm start
```

## Support Platforms

|  Linux  |   Mac   |  Windows  |
|  :---:  |  :---:  |   :---:   |
|  PASS   |   PASS  |    PASS   |
